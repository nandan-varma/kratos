"use client"

import * as React from "react"

/**
 * Advances through a list of stage delays (ms) one at a time, stopping
 * at the last stage. Returns the current stage index.
 */
export function useStagedSequence(delays: number[]) {
  const [stage, setStage] = React.useState(0)

  React.useEffect(() => {
    if (stage >= delays.length - 1) return
    const t = setTimeout(() => setStage((s) => s + 1), delays[stage])
    return () => clearTimeout(t)
  }, [stage, delays])

  return stage
}
