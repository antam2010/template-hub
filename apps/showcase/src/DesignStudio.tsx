import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Download,
  Check,
  Heart,
  Loader2,
  Palette,
  Bookmark,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Button, Checkbox, Input, Select, Toast } from "@hub/ui-core";
import { CodeBlock } from "./CodeBlock";
import {
  defaults,
  designPresets,
  designStyle,
  designCode,
  tones,
  kindLabels,
  variantsFor,
  interactionCSS,
  colorFor,
  readSavedDesigns,
  type DesignConfig,
  type DesignKind,
  type SavedDesign,
} from "./design-model";
const icons = { ArrowRight, Plus, Download, Check, Heart };
function Example({
  config: c,
  onAction = () => {},
  decorative = false,
}: {
  config: DesignConfig;
  onAction?: (message: string) => void;
  decorative?: boolean;
}) {
  const [value, setValue] = useState("");
  const Icon = icons[c.icon === "none" ? "ArrowRight" : c.icon];
  const visibleIcon = c.icon !== "none" || c.placement === "only";
  const style = designStyle(c);
  if (c.kind === "cards")
    return (
      <article style={style}>
        <span style={{ fontSize: 11, color: colorFor(c) }}>WORKSPACE</span>
        <h3 style={{ fontSize: 20, margin: "14px 0 10px" }}>{c.label}</h3>
        <p className="muted text-[13px] leading-7">
          아이디어를 모으고 함께 새로운 프로젝트를 시작하세요.
        </p>
        {decorative ? (
          <span className="text-xs" style={{ color: colorFor(c) }}>
            프로젝트 열기 →
          </span>
        ) : (
          <button
            className="hub-designed"
            style={{
              border: 0,
              background: "transparent",
              padding: 0,
              fontFamily: "inherit",
              fontSize: 13,
              color: colorFor(c),
              cursor: "pointer",
            }}
            disabled={c.state === "disabled"}
            onClick={() => onAction(`${c.label} 카드를 선택했습니다.`)}
          >
            프로젝트 열기 →
          </button>
        )}
      </article>
    );
  if (c.kind === "inputs")
    return (
      <label
        className="stack gap-2 text-[13px]"
        style={{ width: c.fullWidth ? "100%" : 320, maxWidth: "100%" }}
      >
        <span>{c.label}</span>
        {decorative ? (
          <span
            style={{
              ...style,
              display: "flex",
              alignItems: "center",
              fontWeight: 400,
            }}
            className="muted"
          >
            내용을 입력하세요
          </span>
        ) : (
          <>
            <input
              className="hub-designed"
              style={style}
              placeholder="내용을 입력하세요"
              maxLength={80}
              disabled={c.state === "disabled"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <small aria-live="polite">{value.length} / 80자</small>
          </>
        )}
      </label>
    );
  const children = (
    <>
      {c.state === "loading" ? (
        <Loader2 size={16} className="hub-spin" aria-hidden="true" />
      ) : (c.placement === "left" || c.placement === "only") && visibleIcon ? (
        <Icon size={16} aria-hidden="true" />
      ) : null}
      {c.placement !== "only" && c.label}
      {c.state !== "loading" && c.placement === "right" && visibleIcon && (
        <Icon size={16} aria-hidden="true" />
      )}
    </>
  );
  return decorative ? (
    <span style={style}>{children}</span>
  ) : (
    <button
      type="button"
      className="hub-designed"
      style={style}
      disabled={c.state !== "default"}
      aria-label={c.label}
      aria-busy={c.state === "loading"}
      onClick={() => onAction(`${c.label} 버튼을 클릭했습니다.`)}
    >
      {children}
    </button>
  );
}
export function DesignGallery({ savedOnly = false }: { savedOnly?: boolean }) {
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState(readSavedDesigns);
  const [error, setError] = useState("");
  const list = savedOnly
    ? saved.map((d) => ({
        id: d.id,
        name: d.name,
        description: "이 브라우저에 저장한 나의 디자인",
        config: d.config,
      }))
    : designPresets;
  const filtered = list.filter(
    (p) => filter === "all" || p.config.kind === filter,
  );
  return (
    <div className="stack design-scope">
      <div className="eyebrow">CURATED UI / YOUR DESIGN DECISIONS</div>
      <div className="row spread">
        <div>
          <h1 className="page-title">
            {savedOnly ? "저장한 디자인" : "디자인 둘러보기"}
          </h1>
          <p className="muted text-sm">
            {savedOnly
              ? "직접 조정한 디자인을 다시 열어 수정하거나 코드를 가져오세요."
              : "마음에 드는 디자인에서 시작해 세부 속성을 원하는 대로 조정하세요."}
          </p>
        </div>
        <span className="badge">{filtered.length} DESIGNS</span>
      </div>
      <div className="row">
        {[
          ["all", "전체"],
          ["buttons", "버튼"],
          ["cards", "카드"],
          ["inputs", "입력 필드"],
        ].map(([v, l]) => (
          <button
            className={`filter-chip ${filter === v ? "active" : ""}`}
            aria-pressed={filter === v}
            key={v}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="design-gallery">
        {filtered.map((p) => (
          <article className="design-recipe" key={p.id}>
            <div className="recipe-preview" aria-hidden="true">
              <Example
                config={{
                  ...p.config,
                  size: p.config.kind === "cards" ? "sm" : p.config.size,
                }}
                decorative
              />
            </div>
            <div className="stack gap-3 p-5">
              <div className="row spread">
                <span className="badge">{kindLabels[p.config.kind]}</span>
                {savedOnly && (
                  <button
                    aria-label={`${p.name} 삭제`}
                    className="text-muted"
                    onClick={() => {
                      try {
                        const next = saved.filter((s) => s.id !== p.id);
                        localStorage.setItem(
                          "hub-saved-designs",
                          JSON.stringify(next),
                        );
                        setSaved(next);
                      } catch {
                        setError(
                          "이 브라우저에서 저장 항목을 변경할 수 없습니다.",
                        );
                      }
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <h2 className="text-base mb-0">{p.name}</h2>
              <p className="text-xs muted mb-0">{p.description}</p>
              <Button asChild variant="outline" size="sm">
                <Link
                  to={`/design/${p.config.kind}?${savedOnly ? "saved" : "preset"}=${encodeURIComponent(p.id)}`}
                >
                  이 디자인 선택
                  <ArrowRight size={14} />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="panel stack items-center py-12">
          <Bookmark size={30} className="text-primary" />
          <h2 className="text-lg mb-0">아직 저장한 디자인이 없어요.</h2>
          <p className="muted text-sm">
            디자인 스튜디오에서 속성을 바꾼 뒤 ‘디자인 저장’을 눌러주세요.
          </p>
          <Button asChild>
            <Link to="/design">디자인 둘러보기</Link>
          </Button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      {savedOnly && (
        <small>저장 항목은 현재 브라우저의 로컬 저장소에 보관됩니다.</small>
      )}
    </div>
  );
}
export function DesignStudio() {
  const { kind: rawKind } = useParams();
  const kind: DesignKind =
    rawKind === "cards" || rawKind === "inputs" ? rawKind : "buttons";
  const [params] = useSearchParams();
  const preset = designPresets.find(
    (p) => p.id === params.get("preset") && p.config.kind === kind,
  );
  const saved = readSavedDesigns().find(
    (s) => s.id === params.get("saved") && s.config.kind === kind,
  );
  const base =
    saved?.config ??
    preset?.config ??
    designPresets.find((p) => p.config.kind === kind)!.config;
  const [config, setConfig] = useState<DesignConfig>(base);
  const [savedId, setSavedId] = useState(saved?.id);
  const [name, setName] = useState(
    saved?.name ?? preset?.name ?? `나의 ${kindLabels[kind]} 디자인`,
  );
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    setConfig(base);
    setSavedId(saved?.id);
    setName(saved?.name ?? preset?.name ?? `나의 ${kindLabels[kind]} 디자인`);
  }, [kind, params.toString()]);
  function update<K extends keyof DesignConfig>(
    key: K,
    value: DesignConfig[K],
  ) {
    setConfig((c) => ({ ...c, [key]: value }));
  }
  function save() {
    if (!name.trim()) {
      setSaveError("디자인 이름을 입력하세요.");
      return;
    }
    try {
      const item: SavedDesign = {
        id:
          savedId ??
          (typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `design-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`),
        name: name.trim(),
        config,
      };
      const previous = readSavedDesigns();
      localStorage.setItem(
        "hub-saved-designs",
        JSON.stringify([item, ...previous.filter((p) => p.id !== item.id)]),
      );
      setSavedId(item.id);
      setMessage(
        "디자인을 저장했습니다. ‘저장한 디자인’에서 다시 열 수 있습니다.",
      );
      setSaveError("");
    } catch {
      setSaveError(
        "이 브라우저에서 저장할 수 없습니다. 코드를 복사해 보관하세요.",
      );
    }
  }
  return (
    <div className="stack design-scope">
      <style>{interactionCSS}</style>
      <div className="eyebrow">DESIGN STUDIO / {kind.toUpperCase()}</div>
      <div className="row spread">
        <div>
          <h1 className="page-title">{kindLabels[kind]} 디자인 스튜디오</h1>
          <p className="muted text-sm mb-0">
            디자인을 고르고, 세부 속성을 바꾸고, 실제 코드를 가져가세요.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/design">
            <Palette size={14} />
            다른 디자인 보기
          </Link>
        </Button>
      </div>
      <div className="studio-preset-strip" aria-label="디자인 프리셋">
        {designPresets
          .filter((p) => p.config.kind === kind)
          .map((p) => (
            <button
              key={p.id}
              className={`preset-tile ${JSON.stringify(config) === JSON.stringify(p.config) ? "selected" : ""}`}
              onClick={() => {
                setConfig(p.config);
                setName(p.name);
              }}
            >
              <span
                className="preset-sample"
                style={{
                  background: colorFor(p.config),
                  borderRadius:
                    p.config.radius === "pill"
                      ? 999
                      : p.config.radius === "square"
                        ? 3
                        : 8,
                  opacity: p.config.variant === "soft" ? 0.5 : 1,
                }}
              />
              <span>{p.name}</span>
            </button>
          ))}
      </div>
      <div className="studio-layout">
        <div className="stack min-w-0">
          <section className="panel p-0 overflow-hidden">
            <div className="preview-label">
              <span className="status-dot" />
              LIVE PREVIEW
              <span className="ml-auto">
                {kindLabels[kind]} · {config.variant}
              </span>
            </div>
            <div className="studio-canvas" data-testid="design-preview">
              <Example key={kind} config={config} onAction={setMessage} />
            </div>
            <div className="studio-caption">
              <span>
                {tones[config.tone].label} / {config.size.toUpperCase()} /{" "}
                {config.radius}
              </span>
              <span>Hover · Focus · Keyboard</span>
            </div>
          </section>
          {kind === "buttons" && (
            <section className="panel stack">
              <h2 className="text-sm font-semibold mb-0">상태별 비교</h2>
              <div className="state-comparison">
                {(["default", "disabled", "loading"] as const).map((state) => (
                  <div key={state} className="stack items-start gap-3">
                    <small>
                      {state === "default"
                        ? "기본 / Hover / Focus"
                        : state === "disabled"
                          ? "비활성화"
                          : "로딩 중"}
                    </small>
                    <Example
                      config={{ ...config, state, fullWidth: false }}
                      onAction={setMessage}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="panel stack">
            <div className="row spread">
              <h2 className="text-sm font-semibold mb-0">선택한 디자인 저장</h2>
              <Bookmark size={16} className="text-muted" />
            </div>
            <div className="row flex-nowrap">
              <label className="grow min-w-0">
                <span className="sr-only">디자인 이름</span>
                <Input
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <Button size="sm" onClick={save}>
                디자인 저장
              </Button>
            </div>
            {saveError && (
              <p className="text-sm mb-0" role="alert">
                {saveError}
              </p>
            )}
            <small>
              현재 브라우저에 저장됩니다. 다른 프로젝트로 옮길 때는 아래 코드를
              복사하세요.
            </small>
          </section>
          <div>
            <div className="row spread mb-3">
              <h2 className="text-base mb-0">사용 코드</h2>
              <span className="badge">React · Tailwind 불필요</span>
            </div>
            <CodeBlock code={designCode(config)} />
          </div>
        </div>
        <aside className="panel studio-controls stack">
          <div className="row spread">
            <h2 className="text-sm font-semibold mb-0">
              <SlidersHorizontal size={14} className="inline mr-2" />
              세부 디자인
            </h2>
            <button
              aria-label="디자인 초기화"
              onClick={() => {
                setConfig(base);
                setName(
                  saved?.name ??
                    preset?.name ??
                    `나의 ${kindLabels[kind]} 디자인`,
                );
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <label className="stack gap-2">
            {kind === "cards"
              ? "카드 제목"
              : kind === "inputs"
                ? "필드 레이블"
                : "버튼 레이블"}
            <Input
              value={config.label}
              maxLength={80}
              onChange={(e) => update("label", e.target.value)}
            />
          </label>
          <label className="stack gap-2">
            스타일
            <Select
              aria-label="디자인 스타일"
              options={variantsFor(kind)}
              value={config.variant}
              onChange={(e) =>
                update("variant", e.target.value as DesignConfig["variant"])
              }
            />
          </label>
          <fieldset className="border-0 p-0">
            <legend className="text-xs mb-3 font-medium">
              색상 · {tones[config.tone].label}
            </legend>
            <div className="tone-swatches">
              {Object.entries(tones).map(([tone, t]) => (
                <button
                  type="button"
                  key={tone}
                  aria-label={`${t.label} 색상`}
                  aria-pressed={config.tone === tone}
                  style={{ background: `var(--design-${tone}, ${t.value})` }}
                  onClick={() => update("tone", tone as DesignConfig["tone"])}
                >
                  {config.tone === tone && <Check size={15} />}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="stack gap-2">
            크기
            <Select
              aria-label="디자인 크기"
              options={["sm", "md", "lg"]}
              value={config.size}
              onChange={(e) =>
                update("size", e.target.value as DesignConfig["size"])
              }
            />
          </label>
          <label className="stack gap-2">
            모서리
            <Select
              aria-label="모서리"
              options={["square", "rounded", "pill"]}
              value={config.radius}
              onChange={(e) =>
                update("radius", e.target.value as DesignConfig["radius"])
              }
            />
          </label>
          <label className="stack gap-2">
            그림자
            <Select
              aria-label="그림자"
              options={["none", "subtle", "lifted"]}
              value={config.shadow}
              onChange={(e) =>
                update("shadow", e.target.value as DesignConfig["shadow"])
              }
            />
          </label>
          {kind === "buttons" && (
            <>
              <label className="stack gap-2">
                아이콘
                <Select
                  aria-label="아이콘"
                  options={[
                    "none",
                    "ArrowRight",
                    "Plus",
                    "Download",
                    "Check",
                    "Heart",
                  ]}
                  value={config.icon}
                  onChange={(e) =>
                    update("icon", e.target.value as DesignConfig["icon"])
                  }
                />
              </label>
              <label className="stack gap-2">
                아이콘 위치
                <Select
                  aria-label="아이콘 위치"
                  options={["left", "right", "only"]}
                  value={config.placement}
                  onChange={(e) =>
                    update(
                      "placement",
                      e.target.value as DesignConfig["placement"],
                    )
                  }
                />
              </label>
            </>
          )}
          <label className="stack gap-2">
            상태
            <Select
              aria-label="디자인 상태"
              options={
                kind === "buttons"
                  ? ["default", "disabled", "loading"]
                  : ["default", "disabled"]
              }
              value={config.state}
              onChange={(e) =>
                update("state", e.target.value as DesignConfig["state"])
              }
            />
          </label>
          <Checkbox
            label="전체 너비 사용"
            checked={config.fullWidth}
            onCheckedChange={(v) => update("fullWidth", v)}
          />
          <div className="studio-hint">
            속성을 바꾸면 미리보기와 코드가 함께 변경됩니다. 버튼을 클릭하거나
            Tab 키로 포커스를 확인하세요.
          </div>
        </aside>
      </div>
      <Toast message={message} onClose={() => setMessage("")} />
    </div>
  );
}
