"use client"

import * as React from "react"
import { SegmentedControl } from "@/components/preview/segmented-control"

export function SegmentedControlDemo() {
  const [value, setValue] = React.useState("day")

  return (
    <SegmentedControl
      segments={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
      value={value}
      onChangeAction={setValue}
    />
  )
}
