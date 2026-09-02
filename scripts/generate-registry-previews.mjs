import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { dirname, extname, relative, resolve, sep } from "node:path"
import ts from "typescript"

const root = resolve(import.meta.dirname, "..")
const packagesDirectory = resolve(root, "packages")
const generatedDirectory = resolve(root, "apps/docs/.registry-preview-sources")
const output = resolve(root, "apps/docs/components/generated/registry-previews.tsx")

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

function importPath(from, to) {
  const path = relative(from, to).split(sep).join("/").replace(/\.(ts|tsx)$/, "")
  return path.startsWith(".") ? path : `./${path}`
}

function sourceForAlias(directory, alias) {
  for (const extension of [".tsx", ".ts"]) {
    const source = resolve(directory, "registry", `${alias}${extension}`)
    if (existsSync(source)) return source
  }
  throw new Error(`Unable to resolve registry import @/registry/${alias}`)
}

function exportedComponentName(source, file) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.TSX)
  const localComponents = new Set()
  const exportedComponents = []

  for (const statement of sourceFile.statements) {
    const isExported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      localComponents.add(statement.name.text)
      if (isExported) exportedComponents.push(statement.name.text)
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) {
          localComponents.add(declaration.name.text)
          if (isExported) exportedComponents.push(declaration.name.text)
        }
      }
    }
    if (ts.isExportDeclaration(statement) && !statement.moduleSpecifier && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        exportedComponents.push((element.propertyName ?? element.name).text)
      }
    }
  }

  for (const component of exportedComponents) {
    if (localComponents.has(component)) return component
  }

  throw new Error(`Unable to find a locally defined component export in ${file}`)
}

function copyPreviewSources(packageDirectory, registryName) {
  const sourceDirectory = resolve(packageDirectory, "registry")
  const destinationDirectory = resolve(generatedDirectory, registryName, "registry")
  cpSync(sourceDirectory, destinationDirectory, { recursive: true })

  for (const source of walk(sourceDirectory).filter((path) => [".ts", ".tsx"].includes(extname(path)))) {
    const destination = resolve(destinationDirectory, relative(sourceDirectory, source))
    const contents = readFileSync(source, "utf8").replace(/(["'])@\/registry\/([^"']+)\1/g, (_, quote, alias) => {
      const aliasedSource = sourceForAlias(packageDirectory, alias)
      const aliasedDestination = resolve(destinationDirectory, relative(sourceDirectory, aliasedSource))
      return `${quote}${importPath(dirname(destination), aliasedDestination)}${quote}`
    })
    writeFileSync(destination, contents)
  }
}

rmSync(generatedDirectory, { recursive: true, force: true })
const entries = readdirSync(packagesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(resolve(packagesDirectory, entry.name, "registry.json")))
  .flatMap((entry) => {
    const packageDirectory = resolve(packagesDirectory, entry.name)
    const manifest = JSON.parse(readFileSync(resolve(packageDirectory, "registry.json"), "utf8"))
    copyPreviewSources(packageDirectory, manifest.name)
    return manifest.items.flatMap((item) => {
      if (!["registry:ui", "registry:block"].includes(item.type)) return []
      if (item.dependencies?.includes("drawably")) return []
      const file = item.files?.[0]?.path
      if (!file) throw new Error(`Renderable registry item ${manifest.name}/${item.name} must declare its implementation file`)
      const source = resolve(packageDirectory, file)
      const exportName = exportedComponentName(readFileSync(source, "utf8"), source)
      return [
        {
          key: `${manifest.name}/${item.name}`,
          exportName,
          source: resolve(generatedDirectory, manifest.name, file),
          preview: item.preview ?? {},
        },
      ]
    })
  })

const imports = entries.map((entry, index) => `import { ${entry.exportName} as Preview${index} } from "${importPath(dirname(output), entry.source)}"`).join("\n")
const registry = entries
  .map(
    (entry, index) =>
      `  "${entry.key}": { Component: Preview${index} as unknown as ComponentType<Record<string, unknown>>, ...${JSON.stringify(entry.preview)} },`,
  )
  .join("\n")

mkdirSync(dirname(output), { recursive: true })
writeFileSync(output, `// Generated from package registry manifests and source exports. Do not edit.\n\n"use client"\n\nimport { useState } from "react"\nimport type { ComponentType, ReactNode } from "react"\n${imports}\n\ntype PreviewHandler = { action: "set" | "toggle"; key: string }\ntype PreviewDefinition = {\n  Component: ComponentType<Record<string, unknown>>\n  props?: Record<string, unknown>\n  state?: Record<string, unknown>\n  children?: ReactNode\n  handlers?: Record<string, PreviewHandler>\n}\n\nconst previews: Record<string, PreviewDefinition> = {\n${registry}\n}\n\nexport function RegistryComponentPreview({ registry, item }: { registry: string; item: string }) {\n  const definition = previews[registry + "/" + item]\n  const [state, setState] = useState<Record<string, unknown>>(() => definition?.state ?? {})\n  if (!definition) return null\n\n  const Preview = definition.Component\n  const handlers = Object.fromEntries(\n    Object.entries(definition.handlers ?? {}).map(([name, handler]) => [\n      name,\n      (value: unknown) =>\n        setState((current) => ({\n          ...current,\n          [handler.key]: handler.action === "toggle" ? !current[handler.key] : value,\n        })),\n    ]),\n  )\n  return <Preview {...definition.props} {...state} {...handlers}>{definition.children}</Preview>\n}\n`)
