"use client"

import { Button } from "@/components/preview/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

export function UseCopyToClipboardDemo() {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <Button onClick={() => copyToClipboard("npx shadcn@latest add @kratos-orion/button")}>
      {isCopied ? "Copied!" : "Copy install command"}
    </Button>
  )
}
