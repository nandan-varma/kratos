"use client"

import { Code2, Layers3, Palette, PanelTop } from "lucide-react"
import { DrawablyComponentPreview } from "@/components/drawably-component-preview"
import type { RegistryItem } from "@/lib/registries"

export function RegistryItemPreview({ item, compact = false }: { item: RegistryItem; compact?: boolean }) {
  if (item.dependencies?.includes("drawably")) return <DrawablyComponentPreview name={item.name} compact={compact} />
  if (item.type === "registry:theme") return <ThemePreview />
  if (item.type === "registry:hook" || item.type === "registry:lib") return <CodePreview name={item.name} />
  if (item.type === "registry:block") return <BlockPreview title={item.title} compact={compact} />
  return <PrimitivePreview title={item.title} />
}

function ThemePreview() {
  return (
    <div className="flex gap-1.5">
      <span className="size-6 rounded-full bg-slate-900" />
      <span className="size-6 rounded-full bg-slate-500" />
      <span className="size-6 rounded-full bg-blue-500" />
      <span className="size-6 rounded-full bg-emerald-500" />
      <Palette className="ml-2 size-5 text-fd-muted-foreground" />
    </div>
  )
}

function CodePreview({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-fd-muted-foreground">
      <Code2 className="size-4" />
      <code>{name}()</code>
    </div>
  )
}

function BlockPreview({ title, compact }: { title: string; compact: boolean }) {
  return (
    <div className="w-full rounded-lg border border-fd-border bg-fd-background p-3">
      <div className="flex items-center gap-2">
        <PanelTop className="size-4 text-fd-muted-foreground" />
        <span className="text-xs font-medium">{title}</span>
      </div>
      {!compact && (
        <>
          <div className="mt-3 h-2 w-2/3 rounded bg-fd-secondary" />
          <div className="mt-2 h-2 w-full rounded bg-fd-secondary" />
        </>
      )}
    </div>
  )
}

function PrimitivePreview({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-xs font-medium">
        {title.replace(/^.*?\s/, "")}
      </span>
      <Layers3 className="size-4 text-fd-muted-foreground" />
    </div>
  )
}
