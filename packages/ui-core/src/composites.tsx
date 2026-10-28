import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, X, UploadCloud } from "lucide-react";
import { Button } from "./index";
export function Checkbox({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="row">
      <CheckboxPrimitive.Root
        className="flex h-5 w-5 items-center justify-center rounded border border-border bg-card text-primary disabled:opacity-40"
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        disabled={disabled}
      >
        <CheckboxPrimitive.Indicator>
          <Check size={14} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label}
    </label>
  );
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-xl border border-border bg-card p-6 text-foreground shadow-xl">
          <Dialog.Title className="pr-8 text-xl font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2 text-sm text-muted">
            {description ?? "입력 내용을 확인하고 작업을 완료하세요."}
          </Dialog.Description>
          <Dialog.Close
            className="absolute right-4 top-4 rounded p-1"
            aria-label="닫기"
          >
            <X size={20} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function Tabs({
  items,
}: {
  items: { label: string; content: ReactNode }[];
}) {
  return (
    <TabsPrimitive.Root defaultValue={items[0]?.label}>
      <TabsPrimitive.List
        className="row border-b border-border mb-5"
        aria-label="미리보기 탭"
      >
        {items.map((i) => (
          <TabsPrimitive.Trigger
            className="px-4 py-3 text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
            value={i.label}
            key={i.label}
          >
            {i.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((i) => (
        <TabsPrimitive.Content value={i.label} key={i.label}>
          {i.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (n: number) => void;
}) {
  return (
    <nav aria-label="페이지 이동" className="row">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </Button>
      <span className="text-sm" aria-live="polite">
        {page} / {Math.max(total, 1)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
      >
        다음
      </Button>
    </nav>
  );
}
export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return message ? (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[60] flex max-w-[calc(100%-48px)] items-center gap-4 rounded-lg border border-border bg-card p-4 text-sm text-foreground shadow-xl"
    >
      <Check size={18} className="text-primary" />
      {message}
      <button onClick={onClose} aria-label="알림 닫기">
        <X size={16} />
      </button>
    </div>
  ) : null;
}
export function FileUpload({ disabled = false }: { disabled?: boolean }) {
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  return (
    <div className="stack">
      <label className="panel stack text-center">
        <UploadCloud className="mx-auto text-primary" />
        <span>파일 선택 (최대 5 MB / 파일)</span>
        <input
          type="file"
          multiple
          disabled={disabled}
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            if (list.some((f) => f.size > 5 * 1024 * 1024)) {
              setError("5 MB 이하의 파일을 선택하세요.");
              return;
            }
            setError("");
            setFiles(list.map((f) => f.name));
          }}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <ul>
        {files.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <small>로컬 파일 이름만 표시하며 서버로 전송하지 않습니다.</small>
    </div>
  );
}
