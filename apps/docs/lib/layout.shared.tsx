import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "kratos",
    },
    links: [
      {
        text: "GitHub",
        url: "https://github.com/nandan-varma/kratos",
        external: true,
      },
    ],
  }
}
