/**
 * BADGE
 * A compact label chip for filters, statuses, and countable tags.
 *
 * Variants:
 *   pill  — rounded-full, for filter tabs like "All" / "To Do"
 *   status — rounded-[5px] tint, for inline status labels
 *   chip  — rounded-full with shadow-hairline, for informational chips
 *
 * Usage:
 *   <Badge>All</Badge>
 *   <Badge variant="status" tone="orange">To do</Badge>
 *   <Badge variant="chip">Draft</Badge>
 *   <Badge active={false}>To Do</Badge>
 *   <Badge count={2}>To Do</Badge>
 */

import type React from "react"

import { Dot } from "@/registry/ui/dot"

const STATUS_STYLES = {
  orange: "bg-orange-tint text-orange",
  accent: "bg-accent-tint text-accent-ink",
  green: "bg-green-tint text-green",
  red: "bg-red-tint text-red",
} as const

export type BadgeTone = keyof typeof STATUS_STYLES

export function Badge({
  children,
  variant = "pill",
  tone,
  active = true,
  count,
  dotColor,
  onClick,
  style,
  className,
}: {
  children: React.ReactNode
  variant?: "pill" | "status" | "chip"
  tone?: BadgeTone
  active?: boolean
  count?: number
  dotColor?: string
  onClick?: () => void
  style?: React.CSSProperties
  className?: string
}) {
  const shared = { className: className ?? undefined, style } as const

  if (variant === "status" && tone) {
    return (
      <span
        {...shared}
        className={`inline-flex h-5 items-center rounded-[5px] px-1.5 text-[11px] font-medium ${STATUS_STYLES[tone]} ${className ?? ""}`}
      >
        {children}
      </span>
    )
  }

  if (variant === "chip") {
    return (
      <span
        {...shared}
        className={`inline-flex h-5.5 items-center gap-1.5 rounded-full bg-inset px-2 text-[11.5px] font-medium shadow-hairline ${className ?? ""}`}
      >
        {dotColor && <Dot color={dotColor} />}
        {children}
      </span>
    )
  }

  // pill variant
  return (
    <button
      type="button"
      aria-pressed={active}
      {...shared}
      className={`flex h-6.5 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium transition-[background-color,box-shadow,color] duration-200 ${
        active ? "bg-surface text-ink shadow-btn" : "text-ink-2 hover:bg-hover"
      } ${className ?? ""}`}
      onClick={onClick}
    >
      {dotColor && <Dot color={dotColor} />}
      {children}
      {count !== undefined && (
        <span className={`text-[10.5px] tabular-nums ${active ? "text-ink-2" : "text-ink-3"}`}>{count}</span>
      )}
    </button>
  )
}
