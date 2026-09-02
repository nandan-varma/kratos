import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CopyCommand } from "@/components/copy-command"
import { RegistryCatalog } from "@/components/registry-catalog"
import { RegistryItemPreview } from "@/components/registry-item-preview"
import { getItemSource, getRegistries, getRegistry, getRegistryItem, registryItemUrl } from "@/lib/registries"

export function generateStaticParams() {
  return getRegistries().flatMap((registry) => [
    { slug: [registry.name] },
    ...registry.items.map((item) => ({ slug: [registry.name, item.name] })),
  ])
}

export default async function Page({ params }: PageProps<"/docs/[[...slug]]">) {
  const { slug = [] } = await params
  if (slug.length === 0) return <Overview />
  const registry = getRegistry(slug[0])
  if (!registry) notFound()
  const itemName = slug.length === 3 && ["components", "blocks", "hooks"].includes(slug[1]) ? slug[2] : slug[1]
  if (!itemName) return <RegistryPage registry={registry} />
  const item = getRegistryItem(registry, itemName)
  if (!item) notFound()
  return <ItemPage registry={registry} item={item} />
}

function Overview() {
  const registries = getRegistries()
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-fd-muted-foreground">registry dashboard</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Everything available to install.</h1>
      <p className="mt-4 max-w-2xl text-fd-muted-foreground">
        This catalog is generated from registry manifests at build time.
      </p>
      <section className="mt-10">
        <RegistryCatalog registries={registries} />
      </section>
    </main>
  )
}

function RegistryPage({ registry }: { registry: NonNullable<ReturnType<typeof getRegistry>> }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <Link href="/docs" className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
        ← All registries
      </Link>
      <div className="mt-6">
        <p className="font-mono text-xs text-fd-muted-foreground">{registry.namespace}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{registry.displayName}</h1>
        <p className="mt-3 max-w-2xl text-fd-muted-foreground">
          {registry.items.length} components, derived directly from <code>packages/{registry.name}/registry.json</code>.
        </p>
      </div>
      <section className="mt-8 max-w-2xl">
        <CopyCommand command={`pnpm dlx shadcn@latest add ${registry.namespace}/${registry.items[0]?.name}`} />
      </section>
      <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {registry.items.map((item) => (
          <Link
            key={item.name}
            href={`/docs/${registry.name}/${item.name}`}
            className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-colors hover:bg-fd-accent"
          >
            <p className="font-medium">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">{item.description}</p>
            <p className="mt-4 font-mono text-xs text-fd-muted-foreground">{item.type.replace("registry:", "")}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

function ItemPage({
  registry,
  item,
}: {
  registry: NonNullable<ReturnType<typeof getRegistry>>
  item: NonNullable<ReturnType<typeof getRegistryItem>>
}) {
  const source = getItemSource(registry, item)
  const command = `pnpm dlx shadcn@latest add ${registry.namespace}/${item.name}`
  const dependencies = [...(item.dependencies ?? []), ...(item.registryDependencies ?? [])]
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12">
      <Link href={`/docs/${registry.name}`} className="text-sm text-fd-muted-foreground hover:text-fd-foreground">
        ← {registry.displayName}
      </Link>
      <p className="mt-8 font-mono text-xs text-fd-muted-foreground">{item.type}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{item.title}</h1>
      <p className="mt-4 max-w-2xl text-fd-muted-foreground">{item.description}</p>
      <section className="mt-10 rounded-2xl border border-fd-border bg-fd-card p-6">
        <p className="mb-5 text-sm font-medium">Rendered example</p>
        <div className="registry-preview-frame">
          <RegistryItemPreview registry={registry.name} item={item} />
        </div>
      </section>
      <section className="mt-10">
        <p className="mb-3 text-sm font-medium">Install</p>
        <CopyCommand command={command} />
      </section>
      {dependencies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {dependencies.map((dependency) => (
            <span
              key={dependency}
              className="rounded-full bg-fd-secondary px-2.5 py-1 font-mono text-fd-muted-foreground"
            >
              {dependency}
            </span>
          ))}
        </div>
      )}
      <a
        href={registryItemUrl(registry, item)}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
      >
        Open registry JSON <ExternalLink className="size-3.5" />
      </a>
      <section className="mt-12 space-y-6">
        {source.map((file) => (
          <div key={file.path}>
            <p className="mb-2 font-mono text-xs text-fd-muted-foreground">{file.path}</p>
            <pre className="overflow-x-auto rounded-xl border border-fd-border bg-fd-secondary/50 p-5 text-xs leading-6">
              <code>{file.content}</code>
            </pre>
          </div>
        ))}
      </section>
    </main>
  )
}
