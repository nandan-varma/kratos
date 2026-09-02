"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-fd-border bg-fd-secondary/50 px-4 py-3 text-left font-mono text-xs text-fd-foreground transition-colors hover:bg-fd-accent"
      aria-label="Copy install command"
    >
      <code className="overflow-x-auto whitespace-nowrap">{command}</code>
      {copied ? (
        <Check className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <Copy className="size-4 shrink-0 text-fd-muted-foreground" />
      )}
    </button>
  )
}
