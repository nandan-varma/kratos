"use client";

import * as React from "react";
import {
  LoadingState,
  type LoadingStateVariant,
} from "@/components/preview/loading-state";
import { cn } from "@/lib/utils";

const VARIANTS: LoadingStateVariant[] = ["drive", "dots", "orbit"];

export function LoadingStateDemo() {
  const [variant, setVariant] = React.useState<LoadingStateVariant>("drive");

  return (
    <div className="relative flex w-full flex-col items-center gap-8">
      <LoadingState variant={variant} />
      <div className="flex rounded-full bg-field p-0.5">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11.5px] font-medium capitalize transition-[background-color,color,box-shadow] duration-150",
              variant === v
                ? "bg-surface text-ink shadow-btn"
                : "text-ink-3 hover:text-ink-2",
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
