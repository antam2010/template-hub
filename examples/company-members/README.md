# 회사 표준 UI 회원 관리 예제

Node.js >=22.12.0 (검증 24.22.1), pnpm 11.25.0. React 19.3.1, TypeScript 5.9.3, Vite 7.3.7.

ZIP을 새 폴더에 풀고 실행합니다. Windows PowerShell 또는 WSL 모두 동일합니다.

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install
pnpm dev
pnpm check:ui
pnpm build
```

이 예제는 저장소 소스를 복사하거나 alias로 연결하지 않고 vendor의 실제 0.1.0 패키지를 설치합니다. 네트워크는 React 등 npm 의존성을 최초 설치할 때 필요합니다. CSS는 main.tsx에서 한 번 불러오며 Tailwind 설치는 필요하지 않습니다. CSS에는 전역 reset/tokens가 포함되므로 기존 서비스에서는 별도 앱 루트 또는 iframe으로 먼저 통합 검증하세요. Cloudscape와 같은 문서에서 혼합하지 마세요.

src/App.tsx는 업무 데이터와 조합, src/main.tsx는 설치된 스타일과 앱 진입점입니다. 목록 검색·상태 필터·페이지 이동·회원 등록/수정·중복 이메일 검증을 제공합니다. Mock 데이터는 새로고침하면 초기화됩니다. API 키·비밀번호는 브라우저 코드에 넣지 마세요.

AI에게 먼저 AGENTS.md와 registry/components.json을 읽도록 요청하고 화면 요구사항을 전달합니다. UI가 부족하면 공통 패키지를 확장하고 새 버전을 배포합니다. vendor tarball을 교체하고 package.json의 버전/파일 경로를 함께 갱신한 뒤 다시 설치·빌드합니다. 회사 npm registry는 아직 연결하지 않았습니다. 소비자별 UI 소스를 수정하지 마세요.

정책 검사는 일반적인 UI 우회를 막는 AST 검사이며 모든 JavaScript 우회를 증명하는 보안 경계가 아닙니다. 정책 파일과 패키지 변경은 별도 코드 리뷰로 보호하세요. 회사 승인·디자인 검토는 아직 수행되지 않은 참조 구현입니다.
