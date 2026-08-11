"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { Tag, type TagTone } from "@/components/ui/tag"

/**
 * RECORDS TABLE
 * A compact data grid: sortable columns, tag chips, connection status,
 * row selection, and a calculation footer.
 */

type Activity = "active" | "quiet" | "dormant" | "none"
type SortKey = "name" | "last" | "activity"

const ACTIVITY: Record<Activity, { label: string; color: string; rank: number }> = {
  active: { label: "Very active", color: "var(--green)", rank: 3 },
  quiet: { label: "Quiet", color: "var(--orange)", rank: 2 },
  dormant: { label: "Dormant", color: "var(--red)", rank: 1 },
  none: { label: "No activity", color: "var(--ink-3)", rank: 0 },
}

const TAG_TONES: Record<string, TagTone> = {
  Engineering: "accent",
  Design: "orange",
  Product: "green",
  Growth: "orange",
  Support: "red",
  Remote: "accent",
  Contractor: "orange",
}

type Row = {
  id: string
  name: string
  role: string
  tags: string[]
  last: string
  activity: Activity
  profile?: string
}

const ROWS: Row[] = [
  {
    id: "s-kim",
    name: "Sena Kim",
    role: "Staff Engineer",
    tags: ["Engineering", "Remote"],
    last: "2 hours ago",
    activity: "active",
    profile: "sena-kim",
  },
  {
    id: "a-reyes",
    name: "Alex Reyes",
    role: "Product Designer",
    tags: ["Design"],
    last: "yesterday",
    activity: "active",
    profile: "alex-reyes",
  },
  {
    id: "j-park",
    name: "Jae Park",
    role: "Engineering Manager",
    tags: ["Engineering", "Product"],
    last: "3 days ago",
    activity: "quiet",
    profile: "jae-park",
  },
  {
    id: "m-diallo",
    name: "Mariam Diallo",
    role: "Growth Lead",
    tags: ["Growth"],
    last: "2 weeks ago",
    activity: "dormant",
  },
  {
    id: "t-nakamura",
    name: "Tomo Nakamura",
    role: "Support Engineer",
    tags: ["Support", "Contractor"],
    last: "1 month ago",
    activity: "dormant",
    profile: "tomo-nakamura",
  },
  {
    id: "l-fontaine",
    name: "Léa Fontaine",
    role: "Frontend Engineer",
    tags: ["Engineering", "Remote"],
    last: "no activity",
    activity: "none",
  },
]

function HeaderCell({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey?: SortKey
  sort: { key: SortKey; dir: 1 | -1 }
  onSort: (key: SortKey) => void
}) {
  return (
    <th className="border-b border-line px-3 py-2 text-left">
      <button
        type="button"
        onClick={sortKey ? () => onSort(sortKey) : undefined}
        className="flex items-center gap-1 text-[11.5px] font-medium text-ink-3 transition-colors duration-100 hover:text-ink-2"
      >
        {label}
        {sortKey && (
          <span
            className={`transition-opacity duration-150 ${sort.key === sortKey ? "opacity-100" : "opacity-0"}`}
            style={{ transform: sort.key === sortKey && sort.dir === -1 ? "rotate(180deg)" : undefined }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </span>
        )}
      </button>
    </th>
  )
}

export function RecordsTable() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [sort, setSort] = React.useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 })

  const visibleRows = React.useMemo(() => {
    return [...ROWS].sort((a, b) => {
      const value =
        sort.key === "name"
          ? a.name.localeCompare(b.name)
          : sort.key === "last"
            ? a.last.localeCompare(b.last)
            : ACTIVITY[a.activity].rank - ACTIVITY[b.activity].rank
      return value * sort.dir
    })
  }, [sort])

  const allSelected = visibleRows.length > 0 && visibleRows.every((r) => selected.has(r.id))
  const partiallySelected = !allSelected && visibleRows.some((r) => selected.has(r.id))

  const toggleSort = (key: SortKey) =>
    setSort((current) => (current.key === key ? { key, dir: (current.dir * -1) as 1 | -1 } : { key, dir: 1 }))
  const toggleRow = (id: string) =>
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const toggleAll = () =>
    setSelected((current) => {
      const next = new Set(current)
      if (allSelected)
        visibleRows.forEach((r) => {
          next.delete(r.id)
        })
      else
        visibleRows.forEach((r) => {
          next.add(r.id)
        })
      return next
    })

  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-card bg-surface shadow-card">
      <div className="max-h-[360px] overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr>
              <th className="border-b border-line px-3 py-2">
                <span className="flex items-center gap-2.5">
                  <Checkbox
                    checked={allSelected}
                    mixed={partiallySelected}
                    onChangeAction={toggleAll}
                    label="Select all rows"
                  />
                  <span className="text-[11.5px] font-medium text-ink-3">Name</span>
                </span>
              </th>
              <HeaderCell label="Tags" sort={sort} onSort={toggleSort} />
              <HeaderCell label="Last active" sortKey="last" sort={sort} onSort={toggleSort} />
              <HeaderCell label="Activity" sortKey="activity" sort={sort} onSort={toggleSort} />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const rowSelected = selected.has(row.id)
              const activity = ACTIVITY[row.activity]
              return (
                <tr
                  key={row.id}
                  className={`transition-colors duration-100 hover:bg-hover ${rowSelected ? "bg-accent-tint/40" : ""}`}
                >
                  <td className="border-b border-line px-3 py-2">
                    <span className="flex items-center gap-2.5">
                      <Checkbox
                        checked={rowSelected}
                        onChangeAction={() => toggleRow(row.id)}
                        label={`Select ${row.name}`}
                      />
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-field text-[11px] font-medium text-ink-2">
                        {row.name.slice(0, 1)}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-[12.5px] font-medium text-ink">{row.name}</span>
                        <span className="truncate text-[11px] text-ink-3">{row.role}</span>
                      </span>
                    </span>
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {row.tags.map((tag) => (
                        <Tag key={tag} name={tag} tone={TAG_TONES[tag] ?? "accent"} />
                      ))}
                    </div>
                  </td>
                  <td
                    className={`border-b border-line px-3 py-2 text-[12px] ${row.last === "no activity" ? "text-ink-3" : "text-ink-2"}`}
                  >
                    {row.last}
                  </td>
                  <td className="border-b border-line px-3 py-2">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
                      <span className="size-1.5 rounded-full" style={{ background: activity.color }} />
                      {activity.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-line bg-inset text-[11.5px]">
              <td className="px-3 py-2 font-medium text-ink-2">
                <span className="font-mono text-ink">{ROWS.length}</span> people
              </td>
              <td className="px-3 py-2 text-ink-3" colSpan={2}>
                {selected.size} selected
              </td>
              <td className="px-3 py-2 text-ink-3">{ROWS.filter((r) => r.profile).length} profiles linked</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
