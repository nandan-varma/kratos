import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-[12.5px] font-medium transition-[background-color,color,transform] duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-ink text-canvas shadow-btn hover:opacity-90",
        outline: "border border-line-strong bg-surface text-ink shadow-btn hover:bg-hover",
        ghost: "text-ink-2 hover:bg-hover hover:text-ink",
        plain: "text-ink-3 hover:text-ink-2",
      },
      size: {
        default: "h-7 px-3 has-[>svg]:px-2.5",
        sm: "h-6 px-2 has-[>svg]:px-1.5 text-[12px]",
        icon: "size-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }
