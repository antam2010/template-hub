import { Link } from "react-router-dom";
import {
  Download,
  Terminal,
  Server,
  Boxes,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button, Tabs } from "@hub/ui-core";
import { CodeBlock } from "./CodeBlock";
import pkg from "../../../package.json";
import guide from "../../../docs/SETUP.md?raw";
const versions = [
  [
    "Node.js",
    pkg.engines.node,
    "Java의 JDK에 해당하는 빌드·개발 서버 런타임. 검증 환경 24.22.1 / 권장 24 LTS",
  ],
  [
    "pnpm",
    pkg.packageManager.split("@")[1],
    "Maven/Gradle처럼 의존성을 설치하고 명령을 실행하는 패키지 관리자",
  ],
  ["React", pkg.dependencies.react, "화면을 컴포넌트로 구성하는 UI 라이브러리"],
  [
    "React DOM",
    pkg.dependencies["react-dom"],
    "React 화면을 브라우저 DOM에 연결. React와 같은 버전 사용",
  ],
  [
    "TypeScript",
    pkg.devDependencies.typescript,
    "Java처럼 타입을 검사하는 JavaScript 확장 언어",
  ],
  [
    "Vite",
    pkg.devDependencies.vite,
    "로컬 개발 서버와 배포용 파일을 만드는 빌드 도구",
  ],
  [
    "Tailwind CSS",
    pkg.devDependencies.tailwindcss,
    "CSS 유틸리티와 공통 디자인 토큰. v4의 CSS 기반 설정 사용",
  ],
  [
    "React Router",
    pkg.dependencies["react-router-dom"],
    "/components, /design 같은 브라우저 화면 경로 관리",
  ],
  [
    "Cloudscape",
    pkg.dependencies["@cloudscape-design/components"],
    "Cloud Console 전용 디자인 시스템. 별도 HTML/iframe에서 실행",
  ],
  [
    "Storybook",
    pkg.devDependencies.storybook,
    "UI 컴포넌트를 독립 실행하고 상태별로 확인하는 개발 도구",
  ],
  [
    "Vitest / Playwright",
    `${pkg.devDependencies.vitest} / ${pkg.devDependencies["@playwright/test"]}`,
    "함수·소스 생성 테스트 / 실제 브라우저 동작 테스트",
  ],
];
const install = `git clone https://github.com/antam2010/template-hub.git\ncd template-hub\nnode --version\nnpm install --global ${pkg.packageManager}\npnpm --version\npnpm install --frozen-lockfile\npnpm dev`;
const apiExample = `// vite.config.ts: 기존 defineConfig 객체에 server 옵션을 추가하는 예시\nserver: {\n  proxy: {\n    '/api': {\n      target: 'http://127.0.0.1:8080', // 백엔드의 실제 주소로 변경\n      changeOrigin: true,\n    },\n  },\n}\n\n// React 코드: 응답 구조를 실제 API 계약에 맞게 정의하세요.\nconst response = await fetch('/api/contents');\nif (!response.ok) throw new Error('콘텐츠 조회 실패');\nconst data = await response.json();`;
function download() {
  const u = URL.createObjectURL(
    new Blob([guide], { type: "text/markdown;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = u;
  a.download = "template-hub-setup.md";
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
export function SetupGuide() {
  return (
    <div className="stack setup-guide">
      <div className="eyebrow">BACKEND DEVELOPER'S FRONTEND HANDBOOK</div>
      <div className="row spread">
        <div>
          <h1 className="page-title">개발 환경 · 설치 가이드</h1>
          <p className="muted text-sm leading-7 mb-0">
            프론트엔드가 처음이어도, 버전 확인부터 실행·수정·API 연결·배포까지.
          </p>
        </div>
        <Button variant="outline" onClick={download}>
          <Download size={15} />
          가이드 다운로드
        </Button>
      </div>
      <div className="setup-overview">
        <div>
          <Terminal size={22} />
          <strong>Node 24 LTS</strong>
          <small>최소 {pkg.engines.node}</small>
        </div>
        <div>
          <Boxes size={22} />
          <strong>React {pkg.dependencies.react}</strong>
          <small>TypeScript {pkg.devDependencies.typescript}</small>
        </div>
        <div>
          <Server size={22} />
          <strong>백엔드 설치 불필요</strong>
          <small>현재 예제는 로컬 Mock 데이터 사용</small>
        </div>
      </div>
      <nav className="row setup-anchors" aria-label="가이드 목차">
        {[
          ["versions", "환경 버전"],
          ["install", "설치·실행"],
          ["structure", "폴더 구조"],
          ["api", "API 연결"],
          ["deploy", "빌드·배포"],
          ["troubleshoot", "문제 해결"],
        ].map(([id, text]) => (
          <a href={`#${id}`} className="filter-chip" key={id}>
            {text}
          </a>
        ))}
      </nav>
      <section id="versions" className="panel stack">
        <div className="row spread">
          <h2 className="section-title mb-0">01. 정확히 어떤 버전을 쓰나요?</h2>
          <span className="badge">package.json 자동 반영</span>
        </div>
        <p className="text-sm muted leading-7">
          표의 라이브러리 버전은 이 사이트의 실제 package.json에서 읽습니다.
          루트 pnpm-lock.yaml을 함께 사용하면 팀원도 동일한 의존성을 설치합니다.
          shadcn/ui는 별도 런타임 버전이 아니라 저장소에서 직접 관리하는 UI
          소스입니다.
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>기술</th>
                <th>현재 버전</th>
                <th>역할과 참고</th>
              </tr>
            </thead>
            <tbody>
              {versions.map(([name, version, description]) => (
                <tr key={name}>
                  <td className="whitespace-nowrap font-medium">{name}</td>
                  <td>
                    <code className="text-primary whitespace-nowrap">
                      {version}
                    </code>
                  </td>
                  <td className="text-xs muted leading-6">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section id="install" className="panel stack">
        <h2 className="section-title">02. 처음 설치하고 실행하기</h2>
        <div className="setup-step">
          <span>1</span>
          <div>
            <h3>Node.js와 Git 설치</h3>
            <p>
              Node.js 공식 다운로드에서 24 LTS를 설치하고 터미널을 새로 여세요.
              Git이 없다면 Git도 설치합니다. Windows와 WSL의 Node 설치는 서로
              별개입니다. 하나의 환경에서 설치·실행을 이어가세요.
            </p>
            <div className="row">
              <a
                href="https://nodejs.org/en/download"
                target="_blank"
                rel="noreferrer"
              >
                Node.js 공식 설치
                <ExternalLink size={12} />
              </a>
              <a
                href="https://git-scm.com/downloads"
                target="_blank"
                rel="noreferrer"
              >
                Git 공식 설치
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="setup-step">
          <span>2</span>
          <div className="min-w-0 w-full">
            <h3>프로젝트와 의존성 설치</h3>
            <Tabs
              items={[
                {
                  label: "Windows / PowerShell",
                  content: (
                    <>
                      <p className="text-xs muted">
                        PowerShell 또는 VS Code 터미널에서 실행합니다. 실행
                        정책으로 pnpm.ps1이 막히면 pnpm 대신 pnpm.cmd를
                        사용하세요.
                      </p>
                      <CodeBlock code={install} />
                    </>
                  ),
                },
                {
                  label: "WSL / Linux / macOS",
                  content: (
                    <>
                      <p className="text-xs muted">
                        해당 환경에 Node·Git을 설치한 후 실행합니다. WSL은
                        ~/projects 같은 Linux 파일 경로 사용을 권장합니다.
                      </p>
                      <CodeBlock code={install} />
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
        <div className="setup-step">
          <span>3</span>
          <div>
            <h3>브라우저로 열고 수정하기</h3>
            <p>
              터미널에 출력된 Local 주소로 접속합니다. 기본 주소는
              http://localhost:5173이며 이미 사용 중이면 다른 포트가 선택될 수
              있습니다. 파일을 저장하면 Vite가 화면에 반영합니다. 종료는
              터미널에서 Ctrl+C입니다.
            </p>
          </div>
        </div>
        <div className="setup-callout">
          <Check size={18} />
          <span>
            이 미리보기 사이트는 설치 없이 사용할 수 있습니다. 위 과정은 직접
            코드를 수정하거나 다른 프로젝트에 적용할 때만 필요합니다.
          </span>
        </div>
      </section>
      <section id="structure" className="panel stack">
        <h2 className="section-title">
          03. 백엔드 개발자는 어떤 파일부터 보면 되나요?
        </h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>경로</th>
                <th>역할 / 수정 시점</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "package.json",
                  "pom.xml과 비슷하게 의존성과 실행 명령을 정의",
                ],
                [
                  "pnpm-workspace.yaml",
                  "apps·packages·templates를 하나의 작업 공간으로 묶음",
                ],
                [
                  "apps/showcase/src/App.tsx",
                  "좌측 메뉴, 화면 경로와 전체 탐색 구조",
                ],
                [
                  "templates/admin-cms/src/App.tsx",
                  "관리자 화면의 상태·목록·폼 처리. API 연결 시 먼저 확인",
                ],
                [
                  "packages/patterns/src/index.ts",
                  "현재 Mock 데이터와 필터 함수. 실제 응답으로 대체할 출발점",
                ],
                [
                  "packages/ui-core/src/",
                  "재사용 Button·Modal·Table 등 UI. 업무 API 로직과 분리",
                ],
                [
                  "packages/design-tokens/src/index.css",
                  "색상·여백·글꼴·다크 모드의 공통 CSS 토큰",
                ],
                [
                  "vite.config.ts",
                  "개발 서버 프록시, 경로 별칭, 여러 HTML 진입점",
                ],
                ["tsconfig.json", "TypeScript 검사와 @hub/* import 경로 설정"],
              ].map(([p, text]) => (
                <tr key={p}>
                  <td>
                    <code className="text-xs">{p}</code>
                  </td>
                  <td className="text-xs muted leading-6">{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs muted leading-7">
          생성기로 받은 ZIP은 모노레포가 아닌 독립 프로젝트입니다. src/App.tsx,
          src/ui-core, src/patterns를 사용하며 원본 @hub 별칭은 로컬 경로에
          연결되어 있습니다.
        </p>
      </section>
      <section id="api" className="panel stack">
        <h2 className="section-title">
          04. Spring Boot 등 기존 백엔드와 연결하기
        </h2>
        <p className="text-sm muted leading-7">
          현재 CMS와 Cloud Console은 React 메모리 상태로 동작하며 서버에
          요청하지 않습니다. 아래는 연결 방법 예시입니다. 사용하려는 API의
          URL·요청/응답 DTO·인증 방식이 정해진 후 Mock 데이터와 이벤트를
          교체하세요.
        </p>
        <ol className="setup-list">
          <li>백엔드 서버를 실행합니다. 예: 8080 포트.</li>
          <li>
            개발 시 Vite의 /api 프록시로 브라우저 요청을 백엔드에 전달합니다.
          </li>
          <li>
            fetch 응답을 TypeScript 타입으로 정의하고 loading·error·empty 상태를
            처리합니다.
          </li>
          <li>저장·수정·삭제 액션도 POST·PUT·DELETE 계약에 맞춰 연결합니다.</li>
        </ol>
        <CodeBlock code={apiExample} />
        <div className="setup-callout">
          <Server size={18} />
          <span>
            Vite 프록시는 로컬 개발용입니다. 배포 시에는 Nginx·게이트웨이 등에서
            /api를 백엔드로 전달하거나, 별도 API 도메인과 CORS를 설정해야
            합니다. 쿠키 인증이면 credentials·SameSite·CSRF 정책도 서버와 함께
            정하세요.
          </span>
        </div>
        <h3 className="text-sm mb-0">환경변수는 어디에 두나요?</h3>
        <CodeBlock
          code={
            '# 프로젝트 루트 .env.local 예시 (현재 Mock 화면에서는 사용하지 않음)\nVITE_API_BASE_URL=/api\n\n# React 코드에서 사용\nconst baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";'
          }
        />
        <p className="text-xs muted leading-7">
          VITE_로 시작하는 값은 브라우저 번들에 노출됩니다. DB 비밀번호·API
          비밀키·서버 토큰은 넣지 마세요. 환경변수를 수정한 후 개발 서버를
          재시작합니다. .env.local은 Git에 올리지 않습니다.
        </p>
      </section>
      <section id="deploy" className="panel stack">
        <h2 className="section-title">05. 검사·빌드·배포</h2>
        <CodeBlock
          code={
            "pnpm typecheck       # 타입 검사\npnpm test            # 단위 테스트\npnpm build           # dist/ 에 배포용 정적 파일 생성\npnpm exec vite preview # 빌드 결과 로컬 확인\n\n# UI를 상태별로 확인하고 싶을 때\npnpm storybook       # localhost:6006"
          }
        />
        <p className="text-sm muted leading-7">
          dist/ 안의 index.html과 assets를 함께 정적 호스팅합니다.
          /design/buttons처럼 직접 접근하는 SPA 경로는 index.html로 돌려주어야
          합니다. cloud-console.html·admin-cms.html·analytics.html은 별도
          진입점이므로 함께 배포하세요. Vite preview는 빌드 확인용이며 운영
          서버로 사용하지 않습니다.
        </p>
        <CodeBlock
          code={
            "# Nginx location 예시: document root는 dist 디렉터리\nlocation / {\n  try_files $uri $uri/ /index.html;\n}\n# /api location은 프로젝트의 백엔드 주소에 맞춰 별도 설정"
          }
        />
      </section>
      <section id="troubleshoot" className="panel stack">
        <h2 className="section-title">06. 자주 막히는 부분</h2>
        {[
          [
            "node / pnpm 명령을 찾지 못함",
            "터미널을 새로 열고 node --version을 확인하세요. Node 설치 환경과 실행 환경(Windows/WSL)이 같은지 확인합니다.",
          ],
          [
            "ERR_PNPM_OUTDATED_LOCKFILE",
            "다른 브랜치의 package.json과 lockfile을 섞지 마세요. 의도적으로 의존성을 바꿨다면 pnpm install 후 lockfile도 함께 커밋합니다.",
          ],
          [
            "@hub/ui-core import를 찾지 못함",
            "단일 파일만 복사하면 공통 UI와 경로 설정이 빠집니다. 생성 ZIP을 사용하거나 필요한 소스와 Vite/TypeScript alias를 함께 옮기세요.",
          ],
          [
            "API 요청 실패 / CORS / 404",
            "Network 탭에서 실제 요청 URL과 응답을 확인하세요. 백엔드 실행 여부, 프록시 경로, 인증 쿠키 전달을 확인합니다.",
          ],
          [
            "수정한 데이터가 새로고침하면 사라짐",
            "현재는 Mock 메모리 상태입니다. 영구 저장하려면 실제 백엔드 API를 연결해야 합니다.",
          ],
          [
            "Cloudscape와 Tailwind 스타일 충돌",
            "Cloudscape 글로벌 CSS를 메인 앱에 함께 import하지 마세요. 현재처럼 별도 HTML 또는 독립 페이지 경계를 유지합니다.",
          ],
        ].map(([q, a]) => (
          <details className="setup-faq" key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <div className="row">
        <Button asChild>
          <Link to="/design">디자인 선택하러 가기</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/generator">독립 프로젝트 ZIP 생성</Link>
        </Button>
        <a
          className="text-xs text-primary"
          href="https://vite.dev/guide/env-and-mode"
          target="_blank"
          rel="noreferrer"
        >
          Vite 공식 환경변수 문서 ↗
        </a>
      </div>
    </div>
  );
}
