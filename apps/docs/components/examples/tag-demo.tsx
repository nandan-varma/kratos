import { Tag } from "@/components/preview/tag"

export function TagDemo() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag name="Engineering" tone="accent" />
      <Tag name="Design" tone="orange" />
      <Tag name="Growth" tone="green" />
    </div>
  )
}
