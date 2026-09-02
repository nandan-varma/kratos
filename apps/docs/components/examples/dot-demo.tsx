import { Dot } from "@/components/preview/dot"

export function DotDemo() {
  return (
    <div className="flex items-center gap-3">
      <Dot color="var(--green)" />
      <Dot color="var(--accent)" />
      <Dot color="var(--orange)" />
      <Dot color="var(--red)" />
      <Dot color="var(--ink-3)" />
    </div>
  )
}
