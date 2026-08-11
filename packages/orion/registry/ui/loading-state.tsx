"use client"

import { useEffect, useState } from "react"

import { Shimmer } from "@/registry/ui/shimmer"

/**
 * Pixel-grid loader for long-running work.
 *
 * Variants:
 *   Drive — square cells, chevron wavefront driving right; the 650ms
 *           cycle is shorter than the sweep, so two fronts are always
 *           in flight
 *   Dots  — same wavefront, circular cells
 *   Orbit — a comet lapping the grid perimeter
 *
 * Paired with a shimmering label and a live elapsed timer in mono
 * tabular figures.
 */

const CHEVRON = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3)
  const c = i % 3
  return (c + Math.abs(r - 1)) * 90
})

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]
const ORBIT = Array.from({ length: 9 }, (_, i) => {
  const k = ORBIT_ORDER.indexOf(i)
  return k === -1 ? null : k * 110
})

const PATTERNS = {
  Drive: { delays: CHEVRON, duration: 650, round: false },
  Dots: { delays: CHEVRON, duration: 650, round: true },
  Orbit: { delays: ORBIT, duration: 950, round: false },
} satisfies Record<string, { delays: (number | null)[]; duration: number; round: boolean }>

export type LoadingStateVariant = keyof typeof PATTERNS

function useElapsed() {
  const [deciseconds, setDeciseconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setDeciseconds((d) => d + 1), 100)
    return () => clearInterval(id)
  }, [])

  const total = deciseconds / 10
  if (total < 60) return `${total.toFixed(1)}s`
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`
}

export function LoadingState({
  label = "Churning",
  variant = "Drive",
}: {
  label?: string
  variant?: LoadingStateVariant
}) {
  const elapsed = useElapsed()
  const { delays, duration, round } = PATTERNS[variant] ?? PATTERNS.Drive

  return (
    <div className="flex w-fit items-center gap-2.5">
      <span aria-hidden className="grid grid-cols-3 gap-[1.5px]">
        {delays.map((delay, i) => (
          <span
            key={i}
            className={`size-1 bg-ink ${round ? "rounded-full" : "rounded-[1px]"}`}
            style={{
              opacity: delay === null ? 0.07 : 0.15,
              animation: delay === null ? "none" : `pixel-on ${duration}ms ease-in-out ${delay}ms infinite`,
            }}
          />
        ))}
      </span>
      <Shimmer className="text-[13px]">{label}</Shimmer>
      <span className="font-mono text-[12px] text-ink-3 tabular-nums">{elapsed}</span>
    </div>
  )
}
