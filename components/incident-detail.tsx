"use client"

import { ArrowDown, CalendarDays, MapPin, Radio, Sparkles } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { SeverityBadge } from "@/components/severity-badge"
import { ReportCard } from "@/components/report-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { categoryMeta } from "@/lib/categories"
import { formatDateTime } from "@/lib/format"
import { useStore } from "@/lib/store"
import type { Incident } from "@/lib/types"

export function IncidentDetail({
  incident,
  onOpenReport,
}: {
  incident: Incident
  onOpenReport?: (reportId: string) => void
}) {
  const { reports, viewMode, respondToIncident } = useStore()
  const meta = categoryMeta(incident.category)
  const memberReports = incident.reportIds
    .map((id) => reports.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-12 place-items-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: meta.color }}>
          <CategoryIcon name={meta.icon} className="size-6" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-semibold leading-tight">{incident.title}</h3>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {incident.approximateLocation}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {incident.aiGrouped && (
          <Badge className="gap-1 bg-primary/10 text-primary">
            <Sparkles className="size-3" />
            AI grouped
          </Badge>
        )}
        <SeverityBadge severity={incident.severity} />
        <Badge variant="outline" className="font-normal">
          {incident.groupingConfidenceLabel}
        </Badge>
      </div>

      {/* AI grouping visual */}
      <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold tabular-nums">{incident.reportCount}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">community reports</span>
          <ArrowDown className="size-4 text-muted-foreground" />
          <Badge className="gap-1 bg-primary/10 text-primary">
            <Sparkles className="size-3" />
            AI grouping
          </Badge>
          <ArrowDown className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">1 likely incident</span>
        </div>
        <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground">{incident.description}</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-card p-3 shadow-sm ring-1 ring-border">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" /> First reported
          </dt>
          <dd className="mt-1 font-medium">{formatDateTime(incident.firstReportedAt)}</dd>
        </div>
        <div className="rounded-xl bg-card p-3 shadow-sm ring-1 ring-border">
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" /> Latest report
          </dt>
          <dd className="mt-1 font-medium">{formatDateTime(incident.lastReportedAt)}</dd>
        </div>
      </dl>

      {viewMode === "organization" && (
        <Button
          className="w-full"
          variant={incident.status === "responding" ? "secondary" : "default"}
          onClick={() => respondToIncident(incident.id)}
        >
          <Radio className="size-4" />
          {incident.status === "responding" ? "Your organization is responding" : "Respond to this incident"}
        </Button>
      )}

      <div>
        <h4 className="mb-2 text-sm font-semibold">Contributing reports</h4>
        <div className="flex flex-col gap-2">
          {memberReports.map((r) => (
            <ReportCard key={r.id} report={r} onOpen={() => onOpenReport?.(r.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
