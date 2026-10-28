import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Plus,
  Search,
  ArrowRight,
  MoreHorizontal,
  FolderOpen,
  Settings,
  LayoutDashboard,
  Bell,
  Download,
  Check,
  Activity,
  FileText,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button, Modal, Input, Select, Toast, Checkbox } from "@hub/ui-core";
import { blueprintFor, type TemplateConfig, type Row } from "./model";
import "./workspace.css";
export default function WorkspaceTemplate({
  config: c,
}: {
  config: TemplateConfig;
}) {
  const b = blueprintFor(c.blueprint);
  const [items, setItems] = useState(b.rows);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("전체");
  const [active, setActive] = useState("main");
  const [period, setPeriod] = useState("최근 7일");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [notice, setNotice] = useState("");
  const [log, setLog] = useState([
    "김민지님이 워크스페이스를 확인했습니다.",
    "이도윤님이 새 항목을 등록했습니다.",
    "팀 설정이 업데이트되었습니다.",
  ]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [workspace, setWorkspace] = useState(c.brand);
  const [email, setEmail] = useState("admin@example.com");
  const [notifications, setNotifications] = useState(true);
  useEffect(() => {
    setItems(b.rows);
    setQuery("");
    setFilter("전체");
    setActive("main");
    setWorkspace(c.brand);
  }, [c.blueprint, c.brand]);
  const filtered = items.filter(
    (i) =>
      i.cells.join(" ").toLowerCase().includes(query.toLowerCase()) &&
      (filter === "전체" || i.status === filter),
  );
  const announce = (text: string) => {
    setNotice(text);
    setLog((prev) => [text, ...prev].slice(0, 8));
  };
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const cells = b.columns.map((_, i) =>
      String(form.get(`field-${i}`) ?? "").trim(),
    );
    if (cells.some((v) => !v)) return;
    const item = {
      id: editing?.id ?? Date.now(),
      cells,
      status: String(form.get("status")),
    };
    setItems((prev) =>
      editing
        ? prev.map((i) => (i.id === editing.id ? item : i))
        : [item, ...prev],
    );
    setOpen(false);
    announce(editing ? "항목을 수정했습니다." : "새 항목을 등록했습니다.");
  }
  function nextStatus(item: Row) {
    const next =
      b.statuses[(b.statuses.indexOf(item.status) + 1) % b.statuses.length];
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)),
    );
    announce(`${item.cells[0]} → ${next}`);
  }
  function exportData() {
    const u = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { template: c.blueprint, period, items: filtered },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = `${c.blueprint}-data.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
    announce("현재 데이터를 내보냈습니다.");
  }
  function edit(row: Row | null) {
    setEditing(row);
    setOpen(true);
  }
  const chartValues = (
    c.blueprint === "traffic"
      ? [21, 29, 25, 43, 37, 58, 69]
      : c.blueprint === "monitor"
        ? [62, 54, 68, 57, 72, 64, 78]
        : [18, 24, 21, 34, 29, 47, 53]
  ).map((v) => (period === "최근 30일" ? Math.round(v * 1.7) : v));
  const max = Math.max(...chartValues);
  const points = chartValues
    .map((v, i) => `${20 + i * 100},${170 - (v / max) * 140}`)
    .join(" ");
  const isChart = b.view === "chart";
  const stats =
    c.blueprint === "traffic"
      ? [
          [
            "방문자",
            (chartValues.reduce((a, v) => a + v, 0) * 120).toLocaleString(),
          ],
          [
            "페이지 조회",
            (chartValues.reduce((a, v) => a + v, 0) * 280).toLocaleString(),
          ],
          ["평균 체류", "3분 20초"],
        ]
      : c.blueprint === "sales"
        ? [
            [
              "총 매출",
              `₩${(chartValues.reduce((a, v) => a + v, 0) * 10000).toLocaleString()}`,
            ],
            ["거래 수", String(items.length)],
            ["전환율", "3.46%"],
          ]
        : [
            ["전체 항목", String(items.length)],
            [
              b.statuses[0],
              String(items.filter((i) => i.status === b.statuses[0]).length),
            ],
            [
              "다른 상태",
              String(items.filter((i) => i.status !== b.statuses[0]).length),
            ],
          ];
  const mainLabel =
    b.view === "files"
      ? "파일 선택"
      : isChart
        ? "데이터 내보내기"
        : b.view === "settings"
          ? "설정 저장"
          : "새 항목 등록";
  const action = () => {
    if (b.view === "files") fileInput.current?.click();
    else if (isChart) exportData();
    else if (b.view === "settings")
      announce("설정을 저장했습니다. 이 미리보기에서만 유지됩니다.");
    else edit(null);
  };
  const settings = (
    <form
      className="wt-panel wt-settings"
      onSubmit={(e) => {
        e.preventDefault();
        announce("설정을 저장했습니다. 이 미리보기에서만 유지됩니다.");
      }}
    >
      <h2>워크스페이스 기본 정보</h2>
      <label>
        워크스페이스 이름
        <Input
          required
          maxLength={40}
          value={workspace}
          onChange={(e) => setWorkspace(e.target.value)}
        />
      </label>
      <label>
        관리자 이메일
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <Checkbox
        label="업데이트 이메일 받기"
        checked={notifications}
        onCheckedChange={setNotifications}
      />
      <Button type="submit">설정 저장</Button>
      <small>입력한 정보는 서버로 전송하지 않습니다.</small>
    </form>
  );
  return (
    <div
      className={`workspace-template wt-layout-${c.navigation} wt-density-${c.density} wt-${c.radius}`}
      style={{ "--wt-accent": `var(--wt-${c.accent})` } as CSSProperties}
    >
      <nav className="wt-nav" aria-label="템플릿 메뉴">
        <div className="wt-brand">
          <span>W</span>
          <strong>{workspace || c.brand}</strong>
        </div>
        <small>WORKSPACE</small>
        {[
          ["main", c.title, LayoutDashboard],
          ["activity", "활동 기록", Activity],
          ["settings", "설정", Settings],
        ].map(([key, label, Icon]) => {
          const I = Icon as typeof Settings;
          return (
            <button
              aria-label={String(label)}
              className={active === key ? "active" : ""}
              key={String(key)}
              onClick={() => setActive(String(key))}
            >
              <I size={16} />
              <span>{String(label)}</span>
            </button>
          );
        })}
        <div className="wt-nav-footer">
          <span className="wt-avatar">MK</span>
          <span>
            김민지<small>워크스페이스 관리자</small>
          </span>
        </div>
      </nav>
      <div className="wt-body">
        <header className="wt-topbar">
          <span>
            Workspace{" "}
            <span className="muted">
              /{" "}
              {active === "main"
                ? c.title
                : active === "activity"
                  ? "활동 기록"
                  : "설정"}
            </span>
          </span>
          <span className="badge">Mock 데이터</span>
        </header>
        <main className="wt-content">
          <div className="wt-heading">
            <div>
              <small>{b.tag} / OVERVIEW</small>
              <h1>
                {active === "main"
                  ? c.title
                  : active === "activity"
                    ? "활동 기록"
                    : "워크스페이스 설정"}
              </h1>
              <p>
                {active === "main"
                  ? b.description
                  : "팀의 작업 공간을 편리하게 관리하세요."}
              </p>
            </div>
            {active === "main" && b.view !== "settings" && (
              <Button onClick={action}>
                {isChart ? <Download size={15} /> : <Plus size={15} />}{" "}
                {mainLabel}
              </Button>
            )}
          </div>
          {active === "settings" ||
          (active === "main" && b.view === "settings") ? (
            settings
          ) : active === "activity" ? (
            <section className="wt-panel">
              <h2>최근 활동</h2>
              {log.map((entry, i) => (
                <div className="wt-activity" key={`${entry}-${i}`}>
                  <span className="wt-avatar">{i === 0 ? "MK" : "JD"}</span>
                  <span>
                    {entry}
                    <small>{i === 0 ? "방금 전" : `${i * 12}분 전`}</small>
                  </span>
                </div>
              ))}
            </section>
          ) : (
            <>
              {c.metrics && (
                <div className="wt-metrics">
                  {stats.map(([label, value]) => (
                    <section className="wt-panel" key={label}>
                      <small>{label}</small>
                      <strong>{value}</strong>
                      <span className="wt-stat-note">
                        {isChart
                          ? `${period} · 예시 데이터`
                          : "현재 워크스페이스"}
                      </span>
                    </section>
                  ))}
                </div>
              )}
              {isChart && c.chart && (
                <section className="wt-panel wt-chart">
                  <div className="row spread">
                    <div>
                      <h2>
                        {c.blueprint === "traffic"
                          ? "방문자 추이"
                          : c.blueprint === "monitor"
                            ? "요청 처리량"
                            : "매출 추이"}
                      </h2>
                      <small>{period} · 샘플 데이터</small>
                    </div>
                    <Select
                      aria-label="분석 기간"
                      options={["최근 7일", "최근 30일"]}
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    />
                  </div>
                  <svg
                    role="img"
                    aria-label={`추이 데이터 ${chartValues.join(",")}`}
                    viewBox="0 0 640 200"
                  >
                    <defs>
                      <linearGradient id="wt-area" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="currentColor" stopOpacity=".16" />
                        <stop
                          offset="1"
                          stopColor="currentColor"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    {[40, 80, 120, 160].map((y) => (
                      <line
                        x1="20"
                        x2="620"
                        y1={y}
                        y2={y}
                        stroke="currentColor"
                        opacity=".08"
                        key={y}
                      />
                    ))}
                    <polygon
                      points={`20,180 ${points} 620,180`}
                      fill="url(#wt-area)"
                    />
                    <polyline
                      points={points}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <details>
                    <summary>차트 값 보기</summary>
                    <p>{chartValues.join(" · ")}</p>
                  </details>
                </section>
              )}
              <section className="wt-panel">
                <div className="wt-list-heading">
                  <h2>
                    {b.view === "board"
                      ? "업무 보드"
                      : b.view === "files"
                        ? "문서 보관함"
                        : isChart
                          ? "최근 데이터"
                          : "전체 목록"}
                    <span>{filtered.length}</span>
                  </h2>
                  {c.filters && (
                    <div className="row">
                      <label className="wt-search">
                        <Search size={14} />
                        <input
                          aria-label="항목 검색"
                          placeholder="검색어를 입력하세요"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </label>
                      <Select
                        aria-label="목록 상태 필터"
                        options={["전체", ...b.statuses]}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                {b.view === "board" ? (
                  <div className="wt-board">
                    {b.statuses.map((status) => (
                      <section key={status}>
                        <h3>
                          {status}{" "}
                          <small>
                            {filtered.filter((i) => i.status === status).length}
                          </small>
                        </h3>
                        {filtered
                          .filter((i) => i.status === status)
                          .map((item) => (
                            <article className="wt-task" key={item.id}>
                              <span className="badge">{item.cells[2]}</span>
                              <h3>{item.cells[0]}</h3>
                              <p>{item.cells[1]}</p>
                              <div className="row spread">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => edit(item)}
                                  aria-label={`${item.cells[0]} 수정`}
                                >
                                  <Pencil size={13} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => nextStatus(item)}
                                >
                                  {status === "완료"
                                    ? "다시 시작"
                                    : "다음 단계"}
                                  <ArrowRight size={12} />
                                </Button>
                              </div>
                            </article>
                          ))}
                      </section>
                    ))}
                  </div>
                ) : b.view === "files" || c.display === "cards" ? (
                  <div className="wt-cards">
                    {filtered.map((item) => (
                      <article className="wt-item-card" key={item.id}>
                        {b.view === "files" ? (
                          <FolderOpen size={26} className="wt-colored" />
                        ) : (
                          <span className="wt-avatar">
                            {item.cells[0].slice(0, 1)}
                          </span>
                        )}
                        <h3>{item.cells[0]}</h3>
                        <p>{item.cells.slice(1).join(" · ")}</p>
                        <div className="row spread">
                          <span className="badge">{item.status}</span>
                          <div className="row">
                            <button
                              aria-label={`${item.cells[0]} 수정`}
                              onClick={() => edit(item)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              aria-label={`${item.cells[0]} 삭제`}
                              onClick={() => setDeleting(item)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          {b.columns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                          <th>상태</th>
                          <th>관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((item) => (
                          <tr key={item.id}>
                            {item.cells.map((cell, i) => (
                              <td key={i}>
                                {i === 0 ? (
                                  <span className="wt-row-name">
                                    <span className="wt-avatar">
                                      {cell.slice(0, 1)}
                                    </span>
                                    {cell}
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                            <td>
                              <span className="badge">{item.status}</span>
                            </td>
                            <td>
                              <div className="row flex-nowrap">
                                {c.blueprint === "monitor" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => nextStatus(item)}
                                  >
                                    상태 전환
                                  </Button>
                                ) : (
                                  <>
                                    <button
                                      aria-label={`${item.cells[0]} 수정`}
                                      onClick={() => edit(item)}
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      aria-label={`${item.cells[0]} 삭제`}
                                      onClick={() => setDeleting(item)}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {!filtered.length && (
                  <p className="wt-empty">조건에 맞는 항목이 없습니다.</p>
                )}
                <div className="wt-list-footer">
                  <small>{filtered.length}개 항목 · 로컬 Mock 데이터</small>
                  <Button variant="ghost" size="sm" onClick={exportData}>
                    <Download size={13} />
                    데이터 내보내기
                  </Button>
                </div>
              </section>
              {c.activity && (
                <section className="wt-panel">
                  <h2>최근 활동</h2>
                  {log.slice(0, 3).map((entry, i) => (
                    <div className="wt-activity" key={i}>
                      <span className="wt-avatar">MK</span>
                      <span>
                        {entry}
                        <small>{i === 0 ? "방금 전" : `${i * 12}분 전`}</small>
                      </span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
          <p className="wt-disclaimer">
            Mock 데이터 · 화면 새로고침과 구성 변경 시 초기화됩니다.
            {b.view === "files" && " 파일은 서버로 전송하지 않습니다."}
          </p>
        </main>
      </div>
      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          const selected = Array.from(e.target.files ?? []);
          if (selected.some((f) => f.size > 5 * 1024 * 1024)) {
            announce("파일당 5 MB 이하로 선택하세요.");
            return;
          }
          setItems((prev) => [
            ...selected.map((f, i) => ({
              id: Date.now() + i,
              cells: [f.name, `${Math.round(f.size / 1024)} KB`, "방금 전"],
              status: "개인",
            })),
            ...prev,
          ]);
          announce(
            `${selected.length}개 파일을 선택했습니다. 서버로 전송하지 않습니다.`,
          );
          e.target.value = "";
        }}
      />
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={editing ? "항목 수정" : "새 항목 등록"}
      >
        <form className="stack" key={editing?.id ?? "new"} onSubmit={save}>
          {b.columns.map((col, i) => (
            <label className="stack gap-2" key={col}>
              {col}
              <Input
                name={`field-${i}`}
                defaultValue={editing?.cells[i] ?? ""}
                maxLength={120}
                required
              />
            </label>
          ))}
          <label className="stack gap-2">
            상태
            <Select
              name="status"
              options={b.statuses}
              defaultValue={editing?.status ?? b.statuses[0]}
            />
          </label>
          <Button type="submit">저장</Button>
        </form>
      </Modal>
      <Modal
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="항목 삭제"
        description={`“${deleting?.cells[0] ?? ""}” 항목을 삭제할까요?`}
      >
        <div className="row">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setItems((prev) => prev.filter((i) => i.id !== deleting?.id));
              setDeleting(null);
              announce("항목을 삭제했습니다.");
            }}
          >
            삭제 확인
          </Button>
        </div>
      </Modal>
      <Toast message={notice} onClose={() => setNotice("")} />
    </div>
  );
}
