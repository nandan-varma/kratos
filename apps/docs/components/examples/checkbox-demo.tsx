"use client"

import * as React from "react"
import { Checkbox } from "@/components/preview/checkbox"

export function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true)
  return (
    <div className="flex items-center gap-4">
      <Checkbox checked={checked} onChange={() => setChecked((c) => !c)} label="Enable notifications" />
      <Checkbox checked={false} mixed onChange={() => {}} label="Mixed state" />
    </div>
  )
}
