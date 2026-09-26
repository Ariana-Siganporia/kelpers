"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, LifeBuoy, Microscope, Plus, Sparkles, TrendingUp } from "lucide-react"
import { MapView } from "@/components/map/map-view"
import { IncidentCard } from "@/components/incident-card"
import { ReportCard } from "@/components/report-card"
import { ReportDetail } from "@/components/report-detail"
import { IncidentDetail } from "@/components/incident-detail"
import { DetailPanel } from "@/components/detail-panel"
import { useStore } from "@/lib/store"

const ACTIONS = [
  {
    href: "/report",
    icon: Plus,
    title: "Report",
    copy: "Tell us what you're seeing.",
    accent: "bg-primary text-primary-foreground",
  },
  {
    href: "/help",
    icon: LifeBuoy,
    title: "Help",
    copy: "Find ways to take action nearby.",
    accent: "bg-accent text-accent-foreground",
  },
  {
    href: "/research",
    icon: Microscope,
    title: "Contribute",
    copy: "Help researchers understand our environment.",
    accent: "bg-secondary text-secondary-foreground",
  },
]

export default function HomePage() {
  const { reports, incidents, observationCount } = useStore()
  const [selected, setSelected] = useState<{ kind: "report" | "incident"; id: string } | null>(null)

  const selectedReport = selected?.kind === "report" ? reports.find((r) => r.id === selected.id) : undefined
  const selectedIncident = selected?.kind === "incident" ? incidents.find((i) => i.id === selected.id) : undefined

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-accent/20 px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-primary shadow-sm">
            <Sparkles className="size-3.5" />
            Community environmental intelligence
          </span>
          <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            See something.
            <br />
            Make a difference.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Report environmental conditions around you, discover ways to help, and contribute to environmental research.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/report"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03]"
            >
              <Plus className="size-4" />
              Report something
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Explore the map
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Action cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className={`grid size-11 place-items-center rounded-xl ${a.accent}`}>
                <Icon className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold">{a.title}</h2>
                <p className="text-sm text-muted-foreground">{a.copy}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
                Get started
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </section>

      {/* Map preview */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">What&apos;s happening around you?</h2>
            <p className="text-sm text-muted-foreground">Live environmental reports and incidents from your community.</p>
          </div>
          <Link href="/map" className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex">
            Full map
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="h-[360px] overflow-hidden rounded-3xl border border-border shadow-sm md:h-[440px]">
          <MapView
            reports={reports}
            incidents={incidents}
            onSelect={(kind, id) => {
              if (kind !== "opportunity") setSelected({ kind, id })
            }}
          />
        </div>
      </section>

      {/* Nearby incidents */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold">Nearby incidents</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {incidents.map((inc) => (
            <IncidentCard key={inc.id} incident={inc} onOpen={() => setSelected({ kind: "incident", id: inc.id })} />
          ))}
        </div>
      </section>

      {/* Recent reports */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-semibold">Recent observations</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {reports.slice(0, 6).map((r) => (
            <ReportCard key={r.id} report={r} onOpen={() => setSelected({ kind: "report", id: r.id })} />
          ))}
        </div>
      </section>

      {/* Impact banner */}
      <section className="overflow-hidden rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground md:py-12">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/70">Community impact</p>
        <p className="mx-auto mt-2 max-w-2xl text-balance font-display text-2xl font-semibold md:text-3xl">
          Your community has contributed{" "}
          <span className="tabular-nums">{observationCount.toLocaleString()}</span> observations this month.
        </p>
        <Link
          href="/report"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.03]"
        >
          <Plus className="size-4" />
          Add your observation
        </Link>
      </section>

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selectedIncident ? "Incident" : "Report"}
      >
        {selectedReport && (
          <ReportDetail report={selectedReport} onOpenIncident={(id) => setSelected({ kind: "incident", id })} />
        )}
        {selectedIncident && (
          <IncidentDetail incident={selectedIncident} onOpenReport={(id) => setSelected({ kind: "report", id })} />
        )}
      </DetailPanel>
    </div>
  )
}
