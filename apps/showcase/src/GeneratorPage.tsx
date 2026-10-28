import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, PackageCheck, FolderCode, Check } from "lucide-react";
import { Button, Input, Checkbox, Alert } from "@hub/ui-core";
import { templates, type TemplateId } from "@hub/patterns";
import { generateProject, validateProjectName } from "@hub/project-generator";
const raw = import.meta.glob(
  [
    "../../../packages/ui-core/src/*.{ts,tsx}",
    "../../../packages/design-tokens/src/*.css",
    "../../../packages/patterns/src/*.ts",
    "../../../templates/*/src/App.tsx",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
const sources = Object.fromEntries(
  Object.entries(raw).map(([path, value]) => [
    path.replace("../../../", ""),
    value,
  ]),
);
export function GeneratorPage() {
  const [params] = useSearchParams();
  const initial = templates.some((t) => t.id === params.get("template"))
    ? (params.get("template") as TemplateId)
    : "admin-cms";
  const [name, setName] = useState("my-awesome-app");
  const [template, setTemplate] = useState<TemplateId>(initial);
  const [darkMode, setDarkMode] = useState(true);
  const [includeTests, setIncludeTests] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function download(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!validateProjectName(name)) {
      setError(
        "영문 소문자로 시작하는 1~50자 소문자, 숫자, 하이픈을 입력하세요.",
      );
      return;
    }
    setBusy(true);
    try {
      const { bytes } = await generateProject(
        { name, template, darkMode, includeTests },
        sources,
      );
      const u = URL.createObjectURL(
        new Blob([new Uint8Array(bytes)], { type: "application/zip" }),
      );
      const a = document.createElement("a");
      a.href = u;
      a.download = `${name}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(u), 1000);
      setDone(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "프로젝트 생성에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stack">
      <div className="eyebrow">FROM TEMPLATE TO YOUR NEXT PRODUCT</div>
      <h1 className="page-title mb-0">새 프로젝트 만들기</h1>
      <p className="muted">
        선택한 템플릿의 실제 코드를 독립된 Vite 프로젝트로 가져가세요.
      </p>
      <div className="generator-layout">
        <form className="panel stack" onSubmit={download}>
          <h2 className="section-title">프로젝트 설정</h2>
          <label className="stack gap-2">
            프로젝트 이름
            <Input
              value={name}
              maxLength={50}
              onChange={(e) => {
                setName(e.target.value);
                setDone(false);
              }}
              aria-describedby="name-hint"
              required
            />
            <small id="name-hint">
              영문 소문자·숫자·하이픈, 소문자로 시작 (최대 50자)
            </small>
          </label>
          <fieldset className="stack border-0 p-0">
            <legend className="text-sm font-medium mb-3">시작 템플릿</legend>
            {templates.map((t) => (
              <label
                className={`template-choice ${template === t.id ? "selected" : ""}`}
                key={t.id}
              >
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={template === t.id}
                  onChange={() => {
                    setTemplate(t.id);
                    setDone(false);
                  }}
                />
                <span>
                  <strong>{t.name}</strong>
                  <small>{t.tech.join(" · ")}</small>
                </span>
                {template === t.id && (
                  <Check size={16} className="ml-auto text-primary" />
                )}
              </label>
            ))}
          </fieldset>
          <h3 className="text-sm mb-0">포함할 옵션</h3>
          <Checkbox
            label="라이트 / 다크 테마 전환"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
          <Checkbox
            label="Vitest 테스트 예제"
            checked={includeTests}
            onCheckedChange={setIncludeTests}
          />
          {error && <Alert>{error}</Alert>}
          <Button type="submit" loading={busy}>
            <Download size={16} />
            {busy ? "프로젝트 구성 중…" : "프로젝트 ZIP 다운로드"}
          </Button>
          {done && (
            <div role="status" className="text-sm text-primary row">
              <PackageCheck size={18} />
              ZIP 파일을 생성했습니다.
            </div>
          )}
        </form>
        <div className="stack">
          <section className="panel stack">
            <FolderCode size={30} className="text-primary" />
            <h2 className="section-title mb-0">바로 실행할 수 있는 소스</h2>
            <p className="text-sm muted leading-7">
              실제 템플릿 구현, 공통 컴포넌트, 디자인 토큰과 빌드 설정을
              포함합니다. 원본 모노레포에 의존하지 않습니다.
            </p>
            <pre className="rounded-lg bg-background p-4">{`${name || "my-app"}/\n  src/App.tsx\n  src/main.tsx\n  src/patterns/\n${template === "cloud-console" ? "" : "  src/ui-core/\n  src/styles.css\n"}  index.html\n  package.json\n  tsconfig.json\n  vite.config.ts\n  README.md${includeTests ? "\n  src/patterns.test.ts" : ""}`}</pre>
            <div className="text-xs muted leading-6">
              생성 후 압축을 풀고 실행하세요.
              <pre>
                pnpm install
                <br />
                pnpm dev
                <br />
                pnpm build
              </pre>
            </div>
          </section>
          <Alert>
            Mock 데이터만 사용합니다. 서버 API와 인증은 포함되어 있지 않으며,
            템플릿 데이터는 새로고침하면 초기화됩니다.
          </Alert>
        </div>
      </div>
    </div>
  );
}
