import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Routes,
  Route,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Boxes,
  LayoutGrid,
  Component,
  SlidersHorizontal,
  PackagePlus,
  BookOpen,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowRight,
  Search,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Check,
  Code2,
  Layers,
  X,
  Palette,
  Bookmark,
  MousePointer2,
  RectangleHorizontal,
  TextCursorInput,
  Table2,
  PanelLeft,
  Bell,
  ChartNoAxesCombined,
  Terminal,
} from "lucide-react";
import {
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Checkbox,
  Tabs,
  Toast,
} from "@hub/ui-core";
import {
  templates,
  componentNames,
  type TemplateId,
  type ComponentName,
} from "@hub/patterns";
import ComponentDemo, { demoCode, type DemoProps } from "./ComponentDemo";
import { CodeBlock } from "./CodeBlock";
import { TemplatePicker } from "./TemplatePicker";
import { TemplateComposer } from "./TemplateComposer";
import { CompanyKit } from "./CompanyKit";
import { SetupGuide } from "./SetupGuide";
import { DesignGallery, DesignStudio } from "./DesignStudio";
import { GeneratorPage } from "./GeneratorPage";
import demoSource from "./ComponentDemo.tsx?raw";
import coreSource from "../../../packages/ui-core/src/index.tsx?raw";
import patternsSource from "../../../packages/ui-core/src/pattern-components.tsx?raw";
import compositesSource from "../../../packages/ui-core/src/composites.tsx?raw";
const templateSources = import.meta.glob("../../../templates/*/src/App.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const navigation = [
  {
    label: "START HERE",
    items: [
      ["/", "템플릿 고르기", LayoutGrid],
      ["/company-kit", "회사 표준 UI · AI 개발", Boxes],
      ["/my-templates", "내 템플릿", Bookmark],
      ["/setup", "개발 환경 · 설치", Terminal],
      ["/docs", "사용 가이드", BookOpen],
    ],
  },
  {
    label: "DESIGN STUDIO",
    items: [
      ["/design/buttons", "버튼 디자인", MousePointer2],
      ["/design/cards", "카드 디자인", RectangleHorizontal],
      ["/design/inputs", "입력 필드 디자인", TextCursorInput],
    ],
  },
  {
    label: "COMPONENTS",
    items: [
      ["/components", "전체 컴포넌트", Component],
      ["/components?group=actions", "버튼 · 액션", MousePointer2],
      ["/components?group=forms", "입력 · 폼", TextCursorInput],
      ["/components?group=data", "테이블 · 데이터", Table2],
      ["/components?group=navigation", "탐색 · 레이아웃", PanelLeft],
      ["/components?group=feedback", "알림 · 상태", Bell],
      ["/components?group=display", "카드 · 차트", ChartNoAxesCombined],
    ],
  },
  {
    label: "TOOLS",
    items: [
      ["/examples", "Cloudscape · 기술 샘플", LayoutGrid],
      ["/design", "개별 디자인 탐색", Palette],
      ["/design/saved", "저장한 개별 디자인", Bookmark],
      ["/playground", "플레이그라운드", SlidersHorizontal],
      ["/generator", "프로젝트 생성", PackagePlus],
    ],
  },
] as const;
const componentGroups: Record<
  string,
  { label: string; items: readonly ComponentName[] }
> = {
  actions: { label: "버튼 · 액션", items: ["Button", "Modal"] },
  forms: {
    label: "입력 · 폼",
    items: ["Input", "Select", "Checkbox", "Form", "FileUpload"],
  },
  data: {
    label: "테이블 · 데이터",
    items: ["Table", "Pagination", "Filter", "Search"],
  },
  navigation: {
    label: "탐색 · 레이아웃",
    items: ["Sidebar", "Navbar", "Tabs", "Breadcrumb"],
  },
  feedback: {
    label: "알림 · 상태",
    items: ["Toast", "Alert", "Badge", "Loading"],
  },
  display: { label: "카드 · 차트", items: ["Card", "Chart"] },
};
function Thumbnail({ id }: { id: TemplateId }) {
  return (
    <div className={`thumbnail thumb-${id}`} aria-hidden="true">
      <div className="mini-top">
        <span />
        <span />
        <span />
        <div>
          {" "}
          {id === "cloud-console"
            ? "CLOUD CONSOLE"
            : id === "admin-cms"
              ? "CONTENT WORKSPACE"
              : "ANALYTICS"}
        </div>
      </div>
      <div className="mini-body">
        <div className="mini-side">
          {[1, 2, 3, 4, 5].map((n) => (
            <i key={n} />
          ))}
        </div>
        <div className="mini-main">
          <div className="mini-heading" />
          <div className="mini-stats">
            {[1, 2, 3].map((n) => (
              <div key={n}>
                <i />
                <b />
              </div>
            ))}
          </div>
          {id === "analytics" ? (
            <svg viewBox="0 0 280 90">
              <path
                d="M0 80 L35 58 L70 68 L105 28 L140 48 L175 30 L210 38 L245 8 L280 15 L280 90 L0 90Z"
                fill="#e0e9ff"
              />
              <path
                d="M0 80 L35 58 L70 68 L105 28 L140 48 L175 30 L210 38 L245 8 L280 15"
                fill="none"
                stroke="#7776ed"
                strokeWidth="3"
              />
            </svg>
          ) : (
            <div className="mini-table">
              {[1, 2, 3, 4].map((n) => (
                <div key={n}>
                  <i />
                  <i />
                  <b />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function Preview({ id, dark }: { id: TemplateId; dark: boolean }) {
  const [size, setSize] = useState("PC");
  const widths: Record<string, string> = {
    PC: "100%",
    태블릿: "768px",
    모바일: "390px",
  };
  return (
    <div className="stack">
      <div className="row spread">
        <div className="row">
          {[
            [Monitor, "PC"],
            [Tablet, "태블릿"],
            [Smartphone, "모바일"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Monitor;
            return (
              <Button
                key={String(label)}
                size="sm"
                variant={size === label ? "default" : "outline"}
                aria-pressed={size === label}
                onClick={() => setSize(String(label))}
              >
                <I size={14} />
                {String(label)}
              </Button>
            );
          })}
        </div>
        <Button asChild variant="outline" size="sm">
          <a
            href={`/${id}.html?theme=${dark ? "dark" : "light"}`}
            target="_blank"
            rel="noreferrer"
          >
            전체 화면
            <ArrowUpRight size={14} />
          </a>
        </Button>
      </div>
      <div className="preview-shell">
        <iframe
          key={`${id}-${dark}`}
          title={`${id} 실시간 미리보기`}
          src={`/${id}.html?theme=${dark ? "dark" : "light"}`}
          style={{ width: widths[size], maxWidth: "100%" }}
        />
      </div>
      <small>
        iframe의 실제 뷰포트가 변경됩니다. 작은 화면에서는 가용 너비를
        사용합니다.
      </small>
    </div>
  );
}
function Gallery({ dark }: { dark: boolean }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<TemplateId | null>(null);
  const filtered = templates.filter(
    (t) =>
      (category === "전체" || t.category === category) &&
      `${t.name} ${t.description} ${t.tech.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const current = templates.find((t) => t.id === selected);
  return (
    <>
      <div className="eyebrow">
        <span /> YOUR NEXT PROJECT STARTS HERE
      </div>
      <div className="row spread items-end">
        <div>
          <h1 className="hero-title">
            아이디어에서 제품까지,
            <br />
            <span>더 빠르게 시작하세요.</span>
          </h1>
          <p className="subtitle">
            검증된 UI 패턴과 실제 동작하는 React 템플릿.
            <br />
            탐색하고, 커스터마이징하고, 바로 프로젝트로 가져가세요.
          </p>
        </div>
        <Button asChild className="mb-2">
          <Link to="/design">
            <Palette size={16} />
            디자인 둘러보기
            <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
      <div className="stats-strip">
        <div>
          <Layers size={18} />
          <strong>3</strong>
          <span>실행 가능한 템플릿</span>
        </div>
        <div>
          <Component size={18} />
          <strong>21</strong>
          <span>컴포넌트 예제</span>
        </div>
        <div>
          <Code2 size={18} />
          <strong>100%</strong>
          <span>TypeScript</span>
        </div>
        <Badge>v0.1 · Mock 데이터</Badge>
      </div>
      <section className="gallery-section">
        <div className="row spread mb-5">
          <div>
            <h2 className="section-title">
              템플릿 둘러보기 <span>{filtered.length}</span>
            </h2>
            <p className="muted text-sm mb-0">
              다음 프로젝트에 어울리는 시작점을 찾아보세요.
            </p>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label="템플릿 검색"
              placeholder="템플릿, 기술 스택 검색…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button aria-label="검색 지우기" onClick={() => setQ("")}>
                <X size={14} />
              </button>
            )}
          </label>
        </div>
        <div className="row mb-6">
          {["전체", "클라우드", "관리자", "대시보드"].map((c) => (
            <button
              key={c}
              className={`filter-chip ${category === c ? "active" : ""}`}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="template-grid">
          {filtered.map((t) => (
            <article className="template-card" key={t.id}>
              <button
                className="thumb-button"
                aria-label={`${t.name} 미리보기`}
                onClick={() => setSelected(t.id)}
              >
                <Thumbnail id={t.id} />
                <span className="thumb-overlay">
                  실시간 미리보기 <ArrowUpRight size={16} />
                </span>
              </button>
              <div className="card-body">
                <div className="row spread mb-3">
                  <span className="category-label" style={{ color: t.color }}>
                    {t.category}
                  </span>
                  <span className="muted text-xs">v{t.version}</span>
                </div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <div className="row gap-1.5 mb-5">
                  {t.tech.map((v) => (
                    <span className="tech-pill" key={v}>
                      {v}
                    </span>
                  ))}
                </div>
                <div className="row spread card-footer">
                  <button
                    className="text-sm font-medium"
                    onClick={() => setSelected(t.id)}
                  >
                    템플릿 살펴보기{" "}
                    <ArrowRight className="inline ml-1" size={14} />
                  </button>
                  <Link
                    to={`/generator?template=${t.id}`}
                    className="text-xs text-primary"
                  >
                    사용하기
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && (
          <div className="panel text-center">
            <p>검색 결과가 없습니다.</p>
            <Button
              variant="outline"
              onClick={() => {
                setQ("");
                setCategory("전체");
              }}
            >
              필터 초기화
            </Button>
          </div>
        )}
      </section>
      <div className="bottom-banner">
        <div className="banner-icon">
          <Component size={24} />
        </div>
        <div>
          <h3>작은 컴포넌트부터 시작해도 좋아요.</h3>
          <p>Props와 상태를 조정하고, 필요한 코드만 가져가세요.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/components">
            컴포넌트 탐색
            <ArrowRight size={14} />
          </Link>
        </Button>
      </div>
      <Modal
        open={!!current}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
        title={current?.name ?? ""}
        description={current?.description}
      >
        {current && (
          <div className="stack">
            <Button asChild>
              <Link
                to={`/templates/${current.id}`}
                onClick={() => setSelected(null)}
              >
                상세 및 반응형 미리보기
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a
                href={`/${current.id}.html?theme=${dark ? "dark" : "light"}`}
                target="_blank"
                rel="noreferrer"
              >
                전체 화면으로 실행
              </a>
            </Button>
            <CodeBlock
              code={
                templateSources[
                  `../../../templates/${current.id}/src/App.tsx`
                ] ?? ""
              }
            />
          </div>
        )}
      </Modal>
    </>
  );
}
function TemplateDetail({ dark }: { dark: boolean }) {
  const { id } = useParams();
  const t = templates.find((t) => t.id === id);
  if (!t)
    return (
      <p>
        템플릿을 찾을 수 없습니다. <Link to="/">갤러리로 이동</Link>
      </p>
    );
  return (
    <div className="stack">
      <Link className="text-sm text-primary" to="/">
        ← 템플릿 갤러리
      </Link>
      <div className="row spread">
        <div>
          <h1 className="page-title">{t.name}</h1>
          <p className="muted">{t.description}</p>
          <div className="row">
            {t.tech.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </div>
        <Button asChild>
          <Link to={`/generator?template=${t.id}`}>이 템플릿으로 생성</Link>
        </Button>
      </div>
      <Tabs
        items={[
          { label: "미리보기", content: <Preview id={t.id} dark={dark} /> },
          {
            label: "소스 코드",
            content: (
              <CodeBlock
                code={
                  templateSources[`../../../templates/${t.id}/src/App.tsx`] ??
                  ""
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}
const initialProps: Omit<DemoProps, "name"> = {
  label: "시작하기",
  variant: "default",
  size: "default",
  disabled: false,
  loading: false,
};
function ComponentLibrary({ playground = false }: { playground?: boolean }) {
  const [params] = useSearchParams();
  const group = componentGroups[params.get("group") ?? ""];
  const names = group?.items ?? componentNames;
  const [name, setName] = useState<ComponentName>(names[0]);
  useEffect(() => {
    setName(names[0]);
    setQ("");
  }, [params.toString()]);
  const [q, setQ] = useState("");
  const [props, setProps] = useState(initialProps);
  const config = { name, ...props };
  const customizable = [
    "Button",
    "Input",
    "Select",
    "Checkbox",
    "Modal",
    "Toast",
    "Alert",
    "Badge",
    "Card",
  ].includes(name);
  return (
    <div className="stack">
      <div className="eyebrow">BUILD WITH CONFIDENCE</div>
      <h1 className="page-title mb-0">
        {playground
          ? "플레이그라운드"
          : (group?.label ?? "컴포넌트 라이브러리")}
      </h1>
      <p className="muted">
        실제 상호작용을 확인하고, 코드를 프로젝트에 가져가세요.
      </p>
      <div className="library-layout">
        <aside className="panel p-4 stack">
          <Input
            aria-label="컴포넌트 검색"
            placeholder="컴포넌트 검색…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <nav aria-label="컴포넌트 목록" className="component-list">
            {names
              .filter((n) => n.toLowerCase().includes(q.toLowerCase()))
              .map((n) => (
                <button
                  key={n}
                  className={name === n ? "active" : ""}
                  aria-pressed={name === n}
                  onClick={() => setName(n)}
                >
                  {n}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
          </nav>
        </aside>
        <div className="stack min-w-0">
          <div className="row spread">
            <h2 className="section-title">{name}</h2>
            <Badge>인터랙티브</Badge>
          </div>
          <div className="panel p-0 overflow-hidden">
            <div className="preview-label">
              <span className="status-dot" /> LIVE PREVIEW{" "}
              <span className="ml-auto">{name}</span>
            </div>
            <ComponentDemo key={name} {...config} />
          </div>
          <div className="panel stack">
            <h3 className="text-sm mb-0">Props 편집</h3>
            <div className="grid">
              {customizable && (
                <label className="stack gap-2">
                  레이블
                  <Input
                    value={props.label}
                    onChange={(e) =>
                      setProps((p) => ({ ...p, label: e.target.value }))
                    }
                  />
                </label>
              )}
              {name === "Button" && (
                <>
                  <label className="stack gap-2">
                    Variant
                    <Select
                      options={["default", "outline", "ghost", "destructive"]}
                      value={props.variant}
                      onChange={(e) =>
                        setProps((p) => ({
                          ...p,
                          variant: e.target.value as DemoProps["variant"],
                        }))
                      }
                    />
                  </label>
                  <label className="stack gap-2">
                    Size
                    <Select
                      options={["sm", "default", "lg"]}
                      value={props.size}
                      onChange={(e) =>
                        setProps((p) => ({
                          ...p,
                          size: e.target.value as DemoProps["size"],
                        }))
                      }
                    />
                  </label>
                </>
              )}
            </div>
            <div className="row">
              {[
                "Button",
                "Input",
                "Select",
                "Checkbox",
                "Modal",
                "Toast",
                "Form",
                "FileUpload",
              ].includes(name) && (
                <Checkbox
                  label="Disabled"
                  checked={props.disabled}
                  onCheckedChange={(v) =>
                    setProps((p) => ({ ...p, disabled: v }))
                  }
                />
              )}
              {["Button", "Form"].includes(name) && (
                <Checkbox
                  label="Loading"
                  checked={props.loading}
                  onCheckedChange={(v) =>
                    setProps((p) => ({ ...p, loading: v }))
                  }
                />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setProps(initialProps)}
              >
                초기화
              </Button>
            </div>
            {!customizable && (
              <small>
                미리보기 안에서 데이터·상태를 직접 변경할 수 있습니다.
              </small>
            )}
          </div>
          <Tabs
            items={[
              {
                label: "사용 예제",
                content: <CodeBlock code={demoCode(config)} />,
              },
              { label: "구현 소스", content: <CodeBlock code={demoSource} /> },
              {
                label: "UI 원본",
                content: (
                  <CodeBlock
                    code={
                      coreSource +
                      "\n" +
                      compositesSource +
                      "\n" +
                      patternsSource
                    }
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
function Docs() {
  return (
    <div className="stack max-w-3xl">
      <div className="eyebrow">DEVELOPER GUIDE</div>
      <h1 className="page-title">시작 가이드</h1>
      <Button asChild variant="outline">
        <Link to="/setup">처음이라면: 개발 환경과 설치 방법 보기</Link>
      </Button>
      <section className="panel stack">
        <h2>템플릿을 고르고, 눌러서 바꾸고, 가져가세요</h2>
        <p>
          첫 화면에서 완성형 업무 템플릿 12종 중 하나를 고르세요. 빠른 구성
          6종이나 내가 저장한 구성을 눌러 적용하고, 메뉴 위치·표/카드·표시
          영역을 클릭으로 바꿀 수 있습니다. ‘내 템플릿으로 저장’하면 다시 불러올
          수 있고, ‘이 구성 가져가기’는 현재 구성이 적용된 실행 가능한 ZIP을
          만듭니다.
        </p>
        <CodeBlock code={"pnpm install\npnpm dev\npnpm build"} />
        <small>
          Node.js 22.12 이상, pnpm 11.25.0 권장. 서버 API 없이 로컬 Mock
          데이터를 사용합니다.
        </small>
        <Button asChild>
          <Link to="/">템플릿 고르러 가기</Link>
        </Button>
      </section>
      <section className="panel">
        <h2>독립된 디자인 시스템</h2>
        <p>
          Cloudscape는 별도 문서에서 실행됩니다. 나머지 템플릿과 UI는 공통
          디자인 토큰과 소스 소유 방식의 shadcn/ui 패턴을 사용합니다. 각
          템플릿의 소스는 상세 화면에서 확인하세요.
        </p>
      </section>
      <section className="panel">
        <h2>현재 데모의 범위</h2>
        <p>
          콘텐츠와 리소스는 메모리에 저장되며 새로고침하면 초기화됩니다. 파일
          업로드는 로컬 파일 선택만 지원합니다. Analytics 비교 증감률은 고정
          예시입니다.
        </p>
      </section>
    </div>
  );
}
export default function App() {
  const location = useLocation();
  const [dark, setDark] = useState(
    () => localStorage.getItem("hub-theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("hub-theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <aside className="app-sidebar">
        <Link to="/" className="brand">
          <span>
            <Boxes size={23} />
          </span>
          template<span className="brand-hub">hub</span>
          <Badge>β</Badge>
        </Link>
        <div className="workspace-badge">
          <span className="workspace-avatar">W</span>
          <div>
            <strong>개발 워크스페이스</strong>
            <small>Personal workspace</small>
          </div>
          <span className="ml-auto text-muted">⌘</span>
        </div>
        <nav aria-label="메인 탐색" className="grouped-navigation">
          <div className="navigation-group">
            <div className="nav-heading">START HERE</div>
            {navigation[0].items.map(([to, title, Icon]) => (
              <Link
                key={to}
                to={to}
                className={`nav-item ${location.pathname === to ? "active" : ""}`}
                aria-current={location.pathname === to ? "page" : undefined}
              >
                <Icon size={17} />
                {title}
              </Link>
            ))}
          </div>
          <details className="navigation-advanced">
            <summary>컴포넌트·세부 디자인 더 보기 ▾</summary>
            {navigation.slice(1).map((group) => (
              <div className="navigation-group" key={group.label}>
                <div className="nav-heading">{group.label}</div>
                {group.items.map(([to, title, Icon]) => (
                  <Link
                    key={to}
                    to={to}
                    className={`nav-item ${location.pathname + location.search === to ? "active" : ""}`}
                  >
                    <Icon size={16} />
                    {title}
                  </Link>
                ))}
              </div>
            ))}
          </details>
        </nav>
        <div className="sidebar-note">
          <span className="badge mb-3">OPEN SOURCE READY</span>
          <h3>좋은 시작, 더 나은 제품.</h3>
          <p>
            반복 작업은 줄이고,
            <br />
            중요한 문제에 집중하세요.
          </p>
          <Link to="/">
            템플릿부터 시작하기 <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="sidebar-foot">
          <span className="status-dot" />
          로컬 Mock 환경 <small>v0.1.0</small>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-header">
          <span className="text-sm muted">
            Workspace <span className="mx-3 text-border">/</span>
            <strong className="text-foreground font-medium">
              Template Hub
            </strong>
          </span>
          <div className="row">
            <span className="header-tag">React + TypeScript</span>
            <Button
              variant="ghost"
              size="sm"
              aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              onClick={() => setDark((v) => !v)}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </Button>
            <span className="user-avatar">DH</span>
          </div>
        </header>
        <main id="main-content" className="content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<TemplatePicker />} />
            <Route path="/my-templates" element={<TemplatePicker mine />} />
            <Route
              path="/compose/:id"
              element={<TemplateComposer dark={dark} />}
            />
            <Route path="/examples" element={<Gallery dark={dark} />} />
            <Route
              path="/templates/:id"
              element={<TemplateDetail dark={dark} />}
            />
            <Route path="/design" element={<DesignGallery />} />
            <Route path="/design/saved" element={<DesignGallery savedOnly />} />
            <Route path="/design/:kind" element={<DesignStudio />} />
            <Route path="/components" element={<ComponentLibrary />} />
            <Route
              path="/playground"
              element={<ComponentLibrary playground />}
            />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/company-kit" element={<CompanyKit />} />
            <Route path="/setup" element={<SetupGuide />} />
            <Route path="/docs" element={<Docs />} />
            <Route
              path="*"
              element={
                <div className="stack">
                  <h1>페이지를 찾을 수 없습니다.</h1>
                  <Link to="/">갤러리로 돌아가기</Link>
                </div>
              }
            />
          </Routes>
          <footer className="content-footer">
            <span>Template Hub · 반복은 줄이고, 가능성은 넓히고.</span>
            <Link to="/docs">
              문서 및 사용 가이드 <ArrowUpRight size={12} className="inline" />
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
}
