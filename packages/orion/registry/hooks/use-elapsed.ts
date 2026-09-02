"use client"

import * as React from "react"

/**
 * Ticks up in deciseconds and formats as "12.3s" / "1m 03.4s".
 */
export function useElapsed() {
  const [deciseconds, setDeciseconds] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setDeciseconds((d) => d + 1), 100)
    return () => clearInterval(id)
  }, [])

  const total = deciseconds / 10
  if (total < 60) return `${total.toFixed(1)}s`
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`
}
