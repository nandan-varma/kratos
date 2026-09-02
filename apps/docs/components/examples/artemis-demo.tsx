"use client"

import {
  DrawablyArrow,
  DrawablyBadge,
  DrawablyButton,
  DrawablyCard,
  DrawablyCheckbox,
  DrawablyCircle,
  DrawablyDivider,
  DrawablyHighlight,
  DrawablyInput,
  DrawablyList,
  DrawablyRadio,
  DrawablySelect,
  DrawablyTextarea,
  DrawablyToggle,
  DrawablyUnderline,
} from "drawably/react"
import { useRef } from "react"

export function ArtemisDemo() {
  const from = useRef<HTMLSpanElement>(null)
  const to = useRef<HTMLSpanElement>(null)

  return (
    <div className="grid gap-8 text-sm text-fd-foreground sm:grid-cols-2">
      <DrawablyCard className="space-y-5 p-6" stroke="#2724d1" fill="#ede9fe">
        <div className="space-y-2">
          <p className="font-medium">Actions</p>
          <div className="flex flex-wrap gap-3">
            <DrawablyButton variant="solid">Publish</DrawablyButton>
            <DrawablyButton tone="neutral">Save draft</DrawablyButton>
            <DrawablyButton tone="danger">Delete</DrawablyButton>
          </div>
        </div>
        <DrawablyDivider />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2" htmlFor="artemis-ready">
            <DrawablyCheckbox id="artemis-ready" defaultChecked /> Ready
          </label>
          <label className="flex items-center gap-2" htmlFor="artemis-ink">
            <DrawablyRadio id="artemis-ink" name="artemis-ink" defaultChecked /> Ink
          </label>
          <label className="flex items-center gap-2" htmlFor="artemis-share">
            <DrawablyToggle id="artemis-share" /> Share
          </label>
        </div>
        <DrawablyBadge variant="scribble">new sketch</DrawablyBadge>
      </DrawablyCard>

      <DrawablyCard className="space-y-4 p-6" stroke="#c2410c" fill="#ffedd5">
        <p className="font-medium">Native fields</p>
        <DrawablyInput placeholder="Project name" />
        <DrawablyTextarea rows={3} placeholder="Leave a note…" />
        <DrawablySelect defaultValue="Pencil">
          <option>Pen</option>
          <option>Pencil</option>
          <option>Brush</option>
        </DrawablySelect>
      </DrawablyCard>

      <DrawablyCard className="space-y-4 p-6" stroke="#047857" fill="#d1fae5">
        <p className="font-medium">List and annotation</p>
        <DrawablyList marker="check" className="space-y-2 pl-6">
          <li>Real semantic HTML controls</li>
          <li>Fresh seeded sketch on every mount</li>
          <li>Motion respects reduced-motion</li>
        </DrawablyList>
        <p className="leading-7">
          Keep it <DrawablyUnderline>human</DrawablyUnderline>, <DrawablyHighlight>deliberate</DrawablyHighlight>, and{" "}
          <DrawablyCircle>playful</DrawablyCircle>.
        </p>
      </DrawablyCard>

      <DrawablyCard className="relative flex min-h-48 items-center justify-between p-6" stroke="#7e22ce" fill="#f3e8ff">
        <span ref={from} className="rounded bg-white/70 px-2 py-1 font-medium">
          idea
        </span>
        <span ref={to} className="rounded bg-white/70 px-2 py-1 font-medium">
          shipped
        </span>
        <DrawablyArrow from={from} to={to} stroke="#7e22ce" />
      </DrawablyCard>
    </div>
  )
}
