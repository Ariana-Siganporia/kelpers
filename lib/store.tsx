"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import {
  IMPACT_STATS,
  PROFILE_ACTIVITY,
  SEED_INCIDENTS,
  SEED_REPORTS,
  SEED_RESEARCH,
  SEED_VOLUNTEER,
  CURRENT_USER,
} from "./mock-data"
import type {
  Incident,
  ProfileActivity,
  Report,
  ResearchRequest,
  VolunteerOpportunity,
} from "./types"

type ViewMode = "community" | "organization"

interface StoreValue {
  reports: Report[]
  incidents: Incident[]
  volunteer: VolunteerOpportunity[]
  research: ResearchRequest[]
  activity: ProfileActivity[]
  viewMode: ViewMode
  setViewMode: (m: ViewMode) => void
  addReport: (r: Omit<Report, "id" | "createdAt" | "confirmationCount" | "userId" | "userName">) => Report
  confirmReport: (id: string) => void
  toggleRegister: (id: string) => void
  toggleSave: (id: string) => void
  addVolunteer: (v: Omit<VolunteerOpportunity, "id" | "registeredCount" | "distanceMiles">) => void
  addResearch: (r: Omit<ResearchRequest, "id" | "createdAt" | "status">) => void
  respondToIncident: (id: string) => void
  observationCount: number
}

const StoreContext = createContext<StoreValue | null>(null)

function findRelatedIncidentId(r: { latitude: number; longitude: number; category: string }, incidents: Incident[]) {
  const match = incidents.find((inc) => {
    const near = Math.abs(inc.latitude - r.latitude) < 0.05 && Math.abs(inc.longitude - r.longitude) < 0.05
    return near
  })
  return match?.id
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS)
  const [incidents, setIncidents] = useState<Incident[]>(SEED_INCIDENTS)
  const [volunteer, setVolunteer] = useState<VolunteerOpportunity[]>(SEED_VOLUNTEER)
  const [research, setResearch] = useState<ResearchRequest[]>(SEED_RESEARCH)
  const [activity, setActivity] = useState<ProfileActivity[]>(PROFILE_ACTIVITY)
  const [viewMode, setViewMode] = useState<ViewMode>("community")

  const value = useMemo<StoreValue>(() => {
    const addReport: StoreValue["addReport"] = (input) => {
      const id = `r-${Math.random().toString(36).slice(2, 9)}`
      const incidentId = input.incidentId ?? findRelatedIncidentId(input, incidents)
      const report: Report = {
        ...input,
        incidentId,
        id,
        userId: CURRENT_USER.id,
        userName: CURRENT_USER.name,
        createdAt: new Date().toISOString(),
        confirmationCount: 0,
      }
      setReports((prev) => [report, ...prev])
      if (incidentId) {
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === incidentId
              ? { ...inc, reportIds: [report.id, ...inc.reportIds], reportCount: inc.reportCount + 1 }
              : inc,
          ),
        )
      }
      setActivity((prev) => [
        {
          id: `act-${id}`,
          type: input.isCrisis ? "action" : "report",
          label: input.isCrisis ? "Reported a crisis" : "Submitted a report",
          location: input.approximateLocation,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        },
        ...prev,
      ])
      return report
    }

    const confirmReport: StoreValue["confirmReport"] = (id) => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                confirmedByMe: !r.confirmedByMe,
                confirmationCount: r.confirmationCount + (r.confirmedByMe ? -1 : 1),
              }
            : r,
        ),
      )
    }

    const toggleRegister: StoreValue["toggleRegister"] = (id) => {
      setVolunteer((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                registeredByMe: !v.registeredByMe,
                registeredCount: v.registeredCount + (v.registeredByMe ? -1 : 1),
              }
            : v,
        ),
      )
    }

    const toggleSave: StoreValue["toggleSave"] = (id) => {
      setVolunteer((prev) => prev.map((v) => (v.id === id ? { ...v, savedByMe: !v.savedByMe } : v)))
    }

    const addVolunteer: StoreValue["addVolunteer"] = (input) => {
      const id = `vol-${Math.random().toString(36).slice(2, 9)}`
      setVolunteer((prev) => [
        { ...input, id, registeredCount: 0, distanceMiles: Math.round(Math.random() * 60) / 10 + 1 },
        ...prev,
      ])
    }

    const addResearch: StoreValue["addResearch"] = (input) => {
      const id = `res-${Math.random().toString(36).slice(2, 9)}`
      setResearch((prev) => [
        { ...input, id, status: "submitted", createdAt: new Date().toISOString() },
        ...prev,
      ])
    }

    const respondToIncident: StoreValue["respondToIncident"] = (id) => {
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status: "responding" } : inc)))
    }

    return {
      reports,
      incidents,
      volunteer,
      research,
      activity,
      viewMode,
      setViewMode,
      addReport,
      confirmReport,
      toggleRegister,
      toggleSave,
      addVolunteer,
      addResearch,
      respondToIncident,
      observationCount: IMPACT_STATS.observationsThisMonth + Math.max(0, reports.length - SEED_REPORTS.length),
    }
  }, [reports, incidents, volunteer, research, activity, viewMode])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
