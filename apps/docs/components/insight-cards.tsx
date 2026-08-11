"use client"

import type { PointerEvent } from "react"
import { useMemo, useState } from "react"

/**
 * INSIGHT CARDS
 * Paged agent insights with a small scrub-ready line chart. Each page
 * pairs a one-line takeaway with a metric visualization.
 */

function formatPercent(v: number) {
  return `${v > 0 ? "+" : ""}${v.toFixed(2)}%`
}

function useChartPath(values: number[], width: number, height: number, padding = 6) {
  return useMemo(() => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * (width - padding * 2) + padding
      const y = height - padding - ((v - min) / range) * (height - padding * 2)
      return [x, y] as const
    })
    const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
    return { d, points }
  }, [values, width, height, padding])
}

function MiniChart({
  values,
  color,
  formatValue,
}: {
  values: number[]
  color: string
  formatValue: (v: number) => string
}) {
  const width = 280
  const height = 120
  const { d, points } = useChartPath(values, width, height)
  const [hover, setHover] = useState<number | null>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setHover(Math.round(progress * (values.length - 1)))
  }

  return (
    <div
      className="relative h-[120px] w-full"
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
      onPointerDown={onMove}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {hover !== null && (
          <>
            <line
              x1={points[hover][0]}
              x2={points[hover][0]}
              y1={0}
              y2={height}
              stroke="var(--line-strong)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={points[hover][0]}
              cy={points[hover][1]}
              r={3.5}
              fill={color}
              stroke="var(--surface)"
              strokeWidth={1.5}
            />
          </>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-[8px] bg-tooltip-bg px-2 py-1 text-[11px] font-medium text-tooltip-fg shadow-raised"
          style={{ left: `${Math.min(Math.max((hover / (values.length - 1)) * 100, 15), 85)}%` }}
        >
          {formatValue(values[hover])}
        </div>
      )}
    </div>
  )
}

function CompareCard() {
  const errorRate = [2.9, 3.4, 3.05, 3.86, 3.52, 4.1, 3.82, 4.41]
  const latency = [-0.22, -0.58, -0.42, -0.91, -0.76, -1.08, -0.96, -1.15]
  const latestError = errorRate.at(-1) ?? 4.41
  const latestLatency = latency.at(-1) ?? -1.15

  return (
    <div className="min-h-[240px] rounded-card bg-surface p-3 shadow-hairline">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2">
            <span className="size-2 rounded-full bg-orange" />
            Error rate
          </span>
          <span className="block text-[17px] font-semibold tracking-[-0.01em] tabular-nums text-red">
            {formatPercent(latestError)}
          </span>
        </div>
        <div className="flex-1">
          <span className="flex items-center gap-1.5 text-[11.5px] text-ink-2">
            <span className="size-2 rounded-full bg-accent" />
            P95 latency
          </span>
          <span className="block text-[17px] font-semibold tracking-[-0.01em] tabular-nums text-green">
            {formatPercent(latestLatency)}
          </span>
        </div>
      </div>
      <div className="mt-2 overflow-hidden rounded-control bg-inset shadow-hairline">
        <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
          <span className="text-[11px] text-ink-3">Error rate trend</span>
          <span className="rounded-full bg-field px-2 py-0.5 text-[10.5px] font-medium text-ink-2">7 days</span>
        </div>
        <MiniChart values={errorRate} color="var(--orange)" formatValue={formatPercent} />
      </div>
    </div>
  )
}

function AllocationCard() {
  const segments = [
    { name: "API", label: "API layer", pct: 58, amount: "58%", cls: "bg-accent" },
    { name: "DB", label: "Database", pct: 27, cls: "bg-line-strong" },
    { name: "CDN", label: "CDN", pct: 15, cls: "bg-line" },
  ]
  const [selected, setSelected] = useState(segments[0].name)
  const active = segments.find((s) => s.name === selected) ?? segments[0]

  return (
    <div className="min-h-[240px] rounded-card bg-surface p-3 shadow-hairline">
      <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink">
        <span className="flex size-3.5 items-center justify-center rounded-full bg-accent text-[8px] font-bold text-white">
          $
        </span>
        Infra spend
      </span>
      <span className="mt-1 block text-[20px] font-semibold tracking-[-0.01em] text-ink tabular-nums">
        {active.amount ?? `${active.pct}%`}
      </span>
      <div
        className="mt-3 flex h-9 gap-0.5 overflow-hidden rounded-full bg-field p-0.5"
        role="group"
        aria-label="Spend segments"
      >
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            aria-pressed={selected === s.name}
            onClick={() => setSelected(s.name)}
            className={`relative h-full overflow-hidden rounded-full ${s.cls} transition-[opacity,box-shadow] duration-300 active:scale-[0.98]`}
            style={{
              width: `${s.pct}%`,
              opacity: selected === s.name ? 1 : 0.58,
              boxShadow: selected === s.name ? "inset 0 0 0 1px rgba(255,255,255,0.22)" : undefined,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {segments.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setSelected(s.name)}
            className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] transition-colors duration-150 ${
              selected === s.name ? "bg-field text-ink" : "text-ink-2 hover:bg-hover hover:text-ink"
            }`}
          >
            <span className={`size-1.5 rounded-full ${s.cls}`} />
            {s.name} <span className="tabular-nums">{s.pct}%</span>
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-16 rounded-control bg-inset px-2.5 py-2 shadow-hairline">
        <span className="block text-[11.5px] font-medium text-ink">{active.label}</span>
        <span className="mt-1 block text-[11px] leading-relaxed text-ink-3">
          Contribution across current monthly infrastructure cost. Segment selection swaps the inspected group in place.
        </span>
      </div>
    </div>
  )
}

const PAGES = [
  {
    key: "compare",
    prose: "Error rate on checkout climbed to 4.41% this week, tracking above P95 latency improvements.",
    Card: CompareCard,
    pill: "Should I open an incident?",
  },
  {
    key: "allocation",
    prose: "API compute is now 58% of infrastructure spend, up from 51% last quarter.",
    Card: AllocationCard,
    pill: "Where can we trim cost?",
  },
]

export function InsightCards() {
  const [page, setPage] = useState(0)
  const move = (direction: -1 | 1) => setPage((current) => (current + direction + PAGES.length) % PAGES.length)
  const { prose, Card, pill } = PAGES[page]

  return (
    <div className="min-h-[360px] w-full max-w-86">
      <div className="flex items-center justify-between">
        <span className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-ink">Insights</span>
          <span className="text-[13px] text-ink-3 tabular-nums">{PAGES.length}</span>
        </span>
        <span className="flex items-center gap-0.5">
          {(["M15 18l-6-6 6-6", "M9 6l6 6-6 6"] as const).map((d, i) => (
            <button
              key={i}
              type="button"
              aria-label={i === 0 ? "Previous insight" : "Next insight"}
              onClick={() => move(i === 0 ? -1 : 1)}
              className="flex size-6 items-center justify-center rounded-[6px] text-ink-3 transition-[background-color,color,transform] duration-100 hover:bg-hover hover:text-ink active:scale-[0.96]"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={d} />
              </svg>
            </button>
          ))}
        </span>
      </div>

      <div key={page} style={{ animation: "fade-up 250ms cubic-bezier(0.23,1,0.32,1) both" }}>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">{prose}</p>
        <div className="mt-2">
          <Card />
        </div>
        <button
          type="button"
          className="mt-2 rounded-full bg-surface px-3 py-1.5 text-left text-[12px] text-ink shadow-btn transition-colors duration-100 hover:bg-hover"
        >
          {pill}
        </button>
      </div>
    </div>
  )
}
