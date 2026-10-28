import { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Bookmark,
  Download,
  PanelLeft,
  PanelTop,
  LayoutGrid,
  Table2,
  Settings2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { Button, Input, Modal, Checkbox, Toast } from "@hub/ui-core";
import {
  blueprintFor,
  defaultConfig,
  stylePresets,
  applyComposition,
  type TemplateConfig,
} from "../../../templates/workspace/src/model";
import { savedTemplates, storeTemplate } from "./template-storage";
import {
  generateWorkspaceProject,
  validateProjectName,
} from "@hub/project-generator";
import { CodeBlock } from "./CodeBlock";
const raw = import.meta.glob(
  [
    "../../../packages/ui-core/src/*.{ts,tsx}",
    "../../../packages/design-tokens/src/*.css",
    "../../../packages/patterns/src/*.ts",
    "../../../templates/admin-cms/src/App.tsx",
    "../../../templates/workspace/src/*.{ts,tsx,css}",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;
const sources = Object.fromEntries(
  Object.entries(raw).map(([path, value]) => [
    path.replace("../../../", ""),
    value,
  ]),
);
export function TemplateComposer({ dark }: { dark: boolean }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const b = blueprintFor(id);
  const initialSaved = savedTemplates().find(
    (s) => s.id === params.get("saved") && s.config.blueprint === b.id,
  );
  const initial = initialSaved?.config ?? defaultConfig(b.id);
  const [config, setConfig] = useState(initial);
  const [savedId, setSavedId] = useState(initialSaved?.id);
  const [history, setHistory] = useState<TemplateConfig[]>([]);
  const [viewport, setViewport] = useState("PC");
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(640);
  const [loadedSrc, setLoadedSrc] = useState("");
  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) =>
      setPreviewWidth(entries[0].contentRect.width),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [download, setDownload] = useState(false);
  const [projectName, setProjectName] = useState("my-workspace");
  const [busy, setBusy] = useState(false);
  const [includeTests, setIncludeTests] = useState(true);
  const [selectedComposition, setSelectedComposition] = useState("");
  useEffect(() => {
    setConfig(initial);
    setSavedId(initialSaved?.id);
    setHistory([]);
    setSelectedComposition("");
  }, [id, params.toString()]);
  function apply(next: TemplateConfig) {
    setHistory((h) => [...h, config].slice(-25));
    setConfig(next);
  }
  function patch(p: Partial<TemplateConfig>) {
    apply({ ...config, ...p });
  }
  function undo() {
    if (!history.length) return;
    setConfig(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  }
  function save() {
    try {
      const saved = storeTemplate(config, savedId);
      setSavedId(saved.id);
      setMessage("내 템플릿에 저장했습니다. 다음에도 그대로 불러올 수 있어요.");
    } catch {
      setError(
        "브라우저 저장 공간에 저장할 수 없습니다. 프로젝트 ZIP으로 보관하세요.",
      );
    }
  }
  const url = `/workspace.html?template=${b.id}&theme=${dark ? "dark" : "light"}&config=${encodeURIComponent(JSON.stringify(config))}`;
  const previewLoaded = loadedSrc === url;
  const previewTarget = { PC: 1120, 태블릿: 768, 모바일: 390 }[
    viewport as "PC" | "태블릿" | "모바일"
  ];
  const previewScale = Math.min(1, previewWidth / previewTarget);
  async function exportProject(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!validateProjectName(projectName)) {
      setError(
        "프로젝트 이름은 소문자로 시작하는 1~50자 영문 소문자·숫자·하이픈을 사용하세요.",
      );
      return;
    }
    setBusy(true);
    try {
      const result = await generateWorkspaceProject(
        { name: projectName, config, darkMode: true, includeTests },
        sources,
      );
      const url = URL.createObjectURL(
        new Blob([new Uint8Array(result.bytes)], { type: "application/zip" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownload(false);
      setMessage("선택한 화면과 구성이 포함된 프로젝트를 만들었습니다.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "프로젝트 생성에 실패했습니다.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="template-composer template-picker">
      <Link className="composer-back" to="/">
        {" "}
        <ArrowLeft size={14} />
        다른 템플릿 고르기
      </Link>
      <div className="composer-heading">
        <div>
          <div className="eyebrow">2 / 3 · 준비된 구성을 눌러 바꿔보세요</div>
          <h1>{config.title}</h1>
          <p>화면은 이미 준비했어요. 마음에 드는 구성만 고르면 됩니다.</p>
        </div>
        <div className="row">
          <Button variant="outline" size="sm" onClick={save}>
            <Bookmark size={14} />내 템플릿으로 저장
          </Button>
          <Button size="sm" onClick={() => setDownload(true)}>
            <Download size={14} />이 구성 가져가기
          </Button>
        </div>
      </div>
      <div className="composer-layout">
        <div className="composer-preview-column">
          <div className="composer-preview-tools">
            <div className="row">
              {[
                ["PC", Monitor],
                ["태블릿", Tablet],
                ["모바일", Smartphone],
              ].map(([label, Icon]) => {
                const I = Icon as typeof Monitor;
                return (
                  <button
                    key={String(label)}
                    aria-label={`${String(label)} 미리보기`}
                    aria-pressed={viewport === label}
                    className={viewport === label ? "active" : ""}
                    onClick={() => setViewport(String(label))}
                  >
                    <I size={15} />
                    <span>{String(label)}</span>
                  </button>
                );
              })}
            </div>
            <div className="row">
              <button
                onClick={undo}
                disabled={!history.length}
                aria-label="구성 변경 되돌리기"
              >
                <Undo2 size={14} />
                <span>되돌리기</span>
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label="전체 화면 미리보기"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
          <div
            className="composer-preview-shell"
            ref={previewRef}
            aria-busy={!previewLoaded}
          >
            <div
              className="composer-scaled-frame"
              style={{
                width: previewTarget * previewScale,
                height: 940 * previewScale,
              }}
            >
              <iframe
                title={`${b.name} 구성 미리보기`}
                src={url}
                onLoad={() => setLoadedSrc(url)}
                style={{
                  width: previewTarget,
                  height: 940,
                  maxWidth: "none",
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
            {!previewLoaded && (
              <div className="composer-loading" role="status">
                화면을 준비하고 있어요…
              </div>
            )}
          </div>
          <p className="composer-preview-note">
            <span className="status-dot" />
            실제 동작하는 화면입니다. 항목을 등록·수정해 보세요. 구성 변경 시
            Mock 데이터가 초기화됩니다.
          </p>
          <details className="composer-code">
            <summary>선택한 구성 코드 확인</summary>
            <CodeBlock
              code={`// 독립 프로젝트 ZIP의 src/App.tsx에 포함되는 구성\nconst config = ${JSON.stringify(config, null, 2)};`}
            />
          </details>
        </div>
        <aside className="composer-controls">
          <div className="composer-control-heading">
            <span>빠른 구성</span>
            <span className="badge">한 번 클릭으로 적용</span>
          </div>
          <p className="composer-instruction">원하는 분위기를 골라보세요</p>
          <div className="composition-grid">
            {stylePresets.map((p) => (
              <button
                key={p.id}
                className={
                  Object.entries(p.patch).every(
                    ([k, v]) => config[k as keyof TemplateConfig] === v,
                  )
                    ? "selected"
                    : ""
                }
                aria-pressed={Object.entries(p.patch).every(
                  ([k, v]) => config[k as keyof TemplateConfig] === v,
                )}
                onClick={() => {
                  apply(applyComposition(config, p.patch));
                  setSelectedComposition("");
                }}
              >
                <div className={`composition-sample composition-${p.id}`}>
                  <i />
                  <div>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <strong>{p.name}</strong>
                <small>{p.description}</small>
                {Object.entries(p.patch).every(
                  ([k, v]) => config[k as keyof TemplateConfig] === v,
                ) && <Check size={13} className="composition-check" />}
              </button>
            ))}
          </div>
          <label className="composer-select-label">
            또는, 내가 저장한 구성 사용
            <select
              aria-label="내가 저장한 구성"
              value={selectedComposition}
              disabled={!savedTemplates().length}
              onChange={(e) => {
                const s = savedTemplates().find((s) => s.id === e.target.value);
                if (s) {
                  apply(applyComposition(config, s.config));
                  setSelectedComposition(s.id);
                }
              }}
            >
              <option value="">
                {savedTemplates().length
                  ? "저장한 구성 선택…"
                  : "저장한 구성이 아직 없어요"}
              </option>
              {savedTemplates().map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="composer-divider" />
          <h2>메뉴 위치</h2>
          <div className="composer-choice-row">
            {[
              ["sidebar", "왼쪽 메뉴", PanelLeft],
              ["topbar", "상단 메뉴", PanelTop],
              ["compact", "아이콘 메뉴", LayoutGrid],
            ].map(([value, label, Icon]) => {
              const I = Icon as typeof Monitor;
              return (
                <button
                  aria-pressed={config.navigation === value}
                  key={String(value)}
                  onClick={() =>
                    patch({ navigation: value as TemplateConfig["navigation"] })
                  }
                >
                  <I size={19} />
                  <span>{String(label)}</span>
                </button>
              );
            })}
          </div>
          {b.view === "table" && (
            <>
              <h2>목록 모양</h2>
              <div className="composer-choice-row">
                {[
                  ["table", "표로 보기", Table2],
                  ["cards", "카드로 보기", LayoutGrid],
                ].map(([value, label, Icon]) => {
                  const I = Icon as typeof Monitor;
                  return (
                    <button
                      aria-pressed={config.display === value}
                      key={String(value)}
                      onClick={() =>
                        patch({ display: value as TemplateConfig["display"] })
                      }
                    >
                      <I size={18} />
                      <span>{String(label)}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {b.view !== "settings" && (
            <>
              <h2>화면에 표시할 영역</h2>
              <div className="composer-blocks">
                {(
                  [
                    ["metrics", "요약 카드"],
                    ["filters", "검색·필터"],
                    ...(b.view === "chart" ? [["chart", "추이 차트"]] : []),
                    ["activity", "최근 활동"],
                  ] as [keyof TemplateConfig, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    aria-pressed={!!config[key]}
                    onClick={() => patch({ [key]: !config[key] })}
                  >
                    <span>{label}</span>
                    {config[key] ? <Check size={14} /> : <PlusIcon />}
                  </button>
                ))}
              </div>
            </>
          )}
          <details className="composer-details">
            <summary>
              이름·색상 조금 더 바꾸기
              <Settings2 size={14} />
            </summary>
            <label>
              화면 제목
              <Input
                maxLength={80}
                value={config.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </label>
            <label>
              서비스 이름
              <Input
                maxLength={40}
                value={config.brand}
                onChange={(e) => patch({ brand: e.target.value })}
              />
            </label>
            <div className="composer-color-row">
              {[
                ["violet", "바이올렛"],
                ["blue", "블루"],
                ["green", "그린"],
                ["orange", "오렌지"],
              ].map(([value, label]) => (
                <button
                  aria-label={`${label} 테마`}
                  aria-pressed={config.accent === value}
                  key={value}
                  style={{ background: `var(--pick-${value})` }}
                  onClick={() =>
                    patch({ accent: value as TemplateConfig["accent"] })
                  }
                >
                  {config.accent === value && <Check size={14} />}
                </button>
              ))}
            </div>
            <label>
              화면 간격
              <select
                value={config.density}
                onChange={(e) =>
                  patch({
                    density: e.target.value as TemplateConfig["density"],
                  })
                }
              >
                <option value="comfortable">여유롭게</option>
                <option value="compact">촘촘하게</option>
              </select>
            </label>
          </details>
          <button
            className="composer-reset"
            onClick={() => {
              apply(defaultConfig(b.id));
              setSelectedComposition("");
            }}
          >
            <RotateCcw size={13} />
            처음 기본값으로 되돌리기
          </button>
        </aside>
      </div>
      {error && !download && <p role="alert">{error}</p>}
      <Modal
        open={download}
        onOpenChange={setDownload}
        title="이 구성으로 프로젝트 만들기"
        description="현재 미리보기의 템플릿과 선택한 메뉴·색상·화면 구성을 그대로 포함합니다."
      >
        <form className="stack" onSubmit={exportProject}>
          <label className="stack gap-2">
            프로젝트 이름
            <Input
              required
              maxLength={50}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </label>
          <p className="text-xs muted leading-6">
            React·TypeScript·Vite와 필요한 UI 소스를 함께 제공합니다. 압축을
            풀고 pnpm install → pnpm dev로 실행하세요.
          </p>
          <Checkbox
            label="테스트 예제 포함"
            checked={includeTests}
            onCheckedChange={setIncludeTests}
          />
          {error && <p role="alert">{error}</p>}
          <Button type="submit" loading={busy}>
            <Download size={15} />
            프로젝트 ZIP 다운로드
          </Button>
        </form>
      </Modal>
      <Toast message={message} onClose={() => setMessage("")} />
    </div>
  );
}
function PlusIcon() {
  return <span className="composer-plus">+</span>;
}
