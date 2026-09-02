import "server-only"
import fs from "node:fs"
import path from "node:path"

type RegistryFile = { path: string; type: string }
type RegistryItem = {
  name: string
  type: string
  title: string
  description: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}
type RegistryManifest = { name: string; homepage?: string; items: RegistryItem[] }

export type Registry = RegistryManifest & { displayName: string; namespace: string; path: string }

const packagesDirectory = path.resolve(process.cwd(), "../..", "packages")

function displayName(slug: string) {
  return slug.replace(/(^|[-_])(\w)/g, (_, prefix: string, character: string) => `${prefix}${character.toUpperCase()}`)
}

function readManifest(slug: string): Registry {
  const registryPath = path.join(packagesDirectory, slug, "registry.json")
  const manifest = JSON.parse(fs.readFileSync(registryPath, "utf8")) as RegistryManifest
  return {
    ...manifest,
    displayName: displayName(manifest.name),
    namespace: `@kratos-${manifest.name}`,
    path: path.dirname(registryPath),
  }
}

/** The packages' registry manifests are the single source of truth for the UI. */
export function getRegistries(): Registry[] {
  return fs
    .readdirSync(packagesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(packagesDirectory, entry.name, "registry.json")))
    .map((entry) => readManifest(entry.name))
    .sort((left, right) => left.displayName.localeCompare(right.displayName))
}

export function getRegistry(slug: string) {
  return getRegistries().find((registry) => registry.name === slug)
}
export function getRegistryItem(registry: Registry, itemName: string) {
  return registry.items.find((item) => item.name === itemName)
}
export function getItemSource(registry: Registry, item: RegistryItem) {
  return item.files.map((file) => ({ ...file, content: fs.readFileSync(path.join(registry.path, file.path), "utf8") }))
}
export function registryItemUrl(registry: Registry, item: RegistryItem) {
  return `/r/${registry.name}/${item.name}.json`
}
