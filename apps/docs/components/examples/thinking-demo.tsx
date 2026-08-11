"use client"

import * as React from "react"
import { ThinkingState } from "@/components/preview/thinking"
import { cn } from "@/lib/utils"

const VARIANTS = ["Steps", "Reasoning", "Search", "Coding"]

export function ThinkingDemo() {
  const [variant, setVariant] = React.useState("Steps")

  return (
    <div className="relative flex w-full flex-col items-center gap-8">
      <ThinkingState variant={variant} />
      <div className="flex rounded-full bg-field p-0.5">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-[background-color,color,box-shadow] duration-150",
              variant === v ? "bg-surface text-ink shadow-btn" : "text-ink-3 hover:text-ink-2",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
