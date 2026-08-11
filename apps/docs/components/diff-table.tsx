"use client"

import { useStagedSequence } from "@/hooks/use-staged-sequence"

/**
 * DIFF TABLE
 * Proposed row-level changes sweep through a table once: removed rows
 * tint red and strike through, then an added row settles in green.
 */

type Row = {
  name: string
  status: string
  owner: string
  change: "removed" | "added" | null
}

const ROWS: Row[] = [
  { name: "onboarding-flow", status: "Draft", owner: "s.kim", change: "removed" },
  { name: "legacy-checkout", status: "Draft", owner: "a.reyes", change: "removed" },
  { name: "search-index", status: "Active", owner: "s.kim", change: null },
]

const ADDED_ROW: Row = { name: "checkout-v2", status: "Active", owner: "a.reyes", change: "added" }

const STATUS_DOT: Record<string, string> = {
  Draft: "bg-ink-3",
  Active: "bg-accent",
}

export function DiffTable() {
  const stage = useStagedSequence([800, 1000, 1000])
  const tinted = stage >= 2
  const added = stage >= 3

  return (
    <div className="w-full max-w-95">
      <div className="relative overflow-hidden rounded-card bg-surface shadow-card">
        <div className="primitive-card-bar flex items-center justify-between border-b border-line">
          <span className="text-[12.5px] font-medium text-ink">Proposed workspace cleanup</span>
        </div>

        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[26%]" />
            <col className="w-[34%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line">
              {["Repository", "Status", "Owner"].map((h) => (
                <th key={h} className="primitive-table-cell text-[12px] font-medium text-ink-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const out = row.change === "removed" && tinted
              return (
                <tr
                  key={row.name}
                  className="border-b border-line transition-colors duration-400 last:border-0 hover:bg-hover"
                  style={{ background: out ? "var(--red-tint)" : undefined }}
                >
                  <td
                    className="primitive-table-cell font-mono text-[12.5px] font-medium transition-colors duration-400"
                    style={{
                      color: out ? "var(--red)" : "var(--ink)",
                      textDecorationLine: out ? "line-through" : "none",
                      textDecorationColor: "color-mix(in srgb, var(--red) 50%, transparent)",
                    }}
                  >
                    {row.name}
                  </td>
                  <td className="primitive-table-cell">
                    <span
                      className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-inset px-2 text-[11.5px] font-medium shadow-hairline transition-opacity duration-400"
                      style={{ opacity: out ? 0.55 : 1 }}
                    >
                      <span className={`size-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                      <span className="text-ink-2">{row.status}</span>
                    </span>
                  </td>
                  <td
                    className="primitive-table-cell text-[12.5px] whitespace-nowrap transition-colors duration-400"
                    style={{ color: out ? "var(--red)" : "var(--ink-2)" }}
                  >
                    {row.owner}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={3} className="p-0">
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-400"
                  style={{
                    gridTemplateRows: added ? "1fr" : "0fr",
                    opacity: added ? 1 : 0,
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                >
                  <div className="overflow-hidden" style={{ background: "var(--green-tint)" }}>
                    <div className="grid grid-cols-[40%_26%_34%] items-center border-t border-line">
                      <span className="primitive-table-cell font-mono text-[12.5px] font-medium text-green">
                        {ADDED_ROW.name}
                      </span>
                      <span className="primitive-table-cell">
                        <span className="inline-flex h-5.5 items-center gap-1.5 rounded-full bg-surface px-2 text-[11.5px] font-medium shadow-hairline">
                          <span className="size-1.5 rounded-full bg-green" />
                          <span className="text-ink-2">{ADDED_ROW.status}</span>
                        </span>
                      </span>
                      <span className="primitive-table-cell text-[12.5px] text-green">{ADDED_ROW.owner}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
