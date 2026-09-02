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
      <DrawablyCard className="space-y-5 p-6" stroke="#818cf8">
        <div className="space-y-2">
          <p className="font-medium">Actions</p>
          <div className="flex flex-wrap gap-3">
            <DrawablyButton variant="solid" stroke="#ffffff" fill="#ffffff" paper="#18181b">
              Publish
            </DrawablyButton>
            <DrawablyButton tone="neutral" stroke="#a8a29e" fill="#a8a29e" paper="#f5f5f4">
              Save draft
            </DrawablyButton>
            <DrawablyButton tone="danger" stroke="#fb7185" fill="#fb7185" paper="#fff1f2">
              Delete
            </DrawablyButton>
          </div>
        </div>
        <DrawablyDivider stroke="#818cf8" />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2" htmlFor="artemis-ready">
            <DrawablyCheckbox id="artemis-ready" defaultChecked stroke="#a5b4fc" fill="#a5b4fc" /> Ready
          </label>
          <label className="flex items-center gap-2" htmlFor="artemis-ink">
            <DrawablyRadio id="artemis-ink" name="artemis-ink" defaultChecked stroke="#a5b4fc" fill="#a5b4fc" /> Ink
          </label>
          <label className="flex items-center gap-2" htmlFor="artemis-share">
            <DrawablyToggle id="artemis-share" stroke="#a5b4fc" fill="#a5b4fc" /> Share
          </label>
        </div>
        <DrawablyBadge variant="scribble" stroke="#c4b5fd" fill="#c4b5fd">
          new sketch
        </DrawablyBadge>
      </DrawablyCard>

      <DrawablyCard className="space-y-4 p-6" stroke="#fb923c">
        <p className="font-medium">Native fields</p>
        <DrawablyInput className="artemis-field-surface w-full" stroke="#fb923c" placeholder="Project name" />
        <DrawablyTextarea
          className="artemis-field-surface w-full"
          stroke="#fb923c"
          rows={3}
          placeholder="Leave a note…"
        />
        <DrawablySelect className="artemis-field-surface" stroke="#fb923c" paper="#fff7ed" defaultValue="Pencil">
          <option>Pen</option>
          <option>Pencil</option>
          <option>Brush</option>
        </DrawablySelect>
      </DrawablyCard>

      <DrawablyCard className="space-y-4 p-6" stroke="#34d399">
        <p className="font-medium">List and annotation</p>
        <DrawablyList marker="check" className="space-y-2 pl-6" stroke="#6ee7b7" fill="#6ee7b7">
          <li>Real semantic HTML controls</li>
          <li>Fresh seeded sketch on every mount</li>
          <li>Motion respects reduced-motion</li>
        </DrawablyList>
        <p className="leading-7">
          Keep it <DrawablyUnderline stroke="#6ee7b7">human</DrawablyUnderline>,{" "}
          <DrawablyHighlight stroke="#6ee7b7" fill="#6ee7b7">
            deliberate
          </DrawablyHighlight>
          , and <DrawablyCircle stroke="#6ee7b7">playful</DrawablyCircle>.
        </p>
      </DrawablyCard>

      <DrawablyCard className="relative flex min-h-48 items-center justify-between p-6" stroke="#c084fc">
        <span ref={from} className="rounded-md bg-zinc-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm">
          idea
        </span>
        <span ref={to} className="rounded-md bg-zinc-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm">
          shipped
        </span>
        <DrawablyArrow from={from} to={to} stroke="#c084fc" />
      </DrawablyCard>
    </div>
  )
}
