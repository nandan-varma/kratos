import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { RegistryCatalog } from "@/components/registry-catalog"
import { RegistryShell } from "@/components/registry-shell"
import { getRegistries } from "@/lib/registries"

export default function Home() {
  const registries = getRegistries()
  const componentCount = registries.reduce((total, registry) => total + registry.items.length, 0)

  return (
    <RegistryShell>
      <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-fd-muted-foreground">
            self-hosted shadcn registries
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Install interfaces, not snippets.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
            Every component, install command, dependency, endpoint, and source file is read directly from its registry
            manifest. No separate dashboard catalog to maintain.
          </p>
        </div>
        <div className="mt-12 grid gap-4 border-y border-fd-border py-6 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold">{registries.length}</p>
            <p className="text-sm text-fd-muted-foreground">design systems</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{componentCount}</p>
            <p className="text-sm text-fd-muted-foreground">installable items</p>
          </div>
          <Link href="/docs" className="group flex items-center gap-2 self-center text-sm font-medium">
            Explore registry <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <section className="mt-12">
          <RegistryCatalog registries={registries} />
        </section>
      </main>
    </RegistryShell>
  )
}
