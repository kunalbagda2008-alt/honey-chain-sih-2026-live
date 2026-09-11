import type { ReactNode } from "react";

export function Section({
  id,
  index,
  title,
  subtitle,
  children,
}: {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
          0{index}
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function TechTag({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
      <span className="rounded-md bg-primary/15 px-2 py-0.5 font-display text-xs font-bold tracking-wide text-primary">
        {label}
      </span>
      {children}
    </p>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
}) {
  const styles = {
    primary:
      "bg-primary text-primary-foreground hover:brightness-95 shadow-lg shadow-primary/20",
    outline: "border border-primary/45 text-primary hover:bg-primary/10",
    ghost: "border border-border text-foreground hover:bg-secondary",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-display text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "honey",
}: {
  children: ReactNode;
  tone?: "honey" | "success" | "danger" | "muted";
}) {
  const tones = {
    honey: "bg-primary/15 text-primary border-primary/35",
    success: "bg-success/15 text-success border-success/35",
    danger: "bg-destructive/15 text-destructive border-destructive/35",
    muted: "bg-secondary text-muted-foreground border-border",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones}`}
    >
      {children}
    </span>
  );
}
