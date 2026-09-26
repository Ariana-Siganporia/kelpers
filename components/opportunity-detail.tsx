"use client"

import { Bookmark, CalendarDays, Clock, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ListenButton } from "@/components/listen-button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import type { VolunteerOpportunity } from "@/lib/types"

export function OpportunityDetail({ opp }: { opp: VolunteerOpportunity }) {
  const { toggleRegister, toggleSave } = useStore()
  const spotsLeft = Math.max(0, opp.capacity - opp.registeredCount)
  const full = spotsLeft === 0 && !opp.registeredByMe

  const speech =
    `Volunteer opportunity: ${opp.title}, organized by ${opp.organizationName}. ` +
    `${opp.description} ` +
    `It takes place at ${opp.location}, about ${opp.distanceMiles} miles away, on ${opp.date} at ${opp.time}, and lasts ${opp.duration}. ` +
    `${spotsLeft} of ${opp.capacity} spots remain.`

  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-pretty font-display text-xl font-semibold leading-tight">{opp.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{opp.organizationName}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleSave(opp.id)}
            aria-pressed={opp.savedByMe}
            aria-label={opp.savedByMe ? "Remove from saved" : "Save opportunity"}
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full border transition-colors",
              opp.savedByMe
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            <Bookmark className={cn("size-4", opp.savedByMe && "fill-current")} />
          </button>
        </div>
        <div className="mt-3">
          <ListenButton text={speech} label="Listen" />
        </div>
      </div>

      <p className="text-pretty leading-relaxed text-foreground/90">{opp.description}</p>

      <dl className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-secondary/40 p-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span>
            {opp.location} · {opp.distanceMiles} mi
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4 shrink-0 text-primary" />
          <span>{opp.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 shrink-0 text-primary" />
          <span>
            {opp.time} · {opp.duration}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="size-4 shrink-0 text-primary" />
          <span>
            {opp.registeredCount}/{opp.capacity} joined · {spotsLeft} left
          </span>
        </div>
      </dl>

      {opp.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {opp.categories.map((c) => (
            <Badge key={c} variant="outline">
              {c}
            </Badge>
          ))}
        </div>
      )}

      <Button
        onClick={() => toggleRegister(opp.id)}
        disabled={full}
        variant={opp.registeredByMe ? "outline" : "default"}
        className="w-full"
      >
        {opp.registeredByMe ? "You're registered — tap to cancel" : full ? "This event is full" : "Register to help"}
      </Button>
    </div>
  )
}
