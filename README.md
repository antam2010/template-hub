# Template Hub

현재 기본 흐름은 **완성 화면 선택 → 준비된 구성 클릭 → 내 템플릿 저장/프로젝트 가져가기**입니다. 첫 화면은 업무별 템플릿 12종을 제공하며, 원본 Cloudscape/CMS/Analytics 3종은 `/examples`의 기술 샘플로 보존합니다.

React UI 컴포넌트와 화면 패턴을 탐색하고, 동작하는 템플릿을 독립 프로젝트로 내려받는 개발자 도구입니다. 한국어 UI, 라이트/다크 테마, 반응형 미리보기를 제공합니다. 백엔드나 데이터베이스는 필요하지 않습니다.

## 설치 및 실행

Node.js **22.12 이상**, pnpm **11.25.0**을 사용합니다. 검증 환경은 Node 24.22.1입니다.

```bash
git clone https://github.com/antam2010/template-hub.git
cd template-hub
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Vite가 출력하는 주소(기본 `http://localhost:5173`)를 여세요.

```bash
pnpm typecheck          # 전체 TypeScript 검사
pnpm build              # 네 개 HTML 진입점 프로덕션 빌드
pnpm test               # Vitest: 필터·차트·안전한 ZIP 생성 검증
pnpm exec playwright install chromium
pnpm test:e2e           # 프로덕션 빌드 후 데스크톱/모바일 Chromium 테스트
pnpm storybook          # http://localhost:6006
pnpm build-storybook    # storybook-static 생성
pnpm verify:generated   # pnpm test 후 실행: 6개 생성 ZIP 설치/타입/빌드/테스트
pnpm exec vite preview  # 빌드 결과 로컬 확인
```

Linux CI에서 브라우저 시스템 라이브러리가 없다면 `pnpm exec playwright install --with-deps chromium`을 실행하세요. `verify:generated`는 네트워크가 필요하며 `.generated/` 아래에 격리된 프로젝트를 구성합니다.

## 주요 화면

| 경로                       | 기능                                                        |
| -------------------------- | ----------------------------------------------------------- |
| `/`                        | 검색·카테고리 필터·썸네일·설명·기술 스택                    |
| `/templates/cloud-console` | Cloudscape 실제 화면, PC/태블릿/모바일 iframe, 소스 복사    |
| `/templates/admin-cms`     | 관리자 템플릿 상세·미리보기·소스                            |
| `/templates/analytics`     | Analytics 상세·미리보기·소스                                |
| `/components`              | 21개 컴포넌트 상호작용·Props·코드                           |
| `/playground`              | 레이블/크기/variant/disabled/loading 편집과 실시간 예제     |
| `/generator`               | 이름·템플릿·테마/테스트 옵션 → 독립 프로젝트 ZIP            |
| `/docs`                    | 사용 가이드와 Mock 범위                                     |
| `/cloud-console.html`      | Cloudscape 리소스 생성·검색·정렬·선택·상태 전환·페이지 이동 |
| `/admin-cms.html`          | 콘텐츠 등록·수정·확인 후 삭제·검색·필터·페이지·CSV          |
| `/analytics.html`          | 기간/채널 선택에 따른 KPI·차트·데이터 표·JSON 내보내기      |

## 구조

- `apps/showcase`: React Router 기반 탐색 앱, 갤러리, 소스 뷰어, Playground, 생성기 폼
- `packages/ui-core`: shadcn/ui 방식의 소스 관리형 Button(CVA/Radix Slot), Radix Dialog/Tabs/Checkbox 및 공통 UI 21종
- `packages/design-tokens`: CSS 변수, Tailwind CSS 4 theme, 공통 상태/색상/레이아웃
- `packages/patterns`: 템플릿 레지스트리, 컴포넌트 목록, Mock 데이터 및 순수 데이터 함수
- `packages/project-generator`: 이름 검증, 실제 소스 매핑, 독립 Vite 프로젝트와 ZIP 구성
- `templates/{cloud-console,admin-cms,analytics}`: 각 템플릿의 독립 App 및 HTML 진입점
- `tests`: Vitest와 Playwright 시나리오
- `docs`: 아키텍처, 구현 현황, 검증 결과

각 workspace의 소스는 TypeScript로 직접 export합니다. 루트 Vite가 네 개의 HTML을 빌드합니다. Cloudscape 전역 CSS는 `cloud-console.html` 문서에서만 로드하며, 메인 앱의 Tailwind preflight와 섞이지 않습니다. iframe의 query parameter로 테마를 전달합니다. 새 템플릿은 레지스트리·HTML 진입점·생성기 소스 맵·검증 fixture를 함께 추가합니다.

## 생성 프로젝트

ZIP에는 선택한 템플릿의 **동일한 App.tsx**, 필요한 UI 소스·토큰·Mock 데이터, `package.json`, TypeScript/Vite 설정, 한국어 README가 포함됩니다. Cloudscape 프로젝트에는 Tailwind/Radix가 포함되지 않습니다. 일반 템플릿에는 Cloudscape 의존성이 포함되지 않습니다.

압축을 풀고 생성된 디렉터리에서 실행하세요.

```bash
pnpm install
pnpm dev
pnpm build
pnpm test # 테스트 옵션을 선택한 경우
```

의존성은 정확한 버전으로 지정하며 생성 프로젝트의 첫 설치에서 만들어진 `pnpm-lock.yaml`을 커밋하세요. 루트 모노레포나 서버 API에 의존하지 않습니다.

## 접근성 및 상태

버튼의 hover/focus-visible/disabled/loading, 연결된 입력 레이블, Radix의 포커스 트랩·Escape 닫기·탭 키 이동, 키보드 탐색, 본문 건너뛰기 링크를 제공합니다. Analytics 차트에는 텍스트 대체와 데이터 표를 제공합니다. Storybook a11y 애드온을 구성했습니다. 전체 WCAG 적합성 감사는 아직 수행하지 않았습니다.

## 범위와 후속 작업

현재 구현은 메모리 Mock 기반입니다. 새로고침하면 CMS/Cloud 리소스 변경이 초기화됩니다. FileUpload는 로컬 파일 선택/용량 검증/파일명 표시를 제공하며 서버 전송을 하지 않습니다. Analytics 비교 증감률과 채널 비중은 고정 예시입니다. 생성기는 제공된 세 템플릿을 소스 ZIP으로 구성하며 사용자가 업로드한 임의 템플릿은 지원하지 않습니다.

후속 작업: 컴포넌트별 더 세밀한 Props 스키마, 독립 Story 추가, 접근성 자동 검사 및 수동 감사 확대, 템플릿 등록 UI, Cloudscape 번들 최적화. 서버 API·인증·영속성은 필요할 때 별도 단계로 설계합니다.

정확한 검증 결과와 알려진 제한은 [docs/IMPLEMENTATION.md](docs/IMPLEMENTATION.md)를 확인하세요.

## 백엔드 개발자용 상세 가이드

사이트의 `/setup`에서 실제 버전·OS별 설치·폴더 역할·API 프록시·환경변수·배포·문제 해결을 확인할 수 있습니다. 문서 버전은 [docs/SETUP.md](docs/SETUP.md)입니다. 디자인 메뉴에서는 버튼·카드·입력 필드 12개 프리셋을 고르고 세부 속성을 조정·저장할 수 있습니다.

## 완성형 템플릿과 간편 구성

콘텐츠, 회원·권한, 주문·결제, 상품·재고, 고객 CRM, 고객지원, 칸반, 파일, 서비스 설정, 매출, 방문·유입, 모니터링의 12개 업무 화면을 제공합니다. 공통 화면 엔진을 사용하며 업무별 기본 필드·상태·Mock 데이터와 데이터 표/카드/보드/파일/폼/차트 패턴이 준비되어 있습니다.

빠른 구성은 색상·메뉴·밀도·카드/표·블록 기본값을 한 번에 바꿉니다. 내 템플릿의 구성을 다른 업무 템플릿에 적용해도 대상 화면의 제목·업무 데이터는 유지합니다. 세부 입력은 접힌 설정 안에 두었습니다. 저장은 현재 브라우저 로컬이며 서버 동기화와 업무 데이터 저장은 제공하지 않습니다.

‘이 구성 가져가기’ ZIP은 현재 TemplateConfig, src/Workspace.tsx, src/model.ts, CSS와 필요한 UI 소스를 포함합니다. `template.config.json`은 구성 기록용이고 실행은 src/App.tsx의 config를 사용합니다. 기존 생성기는 원본 기술 샘플 3종을 위한 고급 도구로 남아 있습니다.

## 회사 표준 UI로 AI 개발하기

`/company-kit`에서 공통 컴포넌트 명세, 실제 회원 관리 조합, 독립 설치 프로젝트 ZIP을 확인합니다. `pnpm build:kit`은 ui-core와 screen-patterns를 JS·타입 선언·CSS가 포함된 0.1.0 패키지로 빌드하고, 이 패키지를 설치하는 독립 예제를 `public/distribution/company-members.zip`으로 생성합니다. 사내 npm 저장소로는 아직 게시하지 않았습니다.

```sh
pnpm check:ui
pnpm build
pnpm verify:consumer
```

AI는 배포 ZIP의 AGENTS.md와 registry/components.json을 먼저 읽고 `ListPage`·`FormDialog`를 조합합니다. 회원 검색·필터·페이지 이동·등록·수정은 Mock으로 작동합니다. 공통 UI를 새로 만들거나 스타일을 덮어쓰는 일반적인 우회는 TypeScript AST 검사에서 실패합니다. CI에서 정책 검사, 패키지 빌드, 독립 소비자 설치·빌드를 실행합니다. 정책은 보안 경계가 아니며 정책 파일 변경과 예외는 코드 리뷰가 필요합니다.

현재 강제 대상은 회원 관리 참조 예제입니다. 기존 12종 업무 템플릿 전체의 공통 패턴 전환, 회사 디자인 승인, API 연동, 사내 패키지 저장소·배포 권한·버전 업데이트 운영은 후속 작업입니다. CSS는 전역 reset을 포함하므로 Cloudscape와 같은 문서에 혼합하지 않습니다. 기존 서비스 이식은 별도 앱 루트 또는 iframe 검증 후 진행합니다.
