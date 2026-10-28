export const templateIds = ["cloud-console", "admin-cms", "analytics"] as const;
export type TemplateId = (typeof templateIds)[number];
export const templates: {
  id: TemplateId;
  name: string;
  category: string;
  description: string;
  tech: string[];
  color: string;
  version: string;
}[] = [
  {
    id: "cloud-console",
    name: "Cloud Console",
    category: "클라우드",
    description:
      "리소스를 한눈에 관리하는 클라우드 콘솔. 인스턴스 검색, 생성, 상태 변경을 경험하세요.",
    tech: ["Cloudscape", "React", "TypeScript"],
    color: "#db8728",
    version: "1.0.0",
  },
  {
    id: "admin-cms",
    name: "Admin / CMS",
    category: "관리자",
    description:
      "콘텐츠 운영에 필요한 모든 것. 검색부터 등록, 수정, 삭제까지 연결된 관리 화면입니다.",
    tech: ["shadcn/ui", "Radix UI", "Tailwind CSS"],
    color: "#6760dc",
    version: "1.0.0",
  },
  {
    id: "analytics",
    name: "Analytics",
    category: "대시보드",
    description:
      "숫자를 인사이트로 바꾸는 대시보드. 기간별 KPI와 유입 채널을 탐색하세요.",
    tech: ["SVG Chart", "React", "Design Tokens"],
    color: "#198b78",
    version: "1.0.0",
  },
];
export interface ContentItem {
  id: number;
  title: string;
  category: string;
  status: string;
  updated: string;
}
export const initialContent: ContentItem[] = [
  {
    id: 1,
    title: "서비스 이용 가이드",
    category: "가이드",
    status: "게시",
    updated: "2026-10-28",
  },
  {
    id: 2,
    title: "10월 업데이트 안내",
    category: "공지",
    status: "게시",
    updated: "2026-10-27",
  },
  {
    id: 3,
    title: "처음 시작하는 워크스페이스",
    category: "가이드",
    status: "초안",
    updated: "2026-10-26",
  },
  {
    id: 4,
    title: "팀 협업 모범 사례",
    category: "블로그",
    status: "검토",
    updated: "2026-10-25",
  },
  {
    id: 5,
    title: "새로운 대시보드 소개",
    category: "블로그",
    status: "게시",
    updated: "2026-10-24",
  },
  {
    id: 6,
    title: "시스템 점검 안내",
    category: "공지",
    status: "초안",
    updated: "2026-10-23",
  },
];
export const filterContent = (
  items: ContentItem[],
  query: string,
  status: string,
) =>
  items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) &&
      (status === "전체" || i.status === status),
  );
export const revenueSeries = {
  week: [210, 280, 230, 390, 340, 450, 520],
  month: [320, 390, 350, 510, 450, 680, 740],
  quarter: [430, 510, 460, 720, 680, 840, 1020],
};
export function chartPoints(values: number[], width = 640, height = 180) {
  const max = Math.max(...values, 1);
  return values
    .map(
      (v, i) =>
        `${20 + (i * (width - 40)) / Math.max(values.length - 1, 1)},${height - 20 - (v / max) * (height - 40)}`,
    )
    .join(" ");
}
export const componentNames = [
  "Button",
  "Input",
  "Select",
  "Checkbox",
  "Modal",
  "Table",
  "Pagination",
  "Filter",
  "Search",
  "Sidebar",
  "Navbar",
  "Tabs",
  "Breadcrumb",
  "Toast",
  "Alert",
  "Badge",
  "Loading",
  "Card",
  "Chart",
  "Form",
  "FileUpload",
] as const;
export type ComponentName = (typeof componentNames)[number];
