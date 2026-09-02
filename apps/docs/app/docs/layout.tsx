import { RegistryShell } from "@/components/registry-shell"

export default function Layout({ children }: LayoutProps<"/docs">) {
  return <RegistryShell>{children}</RegistryShell>
}
