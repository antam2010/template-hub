import { useState } from "react";
import { Button, Input, Select, Badge, type Column } from "@hub/ui-core";
import { ListPage, FormDialog } from "@hub/screen-patterns";
type Member = { id: number; name: string; email: string; status: string };
const initial: Member[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `회원 ${i + 1}`,
  email: `member${i + 1}@example.com`,
  status: i % 3 === 0 ? "대기" : "활성",
}));
export default function MembersPage() {
  const [rows, setRows] = useState(initial),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("전체"),
    [page, setPage] = useState(1);
  const [open, setOpen] = useState(false),
    [editing, setEditing] = useState<number | null>(null),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [memberStatus, setMemberStatus] = useState("활성"),
    [error, setError] = useState("");
  const filtered = rows.filter(
    (row) =>
      (status === "전체" || row.status === status) &&
      `${row.name} ${row.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  const total = Math.max(1, Math.ceil(filtered.length / 5));
  const current = Math.min(page, total);
  function edit(row?: Member) {
    setEditing(row?.id ?? null);
    setName(row?.name ?? "");
    setEmail(row?.email ?? "");
    setMemberStatus(row?.status ?? "활성");
    setError("");
    setOpen(true);
  }
  const columns: Column<Member>[] = [
    { key: "name", header: "이름", cell: (r) => r.name },
    { key: "email", header: "이메일", cell: (r) => r.email },
    { key: "status", header: "상태", cell: (r) => <Badge>{r.status}</Badge> },
    {
      key: "actions",
      header: "작업",
      cell: (r) => (
        <Button variant="outline" size="sm" onClick={() => edit(r)}>
          수정
        </Button>
      ),
    },
  ];
  function save() {
    if (!name.trim() || !email.trim()) {
      setError("이름과 이메일을 입력하세요.");
      return;
    }
    if (
      rows.some(
        (r) =>
          r.id !== editing &&
          r.email.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      setError("이미 등록된 이메일입니다.");
      return;
    }
    const row = {
      id: editing ?? Date.now(),
      name: name.trim(),
      email: email.trim(),
      status: memberStatus,
    };
    setRows((old) =>
      editing ? old.map((r) => (r.id === editing ? row : r)) : [row, ...old],
    );
    setPage(1);
    setOpen(false);
  }
  return (
    <>
      <ListPage
        title="회원 관리"
        description="공통 패키지를 조합한 예제입니다. Mock 데이터는 새로고침하면 초기화됩니다."
        rows={filtered.slice((current - 1) * 5, current * 5)}
        columns={columns}
        getKey={(r) => r.id}
        query={query}
        onQueryChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
        status={status}
        statuses={["전체", "활성", "대기"]}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        page={current}
        totalPages={total}
        onPageChange={setPage}
        onCreate={() => edit()}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "회원 수정" : "회원 등록"}
        onSubmit={save}
        error={error}
      >
        <label>
          이름
          <Input
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          이메일
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          상태
          <Select
            options={["활성", "대기"]}
            value={memberStatus}
            onChange={(e) => setMemberStatus(e.target.value)}
          />
        </label>
      </FormDialog>
    </>
  );
}
