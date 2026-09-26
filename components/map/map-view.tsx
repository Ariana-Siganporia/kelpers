"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { Incident, Report, VolunteerOpportunity } from "@/lib/types"

const EcoMap = dynamic(() => import("./eco-map"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center bg-accent/40">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  ),
})

export function MapView(props: {
  reports: Report[]
  incidents: Incident[]
  opportunities?: VolunteerOpportunity[]
  onSelect?: (kind: "report" | "incident" | "opportunity", id: string) => void
  center?: [number, number]
  zoom?: number
}) {
  return <EcoMap {...props} />
}
