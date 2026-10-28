# 백엔드 개발자를 위한 Template Hub 환경 설정

## 1. 기술 스택과 버전

정확한 직접 의존성은 package.json, 전이 의존성은 pnpm-lock.yaml을 기준으로 합니다. 사이트의 ‘개발 환경 · 설치 가이드’ 표는 실제 package.json을 읽어 표시합니다.

| 도구                | 버전                                      | 역할                         |
| ------------------- | ----------------------------------------- | ---------------------------- |
| Node.js             | 최소 22.12.0, 권장 24 LTS (검증: 24.22.1) | 프론트엔드 개발/빌드 런타임  |
| pnpm                | 11.25.0                                   | 의존성 설치, workspace 관리  |
| React / React DOM   | 19.3.1                                    | UI 렌더링                    |
| TypeScript          | 5.9.3                                     | 정적 타입 검사               |
| Vite                | 7.3.7                                     | 개발 서버와 번들 빌드        |
| Tailwind CSS        | 4.3.3                                     | CSS 유틸리티, CSS 기반 theme |
| React Router DOM    | 7.18.5                                    | SPA 화면 경로                |
| Cloudscape          | 3.0.1406                                  | 독립 Cloud Console UI        |
| Storybook           | 10.6.5                                    | 컴포넌트 개발/미리보기       |
| Vitest / Playwright | 3.2.7 / 1.56.1                            | 단위/브라우저 테스트         |

shadcn/ui는 별도 런타임 라이브러리가 아니라 소스 소유 방식입니다. Radix·CVA 기반 UI 소스를 packages/ui-core에서 관리합니다. React와 React DOM은 같은 버전을 사용하세요.

## 2. 준비

1. https://nodejs.org/en/download 에서 Node 24 LTS 설치
2. https://git-scm.com/downloads 에서 Git 설치
3. 새 터미널에서 node --version, npm --version 확인
4. Windows PowerShell 또는 WSL/Linux 중 하나의 환경에서 설치와 실행을 이어갑니다. WSL은 ~/projects 같은 Linux 파일 경로 사용을 권장합니다. Windows Node 설치는 WSL 내부 Node 설치와 별개입니다.

```bash
npm install --global pnpm@11.25.0
pnpm --version
git clone https://github.com/antam2010/template-hub.git
cd template-hub
pnpm install --frozen-lockfile
pnpm dev
```

Windows에서 pnpm.ps1 실행 정책 오류가 나면 pnpm.cmd를 사용할 수 있습니다. WSL/Linux/macOS에서 이미 nvm을 사용 중이라면 저장소의 .nvmrc를 확인하고 nvm install, nvm use를 실행할 수 있습니다. nvm 자체는 이 프로젝트가 설치하지 않습니다.

Vite가 출력한 Local 주소로 접속하세요. 기본 포트는 5173이며 사용 중이면 달라질 수 있습니다. 종료는 Ctrl+C, 소스 저장 시 화면이 갱신됩니다.

## 3. 파일 역할

- package.json: pom.xml과 비슷하게 의존성과 실행 스크립트를 정의
- pnpm-lock.yaml: 전체 의존성 버전 고정; 저장소에 함께 커밋
- pnpm-workspace.yaml: 여러 앱/패키지/템플릿을 한 작업 공간으로 관리
- apps/showcase/src/App.tsx: 메뉴와 Router 경로
- templates/admin-cms/src/App.tsx: 관리 화면의 업무 상태와 이벤트
- packages/patterns/src/index.ts: 현재 Mock 데이터와 순수 함수
- packages/ui-core/src: 공통 UI; 업무 API와 분리
- packages/design-tokens/src/index.css: 공통 색상·간격·글꼴·다크 모드
- vite.config.ts: alias, 여러 HTML 진입점, 개발 프록시 설정 위치
- tsconfig.json: TypeScript 및 @hub/\* 타입/소스 경로

생성기로 받은 ZIP은 src/App.tsx, src/ui-core, src/patterns로 구성되는 독립 프로젝트입니다. 원본 모노레포를 별도로 설치하지 않습니다.

## 4. 백엔드 API 연결

현재 UI는 로컬 Mock이며 서버 API 요청/인증/DB 연결을 하지 않습니다. 서버 DTO와 API 계약을 정한 후 Mock 데이터와 이벤트를 교체하세요.

Vite 개발 프록시 설정 예시(기존 defineConfig 객체에 server 옵션으로 병합):

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
    },
  },
}
```

프론트 코드 예시:

```ts
const response = await fetch("/api/contents");
if (!response.ok) throw new Error("콘텐츠 조회 실패");
const data = await response.json();
```

실제 API 응답에 맞는 TypeScript 타입을 정의하고 loading/error/empty 상태를 처리하세요. 저장·수정·삭제도 POST/PUT/DELETE 계약에 연결합니다. 쿠키 인증은 credentials, SameSite, CSRF 정책을 백엔드와 함께 설계해야 합니다.

Vite proxy는 로컬 개발에만 사용됩니다. 배포에서는 Nginx/API gateway의 경로 프록시 또는 별도 도메인과 CORS 설정이 필요합니다.

## 5. 환경변수

루트의 .env.example은 API 연결 시 참고할 예시이며 현재 Mock 화면에서 읽지 않습니다. 필요할 때 .env.local로 복사하세요.

```dotenv
VITE_API_BASE_URL=/api
```

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
```

VITE\_ 접두사 값은 브라우저에 노출됩니다. DB 비밀번호·API 비밀키·서버 토큰을 넣지 마세요. .env.local은 Git에 커밋하지 않고, 수정 후 dev 서버를 재시작합니다. 브라우저용 환경변수는 빌드 시 번들에 반영되므로 배포 후 환경파일만 바꾸면 기존 번들이 갱신되는 것은 아닙니다.

## 6. 검사·빌드·배포

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm exec vite preview
pnpm storybook
pnpm build-storybook
```

pnpm build는 dist/에 HTML, JS, CSS, 웹폰트를 생성합니다. dist 전체를 함께 정적 호스팅합니다. SPA 경로는 index.html fallback이 필요하고 cloud-console.html/admin-cms.html/analytics.html은 함께 보존합니다. vite preview는 운영 서버가 아니라 빌드 확인용입니다.

Nginx 예시:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

/api 경로는 서비스의 백엔드 주소에 맞춰 별도 설정하세요. Spring Boot와 같은 서버에 정적 파일을 묶을 수도 있지만 클라이언트 라우트 fallback과 보안 필터 경계를 먼저 설계해야 합니다.

## 7. 문제 해결

- 명령을 찾지 못함: PATH 반영을 위해 새 터미널을 열고 Windows/WSL 환경 일치 확인
- lockfile 오류: 브랜치별 package.json과 pnpm-lock.yaml이 일치하는지 확인
- @hub import 오류: 필요한 공통 소스와 Vite/TypeScript alias를 함께 이식하거나 생성 ZIP 사용
- CORS/404: 브라우저 Network 탭에서 요청 주소/프록시/백엔드 실행 여부 확인
- 새로고침 후 데이터 초기화: Mock 상태이므로 정상. API 연결 필요
- Cloudscape 스타일 충돌: 글로벌 CSS를 Tailwind 앱과 같은 문서에 import하지 말고 별도 HTML/페이지로 유지

공식 참고: https://pnpm.io/installation / https://vite.dev/config/server-options / https://vite.dev/guide/env-and-mode
