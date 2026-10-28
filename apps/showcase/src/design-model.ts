import type { CSSProperties } from "react";
export type DesignKind = "buttons" | "cards" | "inputs";
export type DesignConfig = {
  kind: DesignKind;
  label: string;
  variant:
    | "solid"
    | "outline"
    | "soft"
    | "ghost"
    | "gradient"
    | "elevated"
    | "underline";
  tone: "violet" | "blue" | "emerald" | "orange" | "rose" | "slate";
  size: "sm" | "md" | "lg";
  radius: "square" | "rounded" | "pill";
  shadow: "none" | "subtle" | "lifted";
  icon: "none" | "ArrowRight" | "Plus" | "Download" | "Check" | "Heart";
  placement: "left" | "right" | "only";
  state: "default" | "disabled" | "loading";
  fullWidth: boolean;
};
export const kindLabels: Record<DesignKind, string> = {
  buttons: "버튼",
  cards: "카드",
  inputs: "입력 필드",
};
export const tones = {
  violet: { label: "바이올렛", value: "#6254df" },
  blue: { label: "블루", value: "#2563eb" },
  emerald: { label: "에메랄드", value: "#047857" },
  orange: { label: "오렌지", value: "#c2410c" },
  rose: { label: "로즈", value: "#be123c" },
  slate: { label: "슬레이트", value: "#334155" },
};
export const defaults: DesignConfig = {
  kind: "buttons",
  label: "프로젝트 시작하기",
  variant: "solid",
  tone: "violet",
  size: "md",
  radius: "rounded",
  shadow: "none",
  icon: "ArrowRight",
  placement: "right",
  state: "default",
  fullWidth: false,
};
export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  config: DesignConfig;
}
function preset(
  id: string,
  name: string,
  description: string,
  patch: Partial<DesignConfig>,
): DesignPreset {
  return { id, name, description, config: { ...defaults, ...patch } };
}
export const designPresets: DesignPreset[] = [
  preset("essential", "Essential", "명확한 주요 액션을 위한 기본형", {}),
  preset("soft", "Soft Violet", "부드러운 배경과 둥근 모서리", {
    variant: "soft",
    radius: "pill",
    icon: "Plus",
    placement: "left",
  }),
  preset("outlined", "Precision Outline", "가벼운 테두리의 보조 액션", {
    variant: "outline",
    tone: "slate",
    radius: "square",
    icon: "ArrowRight",
  }),
  preset("gradient", "Aurora Gradient", "강조가 필요한 시작과 전환", {
    variant: "gradient",
    shadow: "lifted",
    radius: "pill",
    size: "lg",
  }),
  preset("download", "Download Blue", "아이콘과 레이블이 함께하는 액션", {
    tone: "blue",
    icon: "Download",
    placement: "left",
    label: "파일 다운로드",
    shadow: "subtle",
  }),
  preset("icon", "Icon Action", "작은 공간에서 사용하는 아이콘 버튼", {
    tone: "rose",
    variant: "soft",
    icon: "Heart",
    placement: "only",
    radius: "pill",
    label: "관심 항목 추가",
  }),
  preset("card-clean", "Clean Workspace", "간결한 테두리와 콘텐츠 계층", {
    kind: "cards",
    label: "새로운 워크스페이스",
    variant: "outline",
    icon: "Plus",
    shadow: "none",
  }),
  preset("card-soft", "Soft Surface", "가벼운 색감의 정보 카드", {
    kind: "cards",
    label: "팀과 함께 시작하세요",
    variant: "soft",
    tone: "emerald",
    radius: "rounded",
  }),
  preset("card-elevated", "Floating Card", "입체감이 있는 프로젝트 카드", {
    kind: "cards",
    label: "내 프로젝트",
    variant: "elevated",
    tone: "blue",
    shadow: "lifted",
    size: "lg",
  }),
  preset("input-clean", "Clean Input", "일관된 레이블과 포커스 상태", {
    kind: "inputs",
    label: "프로젝트 이름",
    variant: "outline",
    icon: "none",
  }),
  preset("input-soft", "Soft Input", "부드러운 배경의 검색 입력", {
    kind: "inputs",
    label: "찾고 싶은 콘텐츠",
    variant: "soft",
    tone: "blue",
    radius: "pill",
    icon: "none",
  }),
  preset("input-line", "Minimal Underline", "콘텐츠에 집중하는 최소한의 선", {
    kind: "inputs",
    label: "워크스페이스 이름",
    variant: "underline",
    tone: "slate",
    radius: "square",
    icon: "none",
  }),
];
export const variantsFor = (kind: DesignKind): DesignConfig["variant"][] =>
  kind === "buttons"
    ? ["solid", "outline", "soft", "ghost", "gradient"]
    : kind === "cards"
      ? ["outline", "soft", "elevated"]
      : ["outline", "soft", "underline"];
export function colorFor(c: DesignConfig) {
  return `var(--design-${c.tone}, ${tones[c.tone].value})`;
}
export function designStyle(c: DesignConfig): CSSProperties {
  const color = colorFor(c);
  const soft = `color-mix(in srgb, ${color} 10%, var(--panel, #fff))`;
  const radius = {
    square: 4,
    rounded: 12,
    pill: c.kind === "cards" ? 24 : 999,
  }[c.radius];
  const height = { sm: 34, md: 44, lg: 54 }[c.size];
  const shadow = {
    none: "none",
    subtle: "0 3px 8px rgb(15 23 42 / .10)",
    lifted: "0 10px 24px rgb(15 23 42 / .16)",
  }[c.shadow];
  const common: CSSProperties = {
    fontFamily: "inherit",
    fontSize: c.size === "sm" ? 12 : 14,
    borderRadius: radius,
    boxShadow: shadow,
    transition: "filter .16s, box-shadow .16s, transform .16s",
    opacity: c.state === "disabled" ? 0.45 : 1,
  };
  if (c.kind === "cards")
    return {
      ...common,
      width: c.fullWidth ? "100%" : 320,
      maxWidth: "100%",
      padding: c.size === "sm" ? 18 : c.size === "lg" ? 32 : 24,
      background: c.variant === "soft" ? soft : "var(--panel, #fff)",
      color: "var(--fg, #19212e)",
      border: `1px solid ${c.variant === "outline" ? color : "var(--line, #e3e7ee)"}`,
    };
  if (c.kind === "inputs")
    return {
      ...common,
      width: "100%",
      height,
      padding: "0 14px",
      background: c.variant === "soft" ? soft : "var(--panel, #fff)",
      color: "var(--fg, #19212e)",
      border:
        c.variant === "underline" ? "none" : `1px solid var(--line, #d3d9e3)`,
      borderBottom:
        c.variant === "underline" ? `2px solid ${color}` : undefined,
      outlineColor: color,
    };
  return {
    ...common,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height,
    width: c.fullWidth ? "100%" : c.placement === "only" ? height : undefined,
    padding:
      c.placement === "only"
        ? 0
        : `0 ${c.size === "sm" ? 12 : c.size === "lg" ? 24 : 18}px`,
    fontWeight: 600,
    cursor: c.state === "default" ? "pointer" : "not-allowed",
    border: `1px solid ${c.variant === "outline" ? color : "transparent"}`,
    background:
      c.variant === "gradient"
        ? `linear-gradient(120deg, ${color}, #9333ea)`
        : c.variant === "soft"
          ? soft
          : c.variant === "outline" || c.variant === "ghost"
            ? "transparent"
            : color,
    color: ["outline", "soft", "ghost"].includes(c.variant) ? color : "#fff",
  };
}
export const interactionCSS = `.hub-designed:focus-visible{outline:3px solid var(--design-focus,#9c97ed);outline-offset:4px}.hub-designed:hover:not(:disabled){filter:brightness(.94)}.hub-designed:active:not(:disabled){transform:translateY(1px)}.hub-designed:disabled{cursor:not-allowed}.hub-spin{animation:hub-spin 1s linear infinite}@keyframes hub-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.hub-designed{transition:none!important}.hub-spin{animation:none}}`;
export function designCode(c: DesignConfig) {
  const style = JSON.stringify(designStyle(c), null, 2);
  const label = JSON.stringify(c.label);
  const icon =
    c.icon === "none" && c.placement !== "only"
      ? null
      : c.icon === "none"
        ? "ArrowRight"
        : c.icon;
  const imports = [
    ...(icon && c.kind === "buttons" ? [icon] : []),
    ...(c.state === "loading" && c.kind === "buttons" ? ["Loader2"] : []),
  ];
  const iconJSX = icon ? `<${icon} size={16} aria-hidden="true" />` : "";
  let jsx = "";
  if (c.kind === "buttons")
    jsx = `<button type="button" className="hub-designed" style={${style}} disabled={${c.state !== "default"}} aria-busy={${c.state === "loading"}} aria-label={${label}} onClick={()=>alert(${label})}>${c.state === "loading" ? '<Loader2 size={16} className="hub-spin" aria-hidden="true" />' : c.placement === "left" || c.placement === "only" ? iconJSX : ""}${c.placement !== "only" ? `{${label}}` : ""}${c.state !== "loading" && c.placement === "right" ? iconJSX : ""}</button>`;
  else if (c.kind === "inputs")
    jsx = `<label style={{display:"grid",gap:8,width:${c.fullWidth ? '"100%"' : "320"},maxWidth:"100%",fontFamily:"inherit",fontSize:13}}><span>{${label}}</span><input className="hub-designed" style={${style}} placeholder="내용을 입력하세요" maxLength={80} disabled={${c.state === "disabled"}} value={value} onChange={e=>setValue(e.target.value)}/><small aria-live="polite">{value.length} / 80자</small></label>`;
  else
    jsx = `<article style={${style}}><span style={{fontSize:11,color:${JSON.stringify(colorFor(c))}}}>WORKSPACE</span><h3 style={{fontSize:20,margin:"14px 0 10px"}}>{${label}}</h3><p style={{fontSize:13,lineHeight:1.8,color:"var(--muted,#637083)"}}>아이디어를 모으고 함께 새로운 프로젝트를 시작하세요.</p><button className="hub-designed" type="button" disabled={${c.state === "disabled"}} onClick={()=>alert(${label})} style={{border:0,background:"transparent",padding:0,fontFamily:"inherit",fontSize:13,color:${JSON.stringify(colorFor(c))},cursor:"pointer"}}>프로젝트 열기 →</button></article>`;
  return `${c.kind === "inputs" ? 'import { useState } from "react";\n' : ""}${imports.length ? `import { ${imports.join(", ")} } from "lucide-react";\n` : ""}\n// React 소스입니다. Tailwind CSS 없이도 동작합니다.\n// --panel / --fg / --muted 변수는 대상 프로젝트의 토큰으로 연결하세요.\nexport default function SelectedDesign(){\n${c.kind === "inputs" ? ' const [value,setValue]=useState("");\n' : ""} return (<><style>{${JSON.stringify(interactionCSS)}}</style>${jsx}</>);\n}`;
}
export interface SavedDesign {
  id: string;
  name: string;
  config: DesignConfig;
}
const keys = [
  "kind",
  "label",
  "variant",
  "tone",
  "size",
  "radius",
  "shadow",
  "icon",
  "placement",
  "state",
  "fullWidth",
] as const;
export function readSavedDesigns(): SavedDesign[] {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem("hub-saved-designs") ?? "[]",
    );
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is SavedDesign => {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.id !== "string" ||
        typeof item.name !== "string" ||
        !item.config
      )
        return false;
      const c = item.config;
      return (
        keys.every((k) => k in c) &&
        ["buttons", "cards", "inputs"].includes(c.kind) &&
        c.tone in tones &&
        ["sm", "md", "lg"].includes(c.size) &&
        ["square", "rounded", "pill"].includes(c.radius) &&
        ["none", "subtle", "lifted"].includes(c.shadow) &&
        ["none", "ArrowRight", "Plus", "Download", "Check", "Heart"].includes(
          c.icon,
        ) &&
        ["left", "right", "only"].includes(c.placement) &&
        ["default", "disabled", "loading"].includes(c.state) &&
        variantsFor(c.kind).includes(c.variant) &&
        typeof c.label === "string" &&
        typeof c.fullWidth === "boolean"
      );
    });
  } catch {
    return [];
  }
}
