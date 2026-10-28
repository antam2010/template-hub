import { useState } from "react";
import { ArrowUpRight, Download, TrendingUp } from "lucide-react";
import { Button, Select, Toast } from "@hub/ui-core";
import { revenueSeries, chartPoints } from "@hub/patterns";
export function RevenueChart({ values }: { values: number[] }) {
  const pts = chartPoints(values);
  return (
    <svg
      role="img"
      aria-label={`매출 추이: ${values.join(", ")}`}
      viewBox="0 0 640 200"
      className="w-full"
    >
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="currentColor" stopOpacity=".22" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2="620"
          y2={y}
          stroke="currentColor"
          opacity=".08"
        />
      ))}
      <polygon points={`20,180 ${pts} 620,180`} fill="url(#area)" />
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {values.map((v, i) => (
        <text
          key={i}
          x={20 + i * 100}
          y="198"
          fontSize="10"
          textAnchor="middle"
          fill="currentColor"
          opacity=".6"
        >
          {i + 1}
        </text>
      ))}
    </svg>
  );
}
export default function Analytics() {
  const [period, setPeriod] = useState("최근 7일");
  const [channel, setChannel] = useState("전체");
  const [message, setMessage] = useState("");
  const base =
    revenueSeries[
      period === "최근 7일"
        ? "week"
        : period === "최근 30일"
          ? "month"
          : "quarter"
    ];
  const factor = channel === "전체" ? 1 : channel === "검색" ? 0.48 : 0.32;
  const values = base.map((v) => Math.round(v * factor));
  const sum = values.reduce((a, b) => a + b, 0);
  const stats = [
    ["총 매출", `₩${(sum * 10000).toLocaleString()}`, "12.8%"],
    ["방문자", (sum * 13).toLocaleString(), "8.2%"],
    ["전환 수", Math.round(sum * 0.45).toLocaleString(), "6.4%"],
    ["전환율", "3.46%", "0.4%"],
  ];
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          { period, channel, values, total: sum * 10000 },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = "analytics.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
    setMessage("분석 데이터를 내보냈습니다.");
  }
  return (
    <main className="template-page stack">
      <div className="row spread">
        <div>
          <span className="badge">
            <TrendingUp size={12} />
            ANALYTICS OVERVIEW
          </span>
          <h1 className="page-title mt-3">비즈니스 인사이트</h1>
          <p className="muted">데이터로 확인하는 서비스의 성장.</p>
        </div>
        <div className="row">
          <Select
            aria-label="분석 기간"
            options={["최근 7일", "최근 30일", "최근 90일"]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <Button variant="outline" onClick={download}>
            <Download size={15} />
            내보내기
          </Button>
        </div>
      </div>
      <div className="grid">
        {stats.map(([title, v, g]) => (
          <div className="panel" key={title}>
            <p className="text-sm muted">{title}</p>
            <div className="kpi text-[26px]" data-testid={`kpi-${title}`}>
              {v}
            </div>
            <div className="row mt-3 text-xs text-emerald-600">
              <ArrowUpRight size={14} />
              {g} <span className="muted">이전 기간 대비 · 예시</span>
            </div>
          </div>
        ))}
      </div>
      <section className="panel stack">
        <div className="row spread">
          <div>
            <h2 className="mb-1 text-lg">매출 추이</h2>
            <small>
              {period} · {channel} 채널 · 단위: 만 원
            </small>
          </div>
          <Select
            aria-label="유입 채널"
            options={["전체", "검색", "직접"]}
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </div>
        <div className="text-primary">
          <RevenueChart values={values} />
        </div>
        <details>
          <summary className="text-sm cursor-pointer muted">
            차트 데이터 표 보기
          </summary>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">선택 기간 매출</caption>
              <thead>
                <tr>
                  <th>구간</th>
                  <th>매출 (만 원)</th>
                </tr>
              </thead>
              <tbody>
                {values.map((v, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <div className="grid">
        <section className="panel stack">
          <h2 className="text-lg">유입 채널</h2>
          {[
            ["검색", 48],
            ["직접", 32],
            ["소셜", 20],
          ].map(([n, v]) => (
            <div key={n}>
              <div className="row spread mb-2 text-sm">
                <span>{n}</span>
                <span>{v}%</span>
              </div>
              <div className="h-2 rounded bg-background">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${v}%` }}
                />
              </div>
            </div>
          ))}
        </section>
        <section className="panel">
          <h2 className="text-lg">인기 페이지</h2>
          <table>
            <thead>
              <tr>
                <th>페이지</th>
                <th>조회 수</th>
              </tr>
            </thead>
            <tbody>
              {["/dashboard", "/products", "/pricing"].map((p, i) => (
                <tr key={p}>
                  <td>{p}</td>
                  <td>
                    {Math.round((sum / (i + 1)) * factor).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <small>
        결정적 Mock 데이터 · 비교 증감률과 채널 비중은 고정 예시입니다.
      </small>
      <Toast message={message} onClose={() => setMessage("")} />
    </main>
  );
}
