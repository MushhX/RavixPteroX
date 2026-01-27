"use client";

import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("mx-auto max-w-6xl px-6", className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("px-5 py-4 border-b border-[color:var(--border)]", className)} {...props} />;
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("px-5 py-4", className)} {...props} />;
}

export function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold opacity-70">{label}</div>
        {icon ? <div className="opacity-80">{icon}</div> : null}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs opacity-70">{sub}</div> : null}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children?: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "info" }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
      : tone === "warn"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-100"
        : tone === "bad"
          ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
          : tone === "info"
            ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
            : "border-[color:var(--border)] bg-[color:var(--muted)]";

  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", toneClass)}>
      {children || tone.toUpperCase()}
    </span>
  );
}

export function Button({ className, variant = "default", size = "default", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" | "outline"; size?: "default" | "sm" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none";

  const sizeClass = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";

  const v =
    variant === "ghost"
      ? "bg-transparent hover:bg-[color:var(--muted)]"
      : variant === "outline"
        ? "border border-[color:var(--border)] bg-transparent hover:bg-[color:var(--muted)]"
        : "bg-[color:var(--accent)] text-black hover:brightness-110";

  return <button className={cx(base, sizeClass, v, className)} {...props} />;
}

export function Progress({ value, tone = "accent" }: { value: number; tone?: "accent" | "good" | "warn" | "bad" }) {
  const clamped = Math.max(0, Math.min(100, value));
  const bar =
    tone === "good"
      ? "bg-emerald-400"
      : tone === "warn"
        ? "bg-amber-400"
        : tone === "bad"
          ? "bg-rose-400"
          : "bg-[color:var(--accent)]";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
      <div className={cx("h-full rounded-full", bar)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
