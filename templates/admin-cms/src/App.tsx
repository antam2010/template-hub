import { useState } from "react";
import { Plus, Search, FileText, Pencil, Trash2, Download } from "lucide-react";
import {
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Pagination,
  Toast,
} from "@hub/ui-core";
import { initialContent, filterContent, type ContentItem } from "@hub/patterns";
export default function AdminCMS() {
  const [items, setItems] = useState(initialContent);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("전체");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<ContentItem | null>(null);
  const [message, setMessage] = useState("");
  const filtered = filterContent(items, query, status);
  const total = Math.max(1, Math.ceil(filtered.length / 4));
  const current = Math.min(page, total);
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const item = {
      id: editing?.id ?? Date.now(),
      title: String(d.get("title")).trim(),
      category: String(d.get("category")),
      status: String(d.get("status")),
      updated: new Date().toISOString().slice(0, 10),
    };
    if (!item.title) return;
    setItems((prev) =>
      editing
        ? prev.map((i) => (i.id === editing.id ? item : i))
        : [item, ...prev],
    );
    setOpen(false);
    setMessage(editing ? "콘텐츠를 수정했습니다." : "콘텐츠를 등록했습니다.");
    setPage(1);
  }
  function exportCsv() {
    const csv =
      "\uFEFF제목,카테고리,상태,수정일\n" +
      filtered
        .map((i) =>
          [i.title, i.category, i.status, i.updated]
            .map(
              (v) =>
                '"' + v.replaceAll('"', '""').replace(/^[=+@-]/, "'$&") + '"',
            )
            .join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "contents.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("현재 검색 결과를 내보냈습니다.");
  }
  return (
    <main className="template-page stack">
      <div className="row spread">
        <div>
          <span className="badge">WORKSPACE / CONTENT</span>
          <h1 className="page-title mt-3">콘텐츠 관리</h1>
          <p className="muted">콘텐츠를 작성하고 팀과 함께 운영하세요.</p>
        </div>
        <div className="row">
          <Button variant="outline" onClick={exportCsv}>
            <Download size={15} />
            CSV 내보내기
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus size={16} />
            콘텐츠 등록
          </Button>
        </div>
      </div>
      <div className="grid">
        {[
          ["전체 콘텐츠", items.length],
          ["게시 중", items.filter((i) => i.status === "게시").length],
          ["검토 대기", items.filter((i) => i.status === "검토").length],
        ].map(([t, n]) => (
          <div className="panel" key={t}>
            <p className="muted text-sm">{t}</p>
            <div className="kpi">
              {n}
              <span className="ml-2 text-xs font-normal text-muted">개</span>
            </div>
          </div>
        ))}
      </div>
      <section className="panel stack">
        <div className="row spread">
          <h2 className="m-0 text-lg">
            콘텐츠 목록 <span className="text-muted">({filtered.length})</span>
          </h2>
          <div className="row">
            <label className="row">
              <Search size={16} />
              <input
                aria-label="콘텐츠 검색"
                placeholder="제목으로 검색…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <Select
              aria-label="상태 필터"
              options={["전체", "게시", "초안", "검토"]}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>카테고리</th>
                <th>상태</th>
                <th>수정일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice((current - 1) * 4, current * 4).map((i) => (
                <tr key={i.id}>
                  <td>
                    <span className="row whitespace-nowrap">
                      <FileText size={16} className="text-primary" />
                      {i.title}
                    </span>
                  </td>
                  <td>{i.category}</td>
                  <td>
                    <Badge>{i.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap muted">{i.updated}</td>
                  <td>
                    <div className="row flex-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`${i.title} 수정`}
                        onClick={() => {
                          setEditing(i);
                          setOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`${i.title} 삭제`}
                        onClick={() => setDeleting(i)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center muted">검색 결과가 없습니다.</p>
          )}
        </div>
        <div className="row spread">
          <small>총 {filtered.length}개 · 페이지당 4개</small>
          <Pagination page={current} total={total} onChange={setPage} />
        </div>
      </section>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={editing ? "콘텐츠 수정" : "콘텐츠 등록"}
      >
        <form key={editing?.id ?? "new"} onSubmit={save} className="stack">
          <label className="stack gap-2">
            제목
            <Input
              name="title"
              required
              maxLength={100}
              defaultValue={editing?.title}
            />
          </label>
          <label className="stack gap-2">
            카테고리
            <Select
              name="category"
              options={["공지", "가이드", "블로그"]}
              defaultValue={editing?.category}
            />
          </label>
          <label className="stack gap-2">
            상태
            <Select
              name="status"
              options={["초안", "검토", "게시"]}
              defaultValue={editing?.status}
            />
          </label>
          <Button type="submit">저장</Button>
        </form>
      </Modal>
      <Modal
        open={!!deleting}
        onOpenChange={(v) => {
          if (!v) setDeleting(null);
        }}
        title="콘텐츠 삭제"
        description={`“${deleting?.title ?? ""}” 콘텐츠를 삭제할까요?`}
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
              setMessage("콘텐츠를 삭제했습니다.");
            }}
          >
            삭제 확인
          </Button>
        </div>
      </Modal>
      <Toast message={message} onClose={() => setMessage("")} />
      <small>Mock 데이터 · 새로고침하면 초기화됩니다.</small>
    </main>
  );
}
