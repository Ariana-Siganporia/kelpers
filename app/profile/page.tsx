"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Award,
  Bookmark,
  CalendarCheck,
  Camera,
  CheckCircle2,
  HandHeart,
  Leaf,
  MapPin,
  Settings,
} from "lucide-react"
import { OpportunityCard } from "@/components/opportunity-card"
import { ReportCard } from "@/components/report-card"
import { ReportDetail } from "@/components/report-detail"
import { DetailPanel } from "@/components/detail-panel"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CURRENT_USER } from "@/lib/mock-data"

const ACTIVITY_META = {
  report: { icon: Camera, color: "#a16207" },
  volunteer: { icon: HandHeart, color: "#16a34a" },
  action: { icon: CheckCircle2, color: "#0369a1" },
} as const

const BADGES = [
  { label: "First Report", icon: Leaf, earned: true },
  { label: "Community Helper", icon: HandHeart, earned: true },
  { label: "Verified Reporter", icon: CheckCircle2, earned: true },
  { label: "Crisis Responder", icon: Award, earned: false },
]

const TABS = ["Activity", "My reports", "Registered", "Saved"] as const

export default function ProfilePage() {
  const { reports, volunteer, activity } = useStore()
  const [tab, setTab] = useState<(typeof TABS)[number]>("Activity")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const myReports = useMemo(() => reports.filter((r) => r.userId === CURRENT_USER.id), [reports])
  const registered = useMemo(() => volunteer.filter((v) => v.registeredByMe), [volunteer])
  const saved = useMemo(() => volunteer.filter((v) => v.savedByMe), [volunteer])

  const stats = [
    { label: "Reports", value: myReports.length },
    { label: "Volunteered", value: activity.filter((a) => a.type === "volunteer").length },
    { label: "Confirmations", value: activity.filter((a) => a.type === "action").length },
    { label: "Badges", value: BADGES.filter((b) => b.earned).length },
  ]

  const activeReport = reports.find((r) => r.id === selectedReport)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-accent/40 p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid size-20 place-items-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground shadow-lg">
            {CURRENT_USER.name.slice(0, 1)}
          </span>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold">{CURRENT_USER.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {CURRENT_USER.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
                <Leaf className="size-3" />
                Community Contributor
              </Badge>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
          >
            <Settings className="size-4" />
            Settings
          </button>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card/70 p-3 text-center backdrop-blur">
              <p className="font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Badges</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.label}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
                  b.earned ? "border-primary/30 bg-primary/5" : "border-dashed border-border opacity-60",
                )}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-full",
                    b.earned ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold">{b.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tabs */}
      <section>
        <div className="mb-4 flex gap-1 overflow-x-auto rounded-full border border-border bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Activity" && (
          <ol className="flex flex-col gap-3">
            {activity.map((a) => {
              const meta = ACTIVITY_META[a.type]
              const Icon = meta.icon
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <span className="grid size-10 place-items-center rounded-full text-white" style={{ backgroundColor: meta.color }}>
                    <Icon className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{a.label}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {a.location}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarCheck className="size-3.5" />
                    {a.date}
                  </span>
                </li>
              )
            })}
          </ol>
        )}

        {tab === "My reports" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {myReports.length > 0 ? (
              myReports.map((r) => <ReportCard key={r.id} report={r} onOpen={() => setSelectedReport(r.id)} />)
            ) : (
              <EmptyState icon={Camera} text="You haven't submitted any reports yet." href="/report" cta="Make a report" />
            )}
          </div>
        )}

        {tab === "Registered" && (
          <div className="grid gap-4 lg:grid-cols-2">
            {registered.length > 0 ? (
              registered.map((o) => <OpportunityCard key={o.id} opp={o} />)
            ) : (
              <EmptyState icon={HandHeart} text="You're not registered for any opportunities yet." href="/help" cta="Find ways to help" />
            )}
          </div>
        )}

        {tab === "Saved" && (
          <div className="grid gap-4 lg:grid-cols-2">
            {saved.length > 0 ? (
              saved.map((o) => <OpportunityCard key={o.id} opp={o} />)
            ) : (
              <EmptyState icon={Bookmark} text="No saved opportunities yet." href="/help" cta="Browse opportunities" />
            )}
          </div>
        )}
      </section>

      <DetailPanel open={Boolean(activeReport)} onClose={() => setSelectedReport(null)} title="Report">
        {activeReport && <ReportDetail report={activeReport} />}
      </DetailPanel>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  text,
  href,
  cta,
}: {
  icon: typeof Camera
  text: string
  href: string
  cta: string
}) {
  return (
    <div className="col-span-full grid place-items-center gap-3 rounded-3xl border border-dashed border-border py-12 text-center">
      <Icon className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href={href} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        {cta}
      </Link>
    </div>
  )
}
