"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"

/**
 * FILTER TABLE
 * Status chips directly filter a task table.
 */

type Status = "todo" | "progress" | "done"

const FILTERS: { key: "all" | Status; label: string; dot?: string; count: number }[] = [
  { key: "all", label: "All", count: 6 },
  { key: "todo", label: "To do", dot: "var(--orange)", count: 2 },
  { key: "progress", label: "In Progress", dot: "var(--accent)", count: 3 },
  { key: "done", label: "Completed", dot: "var(--green)", count: 1 },
]

const ROWS: { task: string; date: string; status: Status; owner: string }[] = [
  { task: "Wire billing webhook", date: "Oct 02", status: "todo", owner: "S. Kim" },
  { task: "Migrate auth to sessions", date: "Sep 28", status: "progress", owner: "A. Reyes" },
  { task: "Draft Q4 roadmap", date: "Oct 09", status: "todo", owner: "M. Diallo" },
  { task: "Fix flaky checkout tests", date: "Sep 30", status: "progress", owner: "J. Park" },
  { task: "Ship onboarding v2", date: "Sep 14", status: "done", owner: "L. Fontaine" },
  { task: "Audit CDN spend", date: "Oct 05", status: "progress", owner: "T. Nakamura" },
]

const PILLS: Record<Status, { label: string; className: string }> = {
  todo: { label: "To do", className: "bg-orange-tint text-orange" },
  progress: { label: "In Progress", className: "bg-accent-tint text-accent-ink" },
  done: { label: "Completed", className: "bg-green-tint text-green" },
}

export function FilterTable() {
  const [filter, setFilter] = React.useState<"all" | Status>("all")

  return (
    <div className="w-full max-w-105">
      <div className="-mx-1 mb-1 flex items-center gap-1 overflow-x-auto px-1 py-1" style={{ scrollbarWidth: "none" }}>
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <Badge key={f.key} active={active} dotColor={f.dot} count={f.count} onClick={() => setFilter(f.key)}>
              {f.label}
            </Badge>
          )
        })}
      </div>

      <div
        aria-label="Scrollable task table"
        className="overflow-x-auto rounded-card bg-surface shadow-card"
        role="region"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="min-w-[420px]">
          <div className="grid grid-cols-[1.3fr_0.6fr_0.95fr_0.9fr] border-b border-line px-3 py-2 text-[11.5px] font-medium text-ink-3">
            <span>Task</span>
            <span>Date</span>
            <span>Status</span>
            <span>Owner</span>
          </div>
          {ROWS.map((row) => {
            const shown = filter === "all" || row.status === filter
            const pill = PILLS[row.status]
            return (
              <div
                key={row.task}
                className="grid transition-[grid-template-rows,opacity] duration-300"
                style={{
                  gridTemplateRows: shown ? "1fr" : "0fr",
                  opacity: shown ? 1 : 0,
                  transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-[1.3fr_0.6fr_0.95fr_0.9fr] items-center border-b border-line px-3 py-2 text-[12px] transition-colors duration-100 last:border-0 hover:bg-hover">
                    <span className="truncate font-medium text-ink">{row.task}</span>
                    <span className="text-ink-2 tabular-nums">{row.date}</span>
                    <span>
                      <Badge
                        variant="status"
                        tone={row.status === "todo" ? "orange" : row.status === "progress" ? "accent" : "green"}
                      >
                        {pill.label}
                      </Badge>
                    </span>
                    <span className="truncate text-ink-2">{row.owner}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
