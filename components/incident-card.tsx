"use client"

import { MapPin, Sparkles, TrendingUp } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { SeverityBadge } from "@/components/severity-badge"
import { Badge } from "@/components/ui/badge"
import { categoryMeta } from "@/lib/categories"
import { relativeTime } from "@/lib/format"
import type { Incident } from "@/lib/types"

const STATUS_LABEL: Record<NonNullable<Incident["status"]>, string> = {
  monitoring: "Monitoring",
  responding: "Responding",
  resolved: "Resolved",
}

export function IncidentCard({ incident, onOpen }: { incident: Incident; onOpen?: () => void }) {
  const meta = categoryMeta(incident.category)
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 place-items-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: meta.color }}
          >
            <CategoryIcon name={meta.icon} className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight">{incident.title}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {incident.approximateLocation}
            </p>
          </div>
        </div>
        <SeverityBadge severity={incident.severity} />
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{incident.description}</p>

      <div className="flex flex-wrap items-center gap-2">
        {incident.aiGrouped && (
          <Badge className="gap-1 bg-primary/10 text-primary">
            <Sparkles className="size-3" />
            AI grouped
          </Badge>
        )}
        <Badge variant="secondary" className="gap-1 font-normal">
          <TrendingUp className="size-3" />
          {incident.reportCount} reports
        </Badge>
        <Badge variant="outline" className="font-normal">
          {incident.groupingConfidenceLabel}
        </Badge>
        {incident.status && (
          <span className="ml-auto text-xs font-medium text-muted-foreground">
            {STATUS_LABEL[incident.status]} · {relativeTime(incident.lastReportedAt)}
          </span>
        )}
      </div>
    </button>
  )
}
