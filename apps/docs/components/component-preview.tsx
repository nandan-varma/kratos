import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ComponentPreview({
  code,
  children,
  compact = false,
}: {
  code: string;
  children: ReactNode;
  /** Use for small, fixed-width "floating" components (cards, popovers) so
   * they don't drown in dead space inside the full-width preview canvas. */
  compact?: boolean;
}) {
  return (
    <Tabs items={["Preview", "Code"]}>
      <Tab value="Preview">
        <div
          className={cn(
            "relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-card bg-canvas p-10 shadow-hairline",
            compact && "mx-auto max-w-md",
          )}
        >
          {children}
        </div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang="tsx" code={code} />
      </Tab>
    </Tabs>
  );
}
