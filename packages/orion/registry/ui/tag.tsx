/**
 * TAG
 * A tinted label chip matching the filter-table badge style.
 * Use semantic tones — orange for warnings, accent for info,
 * green for success, red for errors.
 *
 * Usage:
 *   <Tag name="To do" tone="orange" />
 *   <Tag name="Active" tone="accent" />
 *   <Tag name="Completed" tone="green" />
 *   <Tag name="Blocked" tone="red" />
 */

const STYLES = {
  orange: "bg-orange-tint text-orange",
  accent: "bg-accent-tint text-accent-ink",
  green: "bg-green-tint text-green",
  red: "bg-red-tint text-red",
} as const

export type TagTone = keyof typeof STYLES

export function Tag({ name, tone }: { name: string; tone: TagTone }) {
  return (
    <span className={`inline-flex h-5 items-center rounded-[5px] px-1.5 text-[11px] font-medium ${STYLES[tone]}`}>
      {name}
    </span>
  )
}
