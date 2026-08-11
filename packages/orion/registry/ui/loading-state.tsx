"use client"

import * as React from "react"

const RING_ORDER = [0, 1, 2, 5, 8, 7, 6, 3]

const PATTERNS = {
  drive: {
    duration: 650,
    delays: [90, 180, 270, 0, 90, 180, 90, 180, 270],
  },
  dots: {
    duration: 650,
    delays: [90, 180, 270, 0, 90, 180, 90, 180, 270],
  },
  orbit: {
    duration: 950,
    delays: RING_ORDER.reduce<number[]>((acc, cellIndex, order) => {
      acc[cellIndex] = order * 110
      return acc
    }, new Array(9).fill(0)),
  },
} as const

export type LoadingStateVariant = keyof typeof PATTERNS

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = (totalSeconds % 60).toFixed(1)
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

export function LoadingState({
  label = "Churning",
  variant = "drive",
}: {
  label?: string
  variant?: LoadingStateVariant
}) {
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100)
    return () => clearInterval(id)
  }, [])

  const pattern = PATTERNS[variant]
  const isOrbit = variant === "orbit"

  return (
    <div className="flex w-fit items-center gap-2.5">
      <span className="grid grid-cols-3 gap-[1.5px]">
        {pattern.delays.map((delay, i) =>
          isOrbit && i === 4 ? (
            <span
              key={i}
              className="size-1 rounded-[1px] bg-ink"
              style={{ opacity: 0.07 }}
            />
          ) : (
            <span
              key={i}
              className="size-1 rounded-[1px] bg-ink"
              style={{
                opacity: 0.15,
                animation: `pixel-on ${pattern.duration}ms ease-in-out ${delay}ms infinite`,
              }}
            />
          ),
        )}
      </span>
      <span
        className="bg-clip-text text-[13px] font-medium text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-text 1.4s linear infinite",
        }}
      >
        {label}
      </span>
      <span className="font-mono text-[12px] text-ink-3 tabular-nums">
        {formatElapsed(elapsed)}
      </span>
    </div>
  )
}
