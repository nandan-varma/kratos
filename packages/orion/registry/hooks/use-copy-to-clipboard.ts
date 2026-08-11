"use client"

import * as React from "react"

export function useCopyToClipboard({
  timeout = 2000,
}: { timeout?: number } = {}) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = React.useCallback(
    async (value: string) => {
      if (!navigator?.clipboard || !value) return

      await navigator.clipboard.writeText(value)
      setIsCopied(true)

      setTimeout(() => setIsCopied(false), timeout)
    },
    [timeout]
  )

  return { isCopied, copyToClipboard }
}
