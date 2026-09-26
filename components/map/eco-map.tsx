"use client"

import { useEffect, useMemo } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet"
import { CategoryIcon } from "@/components/category-icon"
import { categoryMeta, SEVERITY_META } from "@/lib/categories"
import type { Incident, Report, VolunteerOpportunity } from "@/lib/types"

export interface MapPoint {
  kind: "report" | "incident" | "opportunity"
  id: string
  latitude: number
  longitude: number
  category: string
  severity: keyof typeof SEVERITY_META
  count?: number
}

function reportsToPoints(reports: Report[]): MapPoint[] {
  return reports.map((r) => ({
    kind: "report",
    id: r.id,
    latitude: r.latitude,
    longitude: r.longitude,
    category: r.category,
    severity: r.severity,
  }))
}

function incidentsToPoints(incidents: Incident[]): MapPoint[] {
  return incidents.map((i) => ({
    kind: "incident",
    id: i.id,
    latitude: i.latitude,
    longitude: i.longitude,
    category: i.category,
    severity: i.severity,
    count: i.reportCount,
  }))
}

function opportunitiesToPoints(opps: VolunteerOpportunity[]): MapPoint[] {
  return opps.map((o) => ({
    kind: "opportunity",
    id: o.id,
    latitude: o.latitude,
    longitude: o.longitude,
    category: "restoration",
    severity: "low",
  }))
}

function buildIcon(point: MapPoint) {
  if (point.kind === "opportunity") {
    const html = renderToStaticMarkup(<CategoryIcon name="HeartPulse" />)
    const size = 32
    return L.divIcon({
      className: "",
      html: `<div class="eco-marker eco-marker-opportunity" style="width:${size}px;height:${size}px;background:#16a34a;position:relative;">${html}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  const meta = categoryMeta(point.category as never)
  const sev = SEVERITY_META[point.severity]
  const base = point.kind === "incident" ? 44 : 30 + sev.ring * 3
  const html = renderToStaticMarkup(<CategoryIcon name={meta.icon} />)
  const pulse = point.kind === "incident" ? " eco-pulse" : ""
  const badge =
    point.kind === "incident" && point.count
      ? `<span style="position:absolute;top:-6px;right:-6px;background:#dc2626;color:white;font-size:10px;font-weight:700;min-width:18px;height:18px;padding:0 4px;border-radius:9999px;display:grid;place-items:center;border:2px solid white;">${point.count}</span>`
      : ""

  return L.divIcon({
    className: "",
    html: `<div class="eco-marker${pulse}" style="width:${base}px;height:${base}px;background:${meta.color};position:relative;">${html}${badge}</div>`,
    iconSize: [base, base],
    iconAnchor: [base / 2, base / 2],
  })
}

function FitBounds({ points, center }: { points: MapPoint[]; center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    // Only frame points close to the map center (metro Atlanta), so far-flung
    // reports don't force the view to zoom out across the whole country.
    const near = points.filter(
      (p) => Math.abs(p.latitude - center[0]) < 1.2 && Math.abs(p.longitude - center[1]) < 1.2,
    )
    if (near.length === 0) return
    if (near.length === 1) {
      map.setView([near[0].latitude, near[0].longitude], 12)
      return
    }
    const bounds = L.latLngBounds(near.map((p) => [p.latitude, p.longitude] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 })
  }, [map, points, center])
  return null
}

export default function EcoMap({
  reports,
  incidents,
  opportunities = [],
  onSelect,
  center = [33.7701, -84.3702],
  zoom = 11,
}: {
  reports: Report[]
  incidents: Incident[]
  opportunities?: VolunteerOpportunity[]
  onSelect?: (kind: "report" | "incident" | "opportunity", id: string) => void
  center?: [number, number]
  zoom?: number
}) {
  const points = useMemo(
    () => [
      ...incidentsToPoints(incidents),
      ...reportsToPoints(reports),
      ...opportunitiesToPoints(opportunities),
    ],
    [incidents, reports, opportunities],
  )

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="size-full"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} center={center} />
      {points.map((p) => (
        <Marker
          key={`${p.kind}-${p.id}`}
          position={[p.latitude, p.longitude]}
          icon={buildIcon(p)}
          eventHandlers={{
            click: () => onSelect?.(p.kind, p.id),
          }}
        />
      ))}
    </MapContainer>
  )
}
