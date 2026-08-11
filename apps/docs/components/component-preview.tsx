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
        <div className="flex min-h-[240px] items-center justify-center rounded-lg border p-10">
          {children}
        </div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang="tsx" code={code} />
      </Tab>
    </Tabs>
  );
}
