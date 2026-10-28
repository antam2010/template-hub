import { useState, type ReactNode, type FormEvent } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Button, Input, Select } from "./index";
export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
}
export function Table<T>({
  rows,
  columns,
  getKey,
  emptyText = "검색 결과가 없습니다.",
}: {
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T) => string | number;
  emptyText?: string;
}) {
  return (
    <div className="table-scroll w-full">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)}>
              {columns.map((c) => (
                <td key={c.key}>{c.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <p className="p-5 text-center text-muted">{emptyText}</p>
      )}
    </div>
  );
}
export function Search({
  value,
  onChange,
  placeholder = "검색…",
  disabled = false,
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="row flex-nowrap">
      <SearchIcon size={16} aria-hidden="true" />
      <Input
        aria-label={placeholder}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export function Filter({
  value,
  options,
  onChange,
  label = "필터",
}: {
  value: string;
  options: string[];
  onChange: (s: string) => void;
  label?: string;
}) {
  return (
    <label className="row">
      {label}
      <Select
        options={options}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export interface NavigationProps {
  items: string[];
  active: string;
  onChange: (s: string) => void;
}
export function Navbar({ items, active, onChange }: NavigationProps) {
  return (
    <nav aria-label="상단 탐색" className="row">
      {items.map((i) => (
        <Button
          size="sm"
          variant={active === i ? "default" : "ghost"}
          aria-current={active === i ? "page" : undefined}
          key={i}
          onClick={() => onChange(i)}
        >
          {i}
        </Button>
      ))}
    </nav>
  );
}
export function Sidebar({ items, active, onChange }: NavigationProps) {
  return (
    <aside className="panel">
      <nav aria-label="사이드 탐색" className="stack">
        {items.map((i) => (
          <Button
            size="sm"
            variant={active === i ? "default" : "ghost"}
            aria-current={active === i ? "page" : undefined}
            key={i}
            onClick={() => onChange(i)}
          >
            {i}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
export function Breadcrumb({
  items,
  onNavigate,
}: {
  items: string[];
  onNavigate: (index: number) => void;
}) {
  return (
    <nav aria-label="탐색 경로">
      <ol className="row list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={i} className="row text-sm">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted">
                /
              </span>
            )}
            {i === items.length - 1 ? (
              <span aria-current="page">{item}</span>
            ) : (
              <button
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => onNavigate(i)}
              >
                {item}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Chart({
  values,
  label = "추이 차트",
}: {
  values: number[];
  label?: string;
}) {
  const max = Math.max(...values, 1);
  const points = values
    .map(
      (v, i) =>
        `${20 + (i * 600) / Math.max(values.length - 1, 1)},${160 - (v / max) * 140}`,
    )
    .join(" ");
  return (
    <svg
      role="img"
      aria-label={`${label}: ${values.join(", ")}`}
      viewBox="0 0 640 180"
      className="w-full text-primary"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Form({
  label = "이름",
  onSave,
  disabled = false,
  loading = false,
}: {
  label?: string;
  onSave: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [value, setValue] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) onSave(value.trim());
  }
  return (
    <form className="stack w-full max-w-xs" onSubmit={submit}>
      <label className="stack gap-2">
        {label}
        <Input
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
        />
      </label>
      <Button type="submit" disabled={disabled} loading={loading}>
        저장
      </Button>
    </form>
  );
}
