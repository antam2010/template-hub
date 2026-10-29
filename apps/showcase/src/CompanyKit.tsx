import { useState } from "react";
import { Badge, Input } from "@hub/ui-core";
import registry from "../../../registry/components.json";
import MembersPage from "../../../examples/company-members/src/App";
import { CodeBlock } from "./CodeBlock";
import example from "../../../examples/company-members/src/App.tsx?raw";
export function CompanyKit() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("ListPage");
  const components = registry.components.filter((c) =>
    `${c.id} ${c.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const active = registry.components.find((c) => c.id === selected)!;
  return (
    <div className="stack">
      <header>
        <Badge>COMPANY UI KIT · 0.1.0</Badge>
        <h1 className="page-title mt-4">AI는 조합하고, UI는 함께 씁니다.</h1>
        <p className="muted">
          공통 패키지 → 컴포넌트 명세 → 업무 화면 조합 → 정책 검사. 같은 버전의
          UI를 다른 프로젝트에서도 사용하세요.
        </p>
      </header>
      <div className="panel stack">
        <div className="row spread">
          <div>
            <h2>회원 관리로 시작하기</h2>
            <p>
              설치 가능한 공통 패키지 2개, 실행 예제, AI 지침, UI 검사기를 한
              번에 받습니다.
            </p>
          </div>
          <a
            className="badge"
            href="/distribution/company-members.zip"
            download
          >
            시작 프로젝트 ZIP 다운로드 ↗
          </a>
        </div>
        <CodeBlock code={"pnpm install\npnpm dev\npnpm check:ui\npnpm build"} />
        <small>
          Node ≥22.12 · pnpm 11.25 · React 19.3.1 · TypeScript 5.9.3 · Vite
          7.3.7. ZIP 안의 README에 환경 설정과 이식 절차를 제공합니다.
        </small>
        <p className="muted">
          참조 구현입니다. 회사 디자인 승인과 사내 npm 저장소 연결은 아직
          수행하지 않았습니다.
        </p>
      </div>
      <details className="panel">
        <summary>AI에게 전달할 개발 요청</summary>
        <CodeBlock
          code={
            "AGENTS.md와 registry/components.json을 먼저 읽어줘.\n회원 관리 화면을 공통 패키지의 ListPage와 FormDialog로 조합해줘.\nUI를 새로 작성하거나 스타일을 덮어쓰지 말고 데이터와 API 연결만 구현해줘.\n없는 컴포넌트는 부족한 항목을 보고해줘.\n완료 후 pnpm check:ui와 pnpm build를 실행해줘."
          }
        />
      </details>
      <section className="stack">
        <h2>실제 조합 예제</h2>
        <MembersPage />
        <details className="panel">
          <summary>조합 코드 보기</summary>
          <CodeBlock code={example} />
        </details>
      </section>
      <section className="panel stack">
        <div className="row spread">
          <div>
            <h2>공통 컴포넌트 명세</h2>
            <p className="muted">
              화면과 AI가 같은 registry를 사용합니다. 전체 타입 계약은 패키지의
              .d.ts를 기준으로 합니다.
            </p>
          </div>
          <a className="badge" href="/distribution/registry.json" download>
            AI용 JSON 다운로드
          </a>
        </div>
        <Input
          aria-label="공통 컴포넌트 검색"
          placeholder="컴포넌트 이름 또는 용도 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="row">
          {components.map((c) => (
            <button
              className="badge"
              key={c.id}
              aria-pressed={selected === c.id}
              onClick={() => setSelected(c.id)}
            >
              {c.id}
            </button>
          ))}
        </div>
        {!components.length && (
          <p role="status">일치하는 컴포넌트가 없습니다.</p>
        )}
        <div className="stack">
          <h3>
            {active.id}{" "}
            <small>
              {active.package} @{active.version}
            </small>
          </h3>
          <p>{active.description}</p>
          <CodeBlock code={active.import} />
          <CodeBlock code={JSON.stringify(active.contract, null, 2)} />
          <ul>
            {active.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="panel">
        <h2>무엇을 검사하나요?</h2>
        <p>
          예제의 src 전체에서 승인되지 않은 import·컴포넌트, 직접 만든
          버튼·입력·표, CSS 파일, className·style, 동적 UI 생성을 검사합니다.
          CI에서도 동일한 검사와 별도 프로젝트 설치·빌드를 실행합니다.
        </p>
        <p className="muted">
          이 검사는 보안 샌드박스가 아닙니다. 정책 파일과 공통 패키지의 변경은
          코드 리뷰가 필요합니다. 기존 12종 템플릿 전체에 이 정책이 적용된
          상태는 아니며, 회원 관리 예제부터 적용했습니다.
        </p>
      </section>
    </div>
  );
}
