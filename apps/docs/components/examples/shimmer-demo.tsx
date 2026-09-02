import { Shimmer } from "@/components/preview/shimmer"

export function ShimmerDemo() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Shimmer>Thinking</Shimmer>
      <Shimmer variant="accent">Connecting</Shimmer>
    </div>
  )
}
