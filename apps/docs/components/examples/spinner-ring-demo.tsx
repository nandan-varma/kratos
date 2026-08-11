import { SpinnerRing } from "@/components/preview/spinner-ring"

export function SpinnerRingDemo() {
  return (
    <div className="flex items-center gap-4">
      <SpinnerRing active>2</SpinnerRing>
      <SpinnerRing>4</SpinnerRing>
    </div>
  )
}
