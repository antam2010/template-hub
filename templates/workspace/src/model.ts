export type BlueprintId =
  | "content"
  | "members"
  | "orders"
  | "inventory"
  | "crm"
  | "support"
  | "tasks"
  | "files"
  | "settings"
  | "sales"
  | "traffic"
  | "monitor";
export type Row = { id: number; cells: string[]; status: string };
export type Blueprint = {
  id: BlueprintId;
  name: string;
  category: string;
  description: string;
  tag: string;
  view: "table" | "board" | "files" | "settings" | "chart";
  columns: string[];
  statuses: string[];
  rows: Row[];
  accent: TemplateConfig["accent"];
  icon: string;
};
export type TemplateConfig = {
  blueprint: BlueprintId;
  title: string;
  brand: string;
  accent: "violet" | "blue" | "green" | "orange";
  navigation: "sidebar" | "topbar" | "compact";
  density: "comfortable" | "compact";
  radius: "soft" | "sharp";
  display: "table" | "cards";
  metrics: boolean;
  filters: boolean;
  activity: boolean;
  chart: boolean;
};
function rows(cells: string[][], statuses: string[]): Row[] {
  return cells.map((cells, i) => ({
    id: i + 1,
    cells,
    status: statuses[i % statuses.length],
  }));
}
export const blueprints: Blueprint[] = [
  {
    id: "content",
    name: "콘텐츠 관리",
    category: "운영·관리",
    description: "목록부터 작성·수정·삭제까지 준비된 CMS",
    tag: "CMS",
    view: "table",
    icon: "FileText",
    accent: "violet",
    columns: ["제목", "유형", "담당자"],
    statuses: ["게시", "검토", "초안"],
    rows: rows(
      [
        ["10월 서비스 업데이트", "공지", "김민지"],
        ["처음 시작하는 서비스", "가이드", "이도윤"],
        ["팀 협업 활용 가이드", "블로그", "박수현"],
        ["시스템 점검 안내", "공지", "김민지"],
        ["프로젝트 관리 팁", "블로그", "정지원"],
        ["워크스페이스 설정", "가이드", "이도윤"],
      ],
      ["게시", "검토", "초안"],
    ),
  },
  {
    id: "members",
    name: "회원·권한 관리",
    category: "운영·관리",
    description: "회원 검색, 정보 수정과 상태 관리",
    tag: "MEMBERS",
    view: "table",
    icon: "Users",
    accent: "blue",
    columns: ["이름", "이메일", "역할"],
    statuses: ["활성", "초대중", "비활성"],
    rows: rows(
      [
        ["김민지", "minji@example.com", "관리자"],
        ["이도윤", "doyun@example.com", "편집자"],
        ["박수현", "suhyun@example.com", "멤버"],
        ["정지원", "jiwon@example.com", "멤버"],
        ["한서준", "seojun@example.com", "편집자"],
        ["윤서연", "seoyeon@example.com", "멤버"],
      ],
      ["활성", "활성", "초대중"],
    ),
  },
  {
    id: "orders",
    name: "주문·결제 관리",
    category: "운영·관리",
    description: "주문 내역, 결제 상태와 처리 현황",
    tag: "COMMERCE",
    view: "table",
    icon: "ShoppingBag",
    accent: "orange",
    columns: ["주문 번호", "고객명", "결제 금액"],
    statuses: ["결제완료", "배송중", "처리대기"],
    rows: rows(
      [
        ["ORD-1028", "김민지", "₩129,000"],
        ["ORD-1027", "이도윤", "₩59,000"],
        ["ORD-1026", "박수현", "₩249,000"],
        ["ORD-1025", "정지원", "₩89,000"],
        ["ORD-1024", "한서준", "₩159,000"],
        ["ORD-1023", "윤서연", "₩39,000"],
      ],
      ["결제완료", "배송중", "처리대기"],
    ),
  },
  {
    id: "inventory",
    name: "상품·재고 관리",
    category: "운영·관리",
    description: "상품 목록과 판매·재고 상태를 한눈에",
    tag: "PRODUCTS",
    view: "table",
    icon: "Package",
    accent: "green",
    columns: ["상품명", "카테고리", "재고"],
    statuses: ["판매중", "재입고예정", "품절"],
    rows: rows(
      [
        ["워크스페이스 플랜", "구독", "120"],
        ["프로젝트 노트", "문구", "48"],
        ["데스크 오거나이저", "리빙", "0"],
        ["팀 스타터 키트", "패키지", "32"],
        ["무선 키보드", "디지털", "18"],
        ["월간 멤버십", "구독", "100"],
      ],
      ["판매중", "판매중", "품절"],
    ),
  },
  {
    id: "crm",
    name: "고객 CRM",
    category: "업무·협업",
    description: "고객·기업 정보와 영업 단계를 정리",
    tag: "CRM",
    view: "table",
    icon: "Contact",
    accent: "blue",
    columns: ["고객명", "회사", "담당자"],
    statuses: ["신규", "상담중", "계약완료"],
    rows: rows(
      [
        ["김민지", "스튜디오 모아", "박수현"],
        ["이도윤", "팀 넥스트", "정지원"],
        ["한서준", "그린랩", "박수현"],
        ["윤서연", "컴퍼니 온", "김민지"],
        ["박지훈", "오브젝트", "정지원"],
        ["이하은", "플로우", "박수현"],
      ],
      ["신규", "상담중", "계약완료"],
    ),
  },
  {
    id: "support",
    name: "고객지원 데스크",
    category: "업무·협업",
    description: "문의 접수부터 해결까지 이어지는 티켓",
    tag: "SUPPORT",
    view: "table",
    icon: "Headphones",
    accent: "violet",
    columns: ["문의 제목", "요청자", "우선순위"],
    statuses: ["접수", "처리중", "해결"],
    rows: rows(
      [
        ["결제 영수증을 받고 싶어요", "김민지", "보통"],
        ["로그인 문제 확인 요청", "이도윤", "높음"],
        ["팀원 초대 방법 문의", "박수현", "보통"],
        ["플랜 변경 요청", "정지원", "보통"],
        ["데이터 내보내기 오류", "한서준", "높음"],
        ["기능 제안드립니다", "윤서연", "낮음"],
      ],
      ["접수", "처리중", "해결"],
    ),
  },
  {
    id: "tasks",
    name: "프로젝트 칸반",
    category: "업무·협업",
    description: "할 일·진행 중·완료를 카드로 관리",
    tag: "KANBAN",
    view: "board",
    icon: "Kanban",
    accent: "violet",
    columns: ["작업명", "담당자", "마감"],
    statuses: ["할 일", "진행 중", "완료"],
    rows: rows(
      [
        ["관리자 화면 설계", "김민지", "10월 30일"],
        ["API 명세 확인", "이도윤", "10월 29일"],
        ["회원 목록 구현", "박수현", "11월 01일"],
        ["디자인 토큰 정리", "정지원", "10월 31일"],
        ["테스트 시나리오 작성", "한서준", "11월 02일"],
        ["기획서 리뷰", "윤서연", "10월 28일"],
      ],
      ["할 일", "진행 중", "완료"],
    ),
  },
  {
    id: "files",
    name: "파일·문서 보관함",
    category: "설정·도구",
    description: "문서 검색과 파일 선택을 위한 보관함",
    tag: "FILES",
    view: "files",
    icon: "FolderOpen",
    accent: "blue",
    columns: ["파일명", "크기", "수정일"],
    statuses: ["공유중", "개인"],
    rows: rows(
      [
        ["프로젝트_기획서.pdf", "2.4 MB", "10월 28일"],
        ["브랜드_가이드.pdf", "1.8 MB", "10월 27일"],
        ["API_명세서.md", "48 KB", "10월 26일"],
        ["회의록_1025.docx", "124 KB", "10월 25일"],
        ["대시보드_디자인.fig", "4.2 MB", "10월 24일"],
        ["팀_일정.xlsx", "86 KB", "10월 23일"],
      ],
      ["공유중", "개인"],
    ),
  },
  {
    id: "settings",
    name: "서비스 설정",
    category: "설정·도구",
    description: "기본 정보와 알림 설정을 갖춘 설정 페이지",
    tag: "SETTINGS",
    view: "settings",
    icon: "Settings",
    accent: "green",
    columns: [],
    statuses: ["활성"],
    rows: [],
  },
  {
    id: "sales",
    name: "매출 대시보드",
    category: "데이터·분석",
    description: "기간별 KPI·매출 추이·최근 거래",
    tag: "ANALYTICS",
    view: "chart",
    icon: "TrendingUp",
    accent: "violet",
    columns: ["상품", "결제 금액", "채널"],
    statuses: ["완료", "완료", "대기"],
    rows: rows(
      [
        ["팀 플랜", "₩129,000", "직접"],
        ["프로 플랜", "₩59,000", "검색"],
        ["엔터프라이즈", "₩249,000", "소개"],
        ["프로 플랜", "₩59,000", "검색"],
      ],
      ["완료", "완료", "대기"],
    ),
  },
  {
    id: "traffic",
    name: "방문·유입 분석",
    category: "데이터·분석",
    description: "방문자 수, 인기 페이지와 채널 분석",
    tag: "TRAFFIC",
    view: "chart",
    icon: "ChartNoAxesCombined",
    accent: "blue",
    columns: ["페이지", "조회수", "평균 체류"],
    statuses: ["집계완료"],
    rows: rows(
      [
        ["/dashboard", "12,480", "3분 20초"],
        ["/products", "8,320", "2분 15초"],
        ["/pricing", "4,120", "1분 40초"],
        ["/docs", "3,450", "4분 05초"],
      ],
      ["집계완료"],
    ),
  },
  {
    id: "monitor",
    name: "서비스 모니터링",
    category: "설정·도구",
    description: "서버 상태·요청 추이·점검 상태 전환",
    tag: "MONITORING",
    view: "chart",
    icon: "Activity",
    accent: "green",
    columns: ["리소스", "리전", "응답 시간"],
    statuses: ["정상", "점검중", "중지"],
    rows: rows(
      [
        ["api-production", "서울", "24 ms"],
        ["web-production", "서울", "18 ms"],
        ["worker-queue", "서울", "42 ms"],
        ["staging-api", "서울", "65 ms"],
        ["monitoring", "서울", "21 ms"],
      ],
      ["정상", "정상", "점검중"],
    ),
  },
];
export function blueprintFor(id: string | null | undefined): Blueprint {
  return blueprints.find((b) => b.id === id) ?? blueprints[0];
}
export function defaultConfig(id: BlueprintId): TemplateConfig {
  const b = blueprintFor(id);
  return {
    blueprint: id,
    title: b.name,
    brand: "Workspace",
    accent: b.accent,
    navigation: "sidebar",
    density: "comfortable",
    radius: "soft",
    display: "table",
    metrics: b.view !== "settings",
    filters: true,
    activity: false,
    chart: true,
  };
}
export const stylePresets: {
  id: string;
  name: string;
  description: string;
  patch: Partial<TemplateConfig>;
}[] = [
  {
    id: "clean",
    name: "깔끔한 기본형",
    description: "익숙한 메뉴 + 여유로운 목록",
    patch: {
      accent: "violet",
      navigation: "sidebar",
      density: "comfortable",
      radius: "soft",
      display: "table",
      metrics: true,
      filters: true,
      activity: false,
      chart: true,
    },
  },
  {
    id: "compact",
    name: "실무형 목록",
    description: "좁은 간격 + 많은 정보",
    patch: {
      accent: "blue",
      navigation: "compact",
      density: "compact",
      radius: "sharp",
      display: "table",
      metrics: true,
      filters: true,
      activity: true,
      chart: true,
    },
  },
  {
    id: "soft",
    name: "부드러운 카드형",
    description: "둥근 카드 + 에메랄드",
    patch: {
      accent: "green",
      navigation: "sidebar",
      density: "comfortable",
      radius: "soft",
      display: "cards",
      metrics: true,
      filters: true,
      activity: false,
      chart: true,
    },
  },
  {
    id: "wide",
    name: "넓은 작업 공간",
    description: "상단 메뉴 + 간결한 화면",
    patch: {
      accent: "blue",
      navigation: "topbar",
      density: "comfortable",
      radius: "soft",
      display: "table",
      metrics: false,
      filters: true,
      activity: false,
      chart: true,
    },
  },
  {
    id: "warm",
    name: "따뜻한 포인트",
    description: "오렌지 + 카드 + 활동 기록",
    patch: {
      accent: "orange",
      navigation: "sidebar",
      density: "comfortable",
      radius: "soft",
      display: "cards",
      metrics: true,
      filters: true,
      activity: true,
      chart: true,
    },
  },
  {
    id: "minimal",
    name: "미니멀",
    description: "불필요한 영역 없이 핵심만",
    patch: {
      accent: "violet",
      navigation: "topbar",
      density: "compact",
      radius: "sharp",
      display: "table",
      metrics: false,
      filters: false,
      activity: false,
      chart: false,
    },
  },
];
export function isTemplateConfig(value: unknown): value is TemplateConfig {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    blueprints.some((b) => b.id === c.blueprint) &&
    typeof c.title === "string" &&
    c.title.length <= 80 &&
    typeof c.brand === "string" &&
    c.brand.length <= 40 &&
    ["violet", "blue", "green", "orange"].includes(c.accent as string) &&
    ["sidebar", "topbar", "compact"].includes(c.navigation as string) &&
    ["comfortable", "compact"].includes(c.density as string) &&
    ["soft", "sharp"].includes(c.radius as string) &&
    ["table", "cards"].includes(c.display as string) &&
    ["metrics", "filters", "activity", "chart"].every(
      (k) => typeof c[k] === "boolean",
    )
  );
}
export function applyComposition(
  config: TemplateConfig,
  composition: TemplateConfig | Partial<TemplateConfig>,
): TemplateConfig {
  const { blueprint: _, title: __, brand: ___, ...style } = composition;
  return { ...config, ...style };
}
