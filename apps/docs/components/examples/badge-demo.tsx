import { Badge } from "@/components/preview/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge active>All</Badge>
        <Badge active={false}>To Do</Badge>
        <Badge active={false}>In Progress</Badge>
        <Badge active={false}>Completed</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="status" tone="orange">
          To do
        </Badge>
        <Badge variant="status" tone="accent">
          In Progress
        </Badge>
        <Badge variant="status" tone="green">
          Completed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="chip" dotColor="var(--green)">
          Active
        </Badge>
        <Badge variant="chip" dotColor="var(--ink-3)">
          Draft
        </Badge>
      </div>
    </div>
  )
}
