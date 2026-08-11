import { Tag } from "@/components/preview/tag";

export function TagDemo() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag name="Engineering" color="#3f78ff" />
      <Tag name="Design" color="#9a5cff" />
      <Tag name="Growth" color="#f09a2f" />
    </div>
  );
}
