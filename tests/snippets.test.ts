import { test, expect } from "vitest";
import ts from "typescript";
import { demoCode } from "../apps/showcase/src/ComponentDemo";
import { componentNames } from "../packages/patterns/src/index";
test.each(componentNames)(
  "%s usage snippet parses with arbitrary user labels",
  (name) => {
    const code = demoCode({
      name,
      label: '<タグ> {state} "quoted" \\n',
      variant: "outline",
      size: "lg",
      disabled: true,
      loading: true,
    });
    const result = ts.transpileModule(code, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
      fileName: "Example.tsx",
      reportDiagnostics: true,
    });
    expect(
      result.diagnostics?.filter(
        (d) => d.category === ts.DiagnosticCategory.Error,
      ),
    ).toEqual([]);
  },
);
