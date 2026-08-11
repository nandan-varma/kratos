import { Inbox } from "lucide-react"

import { Button } from "@/components/preview/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Nothing here yet</p>
        <p className="text-sm text-muted-foreground">
          Get started by creating your first item.
        </p>
      </div>
      <Button size="sm">Create item</Button>
    </div>
  )
}
