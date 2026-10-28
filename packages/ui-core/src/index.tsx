import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
const variants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-45 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:opacity-90 dark:text-slate-950",
        outline:
          "border border-border bg-card text-foreground hover:bg-background",
        ghost: "text-muted hover:bg-background",
        destructive: "bg-rose-700 text-white hover:bg-rose-800",
      },
      size: { default: "h-10 px-4", sm: "h-8 px-3 text-xs", lg: "h-12 px-6" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variants> {
  asChild?: boolean;
  loading?: boolean;
}
// shadcn/ui source-owned Button pattern: Radix Slot + CVA + cn.
export function Button({
  asChild = false,
  variant,
  size,
  className,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  if (asChild)
    return (
      <Slot
        className={cn(variants({ variant, size }), className)}
        aria-busy={loading || undefined}
        {...props}
      >
        {children}
      </Slot>
    );
  return (
    <button
      className={cn(variants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>;
}
export function Loading() {
  return (
    <span role="status" className="row">
      <Loader2 className="animate-spin" size={18} />
      불러오는 중…
    </span>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full" {...props} />;
}
export function Select({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select {...props}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
export function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-border bg-background p-4 text-sm"
    >
      {children}
    </div>
  );
}

export * from "./composites";

export * from "./pattern-components";
