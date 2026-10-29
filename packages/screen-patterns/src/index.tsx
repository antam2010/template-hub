import type { ReactNode } from "react";
import {
  Alert,
  Button,
  Input,
  Select,
  Table,
  Pagination,
  Modal,
  Loading,
  type Column,
} from "@hub/ui-core";
export interface ListPageProps<T> {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T) => string | number;
  query: string;
  onQueryChange: (query: string) => void;
  status: string;
  statuses: string[];
  onStatusChange: (status: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}
/** Controlled composition: the consumer owns data, filtering, pagination and API state. */
export function ListPage<T>(p: ListPageProps<T>) {
  return (
    <section className="panel stack" aria-label={p.title}>
      <header className="row spread">
        <div>
          <h1 className="page-title">{p.title}</h1>
          <p className="muted">{p.description}</p>
        </div>
        <Button onClick={p.onCreate}>등록</Button>
      </header>
      <div className="row">
        <label className="stack">
          검색
          <Input
            value={p.query}
            onChange={(e) => p.onQueryChange(e.target.value)}
            placeholder="이름 또는 이메일"
          />
        </label>
        <label className="stack">
          상태
          <Select
            value={p.status}
            options={p.statuses}
            onChange={(e) => p.onStatusChange(e.target.value)}
          />
        </label>
      </div>
      {p.error ? (
        <Alert>
          <p>{p.error}</p>
          {p.onRetry && (
            <Button variant="outline" onClick={p.onRetry}>
              다시 시도
            </Button>
          )}
        </Alert>
      ) : p.loading ? (
        <Loading />
      ) : (
        <>
          <Table rows={p.rows} columns={p.columns} getKey={p.getKey} />
          <Pagination
            page={p.page}
            total={p.totalPages}
            onChange={p.onPageChange}
          />
        </>
      )}
    </section>
  );
}
export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void | Promise<void>;
  submitting?: boolean;
  error?: string;
}
/** Native form validation, Radix focus trap, async submit state controlled by consumer. */
export function FormDialog(p: FormDialogProps) {
  return (
    <Modal
      open={p.open}
      onOpenChange={(open) => {
        if (!p.submitting) p.onOpenChange(open);
      }}
      title={p.title}
      description="필수 항목을 입력한 뒤 저장하세요."
    >
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!p.submitting) void p.onSubmit();
        }}
      >
        {p.children}
        {p.error && <Alert>{p.error}</Alert>}
        <div className="row">
          <Button type="submit" loading={p.submitting}>
            저장
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={p.submitting}
            onClick={() => p.onOpenChange(false)}
          >
            취소
          </Button>
        </div>
      </form>
    </Modal>
  );
}
