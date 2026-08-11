import { Meter } from "@/components/preview/meter";

export function MeterDemo() {
  return (
    <div className="flex items-center gap-4">
      <Meter signal={3} tone="var(--green)" />
      <Meter signal={2} tone="var(--orange)" />
      <Meter signal={0} tone="var(--ink-3)" />
    </div>
  );
}
