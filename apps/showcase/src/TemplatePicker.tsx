import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Plus,
  Bookmark,
  Trash2,
  Copy,
  LayoutGrid,
  FileText,
  Users,
  ShoppingBag,
  Package,
  Contact,
  Headphones,
  Kanban,
  FolderOpen,
  Settings,
  TrendingUp,
  ChartNoAxesCombined,
  Activity,
} from "lucide-react";
import { Button, Modal } from "@hub/ui-core";
import {
  blueprints,
  blueprintFor,
  defaultConfig,
  type Blueprint,
  type TemplateConfig,
} from "../../../templates/workspace/src/model";
import {
  savedTemplates,
  storeTemplate,
  removeTemplate,
  type SavedTemplate,
} from "./template-storage";
const icons = {
  FileText,
  Users,
  ShoppingBag,
  Package,
  Contact,
  Headphones,
  Kanban,
  FolderOpen,
  Settings,
  TrendingUp,
  ChartNoAxesCombined,
  Activity,
};
export function ScreenThumbnail({
  blueprint: b,
  config = defaultConfig(b.id),
}: {
  blueprint: Blueprint;
  config?: TemplateConfig;
}) {
  const Icon = icons[b.icon as keyof typeof icons] ?? LayoutGrid;
  return (
    <div
      className={`screen-thumb screen-${b.view} screen-nav-${config.navigation}`}
      style={
        {
          "--screen-accent": `var(--pick-${config.accent})`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="screen-browser">
        <i />
        <i />
        <i />
        <span>{b.tag}</span>
      </div>
      <div className="screen-frame">
        <div className="screen-sidebar">
          <strong>W</strong>
          {[1, 2, 3, 4, 5].map((i) => (
            <i key={i} />
          ))}
        </div>
        <div className="screen-main">
          <div className="screen-heading">
            <Icon size={9} />
            <strong>{config.title}</strong>
            <span />
          </div>
          {config.metrics && b.view !== "settings" && (
            <div className="screen-kpis">
              {[1, 2, 3].map((n) => (
                <div key={n}>
                  <i />
                  <b>{n === 1 ? "1,248" : n === 2 ? "86" : "24"}</b>
                </div>
              ))}
            </div>
          )}
          {b.view === "chart" && config.chart ? (
            <div className="screen-graph">
              <svg viewBox="0 0 280 65">
                <path
                  d="M0 60L35 45L70 52L105 24L140 37L175 17L210 29L245 6L280 12L280 65L0 65Z"
                  fill="currentColor"
                  opacity=".13"
                />
                <path
                  d="M0 60L35 45L70 52L105 24L140 37L175 17L210 29L245 6L280 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          ) : b.view === "board" ? (
            <div className="screen-board">
              {[1, 2, 3].map((n) => (
                <div key={n}>
                  <small />
                  <i />
                  <i />
                </div>
              ))}
            </div>
          ) : b.view === "settings" ? (
            <div className="screen-settings">
              {[1, 2, 3].map((n) => (
                <div key={n}>
                  <i />
                  <span />
                </div>
              ))}
              <b />
            </div>
          ) : b.view === "files" || config.display === "cards" ? (
            <div className="screen-file-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n}>
                  <Icon size={12} />
                  <i />
                </div>
              ))}
            </div>
          ) : (
            <div className="screen-table">
              {b.rows.slice(0, 4).map((row) => (
                <div key={row.id}>
                  <i />
                  <span>{row.cells[0]}</span>
                  <small />
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
export function TemplatePicker({ mine = false }: { mine?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [saved, setSaved] = useState(savedTemplates);
  useEffect(() => {
    setQuery("");
    setCategory("전체");
    setSaved(savedTemplates());
  }, [mine]);
  const [deleting, setDeleting] = useState<SavedTemplate | null>(null);
  const [notice, setNotice] = useState("");
  const list = mine
    ? saved.map((s) => ({
        blueprint: blueprintFor(s.config.blueprint),
        config: s.config,
        key: s.id,
        saved: s,
      }))
    : blueprints.map((b) => ({
        blueprint: b,
        config: defaultConfig(b.id),
        key: b.id,
        saved: undefined,
      }));
  const filtered = list.filter(
    ({ blueprint: b, config }) =>
      (category === "전체" || b.category === category) &&
      `${config.title} ${b.description} ${b.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="stack template-picker">
      <div className="picker-intro">
        <div>
          <div className="eyebrow">
            {mine ? "YOUR SAVED WORKSPACES" : "START WITH A COMPLETE SCREEN"}
          </div>
          <h1>{mine ? "내 템플릿" : "어떤 화면부터 시작할까요?"}</h1>
          <p>
            {mine
              ? "저장해 둔 화면을 불러와 이어서 수정하거나, 새 프로젝트로 가져가세요."
              : "이미 완성된 화면을 고르고, 준비된 구성을 눌러 내 서비스에 맞게 바꿔보세요."}
          </p>
        </div>
        <span className="picker-total">
          <LayoutGrid size={19} />
          <strong>{mine ? saved.length : blueprints.length}</strong>
          <span>{mine ? "저장한 템플릿" : "바로 쓸 수 있는 화면"}</span>
        </span>
      </div>
      {!mine && (
        <div className="picker-steps">
          <div>
            <span>1</span>
            <strong>화면 고르기</strong>
            <small>업무에 맞는 템플릿 선택</small>
          </div>
          <ArrowRight size={16} />
          <div>
            <span>2</span>
            <strong>눌러서 바꾸기</strong>
            <small>색상·메뉴·구성 원클릭 변경</small>
          </div>
          <ArrowRight size={16} />
          <div>
            <span>3</span>
            <strong>저장하고 가져가기</strong>
            <small>내 템플릿 또는 실행 가능한 ZIP</small>
          </div>
        </div>
      )}
      <div className="row spread">
        <div className="picker-filters">
          {["전체", "운영·관리", "업무·협업", "데이터·분석", "설정·도구"].map(
            (c) => (
              <button
                className={category === c ? "active" : ""}
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ),
          )}
        </div>
        <label className="search-box">
          <Search size={15} />
          <input
            aria-label="완성형 템플릿 검색"
            placeholder="회원, 주문, 칸반…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="picker-grid">
        {filtered.map(({ blueprint: b, config, key, saved: s }) => (
          <article className="picker-card" key={key}>
            <Link
              to={`/compose/${b.id}${s ? `?saved=${s.id}` : ""}`}
              aria-label={`${config.title} 템플릿 구성하기`}
              className="picker-preview"
            >
              <ScreenThumbnail blueprint={b} config={config} />
              <span>
                이 화면으로 시작하기
                <ArrowRight size={14} />
              </span>
            </Link>
            <div className="picker-card-info">
              <div className="row spread">
                <span className="picker-category">{b.category}</span>
                {s ? (
                  <button
                    aria-label={`${s.name} 삭제`}
                    className="muted"
                    onClick={() => setDeleting(s)}
                  >
                    <Trash2 size={14} />
                  </button>
                ) : (
                  <span className="picker-ready">
                    <i />
                    동작하는 Mock
                  </span>
                )}
              </div>
              <h2>{config.title}</h2>
              <p>{b.description}</p>
              <div className="row spread">
                <span className="text-xs muted">
                  {s ? "내가 저장한 구성" : "기본값 준비 완료"}
                </span>
                <Button asChild size="sm">
                  <Link to={`/compose/${b.id}${s ? `?saved=${s.id}` : ""}`}>
                    {s ? "이어서 수정" : "선택하고 꾸미기"}
                    <ArrowRight size={13} />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel picker-empty">
          <Bookmark size={30} />
          <h2>
            {mine
              ? "아직 저장한 템플릿이 없어요"
              : "조건에 맞는 템플릿이 없어요"}
          </h2>
          <p>
            {mine
              ? "마음에 드는 화면을 꾸민 뒤 ‘내 템플릿으로 저장’을 눌러주세요."
              : "검색어나 분류를 바꿔보세요."}
          </p>
          {mine ? (
            <Button asChild>
              <Link to="/">템플릿 고르러 가기</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setCategory("전체");
              }}
            >
              검색 초기화
            </Button>
          )}
        </div>
      )}
      {mine && (
        <small>
          내 템플릿은 현재 브라우저에 저장됩니다. 서버 동기화는 제공하지
          않습니다.
        </small>
      )}
      <div className="picker-help">
        <div>
          <strong>설치 없이 먼저 만져보세요.</strong>
          <p>선택한 화면에서 목록 등록·검색·수정까지 직접 확인할 수 있어요.</p>
        </div>
        <Link to="/setup">개발 환경·사용법 보기 ↗</Link>
      </div>
      <Modal
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="저장한 템플릿 삭제"
        description={`${deleting?.name ?? ""} 템플릿을 삭제할까요?`}
      >
        <Button
          variant="destructive"
          onClick={() => {
            try {
              removeTemplate(deleting!.id);
              setSaved(savedTemplates());
              setDeleting(null);
            } catch {
              setNotice("저장 공간을 변경할 수 없습니다.");
            }
          }}
        >
          삭제 확인
        </Button>
      </Modal>
      {notice && <p role="alert">{notice}</p>}
    </div>
  );
}
