import { ArrowUpRight, Box } from "lucide-react"
import Link from "next/link"
import type { Registry } from "@/lib/registries"

export function RegistryCatalog({ registries }: { registries: Registry[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {registries.map((registry) => (
        <Link
          key={registry.name}
          href={`/docs/${registry.name}`}
          className="group rounded-2xl border border-fd-border bg-fd-card p-6 transition-all hover:-translate-y-0.5 hover:border-fd-primary/50 hover:shadow-lg"
        >
          <div className="mb-8 flex items-start justify-between">
            <span className="rounded-xl bg-fd-secondary p-3">
              <Box className="size-5" />
            </span>
            <ArrowUpRight className="size-5 text-fd-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <p className="text-lg font-semibold">{registry.displayName}</p>
          <p className="mt-1 font-mono text-xs text-fd-muted-foreground">{registry.namespace}</p>
          <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">{registry.items.length} installable items</p>
        </Link>
      ))}
    </div>
  )
}
