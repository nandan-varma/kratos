export type Registry = {
  name: string
  slug: string
  namespace: string
  description: string
}

/**
 * The public registries served by this site. Add a codename here when its
 * package and docs are ready to publish; consumers of the catalog update
 * automatically.
 */
export const registries: readonly Registry[] = [
  {
    name: "Artemis",
    slug: "artemis",
    namespace: "@kratos-artemis",
    description: "Hand-drawn, zero-dependency UI controls powered by Drawably's real HTML elements and SVG sketches.",
  },
  {
    name: "Orion",
    slug: "orion",
    namespace: "@kratos-orion",
    description: "A dense, precise, AI-native interface language with components, hooks, and blocks.",
  },
]
