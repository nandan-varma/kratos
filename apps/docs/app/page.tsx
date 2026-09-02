import { HomeLayout } from "fumadocs-ui/layouts/home"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { baseOptions } from "@/lib/layout.shared"
import { registries } from "@/lib/registries"

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-24">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">kratos</h1>
          <p className="max-w-xl text-lg text-fd-muted-foreground">
            A personal, self-hosted shadcn registry. Every codenamed design system below is fully self-contained and
            installable with the <code className="rounded bg-fd-secondary px-1.5 py-0.5 text-sm">shadcn</code> CLI.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {registries.map((registry) => (
            <Link
              key={registry.slug}
              href={`/docs/${registry.slug}`}
              className="group flex items-center justify-between rounded-lg border p-5 transition-colors hover:bg-fd-accent"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{registry.name}</span>
                  <span className="rounded-full bg-fd-secondary px-2 py-0.5 text-xs text-fd-muted-foreground">
                    {registry.namespace}
                  </span>
                </div>
                <p className="text-sm text-fd-muted-foreground">{registry.description}</p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </main>
    </HomeLayout>
  )
}
