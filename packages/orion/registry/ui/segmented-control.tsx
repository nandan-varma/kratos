"use client"

import * as React from "react"

/**
 * SEGMENTED CONTROL
 * A pill-style tab switcher with a sliding highlight that tracks the
 * active segment. Pass segments as an array of `{ value, label }` or
 * `{ value, node }` for custom content.
 *
 * Usage:
 *   <SegmentedControl
 *     segments={[{ value: "row", label: "Row" }, { value: "col", label: "Col" }]}
 *     value={seg}
 *     onChange={setSeg}
 *   />
 */

export type Segment<V extends string> = {
  value: V
  label?: string
  node?: React.ReactNode
}

export function SegmentedControl<V extends string>({
  segments,
  value,
  onChangeAction,
  className,
}: {
  segments: readonly Segment<V>[]
  value: V
  onChangeAction: (value: V) => void
  className?: string
}) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [box, setBox] = React.useState<{ left: number; width: number } | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const container = containerRef.current
    const target = refs.current[value]
    if (!(container && target)) return
    const cRect = container.getBoundingClientRect()
    const tRect = target.getBoundingClientRect()
    setBox({ left: tRect.left - cRect.left, width: tRect.width })
  }, [value])

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Segmented control"
      className={`relative grid rounded-control bg-field p-0.5 ${className ?? ""}`}
      style={{
        gridTemplateColumns: `repeat(${segments.length}, 1fr)`,
      }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 rounded-[6px] bg-surface shadow-btn transition-[left,width,transform] duration-300"
        style={{
          left: box?.left ?? 0,
          width: box?.width ?? 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />
      {segments.map((seg) => (
        <button
          key={seg.value}
          ref={(el) => {
            refs.current[seg.value] = el
          }}
          type="button"
          aria-pressed={seg.value === value}
          onClick={() => onChangeAction(seg.value)}
          className={`relative z-10 flex h-6 items-center justify-center px-2.5 transition-colors duration-200 ${
            seg.value === value ? "text-accent" : "text-ink-3 hover:text-ink-2"
          }`}
        >
          {seg.node ?? seg.label}
        </button>
      ))}
    </div>
  )
}
