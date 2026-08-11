import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import type { ReactNode } from "react";

export function ComponentPreview({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  return (
    <Tabs items={["Preview", "Code"]}>
      <Tab value="Preview">
        <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-card bg-canvas p-10 shadow-hairline">
          {children}
        </div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang="tsx" code={code} />
      </Tab>
    </Tabs>
  );
}
