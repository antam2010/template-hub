import ts from "typescript";
import { readFile, readdir } from "node:fs/promises";
import { resolve, relative, extname } from "node:path";
import { pathToFileURL } from "node:url";
export function auditSource(text, policy, file = "screen.tsx") {
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const errors = [];
  const uiNames = new Set();
  const fail = (node, message) => {
    const pos = source.getLineAndCharacterOfPosition(node.getStart(source));
    errors.push(`${file}:${pos.line + 1}: ${message}`);
  };
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const module = statement.moduleSpecifier.text;
    if (!policy.allowedImports.includes(module))
      fail(statement, `승인되지 않은 import: ${module}`);
    const allowed = policy.allowedUiExports[module];
    const bindings = statement.importClause?.namedBindings;
    if (allowed) {
      if (
        statement.importClause?.name ||
        !bindings ||
        !ts.isNamedImports(bindings)
      ) {
        fail(statement, "공통 UI는 named import만 허용합니다.");
        continue;
      }
      for (const e of bindings.elements) {
        const original = (e.propertyName ?? e.name).text;
        if (!allowed.includes(original))
          fail(e, `승인되지 않은 export: ${original}`);
        else if (!e.isTypeOnly && !statement.importClause?.isTypeOnly)
          uiNames.add(e.name.text);
      }
    }
  }
  function visit(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = node.tagName.getText(source);
      if (!policy.allowedHtml.includes(name) && !uiNames.has(name))
        fail(node, `공통 UI를 사용하세요: <${name}>`);
      for (const a of node.attributes.properties) {
        if (ts.isJsxSpreadAttribute(a))
          fail(a, "JSX 속성 spread는 검토할 수 없어 금지합니다.");
        else if (
          ["style", "className", "dangerouslySetInnerHTML"].includes(
            a.name.getText(source),
          )
        )
          fail(a, "화면에서 스타일/HTML을 직접 작성할 수 없습니다.");
      }
    }
    if (ts.isExportDeclaration(node))
      fail(node, "화면에서 모듈 재수출은 허용하지 않습니다.");
    if (ts.isCallExpression(node)) {
      const expression = node.expression.getText(source);
      if (
        node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        /createElement|cloneElement|require|eval|Function|createPortal|insertRule|insertAdjacentHTML|write/.test(
          expression,
        )
      )
        fail(node, "동적 코드·UI 생성은 금지합니다.");
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ["document", "window", "globalThis"].includes(
        node.expression.getText(source),
      ) &&
      !(
        policy.bootstrap &&
        node.expression.getText(source) === "document" &&
        node.name.text === "getElementById" &&
        ts.isCallExpression(node.parent) &&
        node.parent.arguments.length === 1 &&
        ts.isStringLiteral(node.parent.arguments[0]) &&
        node.parent.arguments[0].text === "root"
      )
    )
      fail(node, "화면에서 전역 DOM 접근은 금지합니다.");
    if (ts.isElementAccessExpression(node))
      fail(node, "동적 속성 접근은 공통 UI 검토가 필요합니다.");
    if (
      ts.isPropertyAccessExpression(node) &&
      ["innerHTML", "outerHTML", "style"].includes(node.name.text)
    )
      fail(node, "직접 DOM/스타일 변경은 금지합니다.");
    ts.forEachChild(node, visit);
  }
  visit(source);
  return errors;
}
export async function checkProject(project) {
  const policy = JSON.parse(
    await readFile(resolve(project, "ui-policy.json"), "utf8"),
  );
  const errors = [];
  for (const root of policy.sourceRoots) {
    async function walk(dir) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = resolve(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
          continue;
        }
        const file = relative(project, full);
        if (![".ts", ".tsx"].includes(extname(full))) {
          errors.push(`${file}: 화면 소스는 TS/TSX만 허용합니다.`);
          continue;
        }
        const text = await readFile(full, "utf8");
        // The sole stylesheet entry is an explicit, reviewed bootstrap import.
        const p =
          file === "src/main.tsx"
            ? {
                ...policy,
                bootstrap: true,
                allowedHtml: [...policy.allowedHtml, "App"],
                allowedImports: [...policy.allowedImports, "./App"],
              }
            : policy;
        errors.push(...auditSource(text, p, file));
      }
    }
    await walk(resolve(project, root));
  }
  return errors;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const index = process.argv.indexOf("--project");
  const project = resolve(index < 0 ? "." : process.argv[index + 1]);
  const errors = await checkProject(project);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else console.log("UI policy passed: approved package composition");
}
