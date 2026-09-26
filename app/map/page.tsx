"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { EyeOff, Filter, Layers, MapPin } from "lucide-react"
import { MapView } from "@/components/map/map-view"
import { MapLegend } from "@/components/map-legend"
import { ReportCard } from "@/components/report-card"
import { IncidentCard } from "@/components/incident-card"
import { OpportunityCard } from "@/components/opportunity-card"
import { ReportDetail } from "@/components/report-detail"
import { IncidentDetail } from "@/components/incident-detail"
import { OpportunityDetail } from "@/components/opportunity-detail"
import { DetailPanel } from "@/components/detail-panel"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CATEGORIES, CATEGORY_GROUPS, SEVERITY_META, SEVERITY_ORDER } from "@/lib/categories"
import { CURRENT_USER } from "@/lib/mock-data"
import { haversineMiles } from "@/lib/geo"
import type { FocusTarget } from "@/components/map/eco-map"
import type { CategoryId, Severity } from "@/lib/types"

const DISTANCE_OPTIONS = [
  { label: "Any distance", value: 0 },
  { label: "Within 5 mi", value: 5 },
  { label: "Within 15 mi", value: 15 },
  { label: "Within 50 mi", value: 50 },
]

const DATE_OPTIONS = [
  { label: "Any time", value: 0 },
  { label: "Past 24 hours", value: 1 },
  { label: "Past 7 days", value: 7 },
  { label: "Past 30 days", value: 30 },
]

const SEVERITY_OPTIONS: { label: string; value: Severity | "any" }[] = [
  { label: "Any severity", value: "any" },
  ...SEVERITY_ORDER.map((s) => ({ label: `${SEVERITY_META[s].label}+`, value: s })),
]

const user = { latitude: CURRENT_USER.lat, longitude: CURRENT_USER.lng }

function MapPageInner() {
  const { reports, incidents, volunteer } = useStore()
  const searchParams = useSearchParams()

  const [group, setGroup] = useState<string>("all")
  const [category, setCategory] = useState<CategoryId | "all">("all")
  const [distance, setDistance] = useState(0)
  const [dateDays, setDateDays] = useState(0)
  const [minSeverity, setMinSeverity] = useState<Severity | "any">("any")
  const [layers, setLayers] = useState({ reports: true, incidents: true, opportunities: true })
  const [selected, setSelected] = useState<{ kind: "report" | "incident" | "opportunity"; id: string } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [focus, setFocus] = useState<FocusTarget | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)

  // Handle a deep-link like /map?focus=report:<id> or /map?focus=incident:<id>
  // after submitting a report: fly to it, highlight/pulse it, and open its detail.
  useEffect(() => {
    const raw = searchParams.get("focus")
    if (!raw) return
    const [kind, id] = raw.split(":")
    if (kind === "report") {
      const r = reports.find((x) => x.id === id)
      if (r) {
        setFocus({ lat: r.latitude, lng: r.longitude, zoom: 15 })
        setHighlightId(r.id)
        setSelected({ kind: "report", id: r.id })
      }
    } else if (kind === "incident") {
      const inc = incidents.find((x) => x.id === id)
      if (inc) {
        setFocus({ lat: inc.latitude, lng: inc.longitude, zoom: 14 })
        setHighlightId(inc.id)
        setSelected({ kind: "incident", id: inc.id })
      }
    }
    // Only react to the initial query param resolution.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const now = Date.now()
  const passesShared = (item: { latitude: number; longitude: number; category?: CategoryId; severity?: Severity; createdAt?: string }) => {
    if (distance > 0 && haversineMiles(user, item) > distance) return false
    if (group !== "all" && item.category && CATEGORIES.find((c) => c.id === item.category)?.group !== group) return false
    if (category !== "all" && item.category !== category) return false
    if (minSeverity !== "any" && item.severity) {
      if (SEVERITY_ORDER.indexOf(item.severity) < SEVERITY_ORDER.indexOf(minSeverity)) return false
    }
    if (dateDays > 0 && item.createdAt) {
      if (now - new Date(item.createdAt).getTime() > dateDays * 86400000) return false
    }
    return true
  }

  const filteredReports = useMemo(
    () => (layers.reports ? reports.filter(passesShared) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports, layers.reports, group, category, distance, dateDays, minSeverity],
  )
  const filteredIncidents = useMemo(
    () => (layers.incidents ? incidents.filter(passesShared) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [incidents, layers.incidents, group, category, distance, minSeverity],
  )
  const filteredOpps = useMemo(
    () =>
      layers.opportunities
        ? volunteer.filter((o) => (distance > 0 ? haversineMiles(user, o) <= distance : true))
        : [],
    [volunteer, layers.opportunities, distance],
  )

  const selectedReport = selected?.kind === "report" ? reports.find((r) => r.id === selected.id) : undefined
  const selectedIncident = selected?.kind === "incident" ? incidents.find((i) => i.id === selected.id) : undefined
  const selectedOpportunity = selected?.kind === "opportunity" ? volunteer.find((o) => o.id === selected.id) : undefined

  const panelTitle = selectedIncident ? "Incident" : selectedOpportunity ? "Opportunity" : "Report"
  const allLayersOff = !layers.reports && !layers.incidents && !layers.opportunities

  const categoriesForGroup = group === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.group === group)

  const filters = (
    <div className="flex flex-col gap-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category group</label>
        <select
          value={group}
          onChange={(e) => {
            setGroup(e.target.value)
            setCategory("all")
          }}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="all">All groups</option>
          {CATEGORY_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId | "all")}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {categoriesForGroup.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Distance</label>
        <select
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          {DISTANCE_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Time range</label>
        <select
          value={dateDays}
          onChange={(e) => setDateDays(Number(e.target.value))}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          {DATE_OPTIONS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Severity</label>
        <select
          value={minSeverity}
          onChange={(e) => setMinSeverity(e.target.value as Severity | "any")}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          {SEVERITY_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Layers className="size-3.5" /> Layers
        </span>
        <div className="flex flex-col gap-2">
          {(
            [
              { key: "reports", label: "Individual reports", color: "#a16207" },
              { key: "incidents", label: "AI-grouped incidents", color: "#dc2626" },
              { key: "opportunities", label: "Volunteer opportunities", color: "#16a34a" },
            ] as const
          ).map((l) => (
            <label
              key={l.key}
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={layers[l.key]}
                onChange={() => setLayers((prev) => ({ ...prev, [l.key]: !prev[l.key] }))}
                className="size-4 accent-primary"
              />
              <span className="size-2.5 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Explore the map</h1>
          <p className="text-sm text-muted-foreground">
            {filteredReports.length + filteredIncidents.length + filteredOpps.length} results near {CURRENT_USER.location}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium lg:hidden"
        >
          <Filter className="size-4" />
          Filters
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={cn("lg:block", showFilters ? "block" : "hidden")}>{filters}</aside>

        <div className="flex flex-col gap-6">
          <div className="relative isolate h-[420px] overflow-hidden rounded-3xl border border-border shadow-sm md:h-[520px]">
            <MapView
              reports={filteredReports}
              incidents={filteredIncidents}
              opportunities={filteredOpps}
              focus={focus}
              highlightId={highlightId}
              onSelect={(kind, id) => setSelected({ kind, id })}
            />
            <MapLegend />
          </div>

          {filteredIncidents.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                Incidents
                <Badge variant="secondary" className="font-normal">
                  {filteredIncidents.length}
                </Badge>
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredIncidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} onOpen={() => setSelected({ kind: "incident", id: inc.id })} />
                ))}
              </div>
            </section>
          )}

          {filteredReports.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                Reports
                <Badge variant="secondary" className="font-normal">
                  {filteredReports.length}
                </Badge>
              </h2>
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredReports.map((r) => (
                  <ReportCard key={r.id} report={r} onOpen={() => setSelected({ kind: "report", id: r.id })} />
                ))}
              </div>
            </section>
          )}

          {filteredOpps.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                Ways to help nearby
                <Badge variant="secondary" className="font-normal">
                  {filteredOpps.length}
                </Badge>
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredOpps.map((o) => (
                  <OpportunityCard key={o.id} opp={o} />
                ))}
              </div>
            </section>
          )}

          {filteredReports.length + filteredIncidents.length + filteredOpps.length === 0 &&
            (allLayersOff ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-border py-16 text-center">
                <EyeOff className="size-8 text-muted-foreground" />
                <p className="mt-2 font-medium">All layers are turned off</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Turn on the Reports, Incidents, or Volunteer opportunities layer to see items on the map and in the
                  list.
                </p>
              </div>
            ) : (
              <div className="grid place-items-center rounded-3xl border border-dashed border-border py-16 text-center">
                <MapPin className="size-8 text-muted-foreground" />
                <p className="mt-2 font-medium">No reports found</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try changing your filters, expanding the distance, or selecting another category.
                </p>
              </div>
            ))}
        </div>
      </div>

      <DetailPanel open={Boolean(selected)} onClose={() => setSelected(null)} title={panelTitle}>
        {selectedReport && (
          <ReportDetail
            report={selectedReport}
            onOpenIncident={(id) => setSelected({ kind: "incident", id })}
            onOpenOpportunity={(id) => setSelected({ kind: "opportunity", id })}
          />
        )}
        {selectedIncident && (
          <IncidentDetail
            incident={selectedIncident}
            onOpenReport={(id) => setSelected({ kind: "report", id })}
            onOpenOpportunity={(id) => setSelected({ kind: "opportunity", id })}
          />
        )}
        {selectedOpportunity && <OpportunityDetail opp={selectedOpportunity} />}
      </DetailPanel>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={null}>
      <MapPageInner />
    </Suspense>
  )
}
