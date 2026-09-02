import Link from "next/link"
import type { ReactNode } from "react"
import { getRegistries } from "@/lib/registries"

export function RegistryShell({ children }: { children: ReactNode }) {
  const registries = getRegistries()
  return (
    <div className="min-h-screen bg-fd-background text-fd-foreground">
      <header className="sticky top-0 z-20 border-b border-fd-border bg-fd-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="font-semibold tracking-tight">
            kratos
          </Link>
          <nav className="flex items-center gap-1" aria-label="Registries">
            {registries.map((registry) => (
              <Link
                key={registry.name}
                href={`/docs/${registry.name}`}
                className="rounded-lg px-3 py-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
              >
                {registry.displayName}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}
