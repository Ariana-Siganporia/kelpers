"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ImageIcon,
  MapPin,
  Sparkles,
} from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import { SeverityBadge } from "@/components/severity-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { CATEGORIES, CATEGORY_GROUPS, SEVERITY_META, SEVERITY_ORDER, categoryMeta } from "@/lib/categories"
import { CURRENT_USER } from "@/lib/mock-data"
import type { CategoryId, Report, Severity } from "@/lib/types"

const SAMPLE_IMAGES = [
  "/reports/litter.png",
  "/reports/smoke.png",
  "/reports/water.png",
  "/reports/wildlife.png",
  "/reports/flooding.png",
  "/reports/tree.png",
]

const LOCATIONS = [
  { label: "Piedmont Park, NE entrance", lat: 33.7873, lng: -84.3728 },
  { label: "Near Bolton, NW Atlanta", lat: 33.8121, lng: -84.4468 },
  { label: "Chattahoochee River, NW", lat: 33.9015, lng: -84.4602 },
  { label: "West End, Atlanta", lat: 33.7402, lng: -84.4009 },
  { label: "Atlanta BeltLine, Eastside", lat: 33.7561, lng: -84.3641 },
]

const STEPS = ["Photo", "Category", "Details", "Location", "Review"]

export default function ReportPage() {
  const { addReport } = useStore()
  const [step, setStep] = useState(0)
  const [image, setImage] = useState<string | undefined>()
  const [group, setGroup] = useState<string>(CATEGORY_GROUPS[0])
  const [category, setCategory] = useState<CategoryId | null>(null)
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<Severity>("moderate")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [location, setLocation] = useState(LOCATIONS[0])
  const [submitted, setSubmitted] = useState<Report | null>(null)

  const canNext =
    (step === 0) ||
    (step === 1 && category !== null) ||
    (step === 2 && description.trim().length > 0) ||
    step === 3 ||
    step === 4

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput("")
  }

  const submit = () => {
    if (!category) return
    const report = addReport({
      category,
      tags,
      description: description.trim(),
      image,
      latitude: location.lat,
      longitude: location.lng,
      approximateLocation: location.label,
      severity,
    })
    setSubmitted(report)
  }

  if (submitted) {
    const meta = categoryMeta(submitted.category)
    return (
      <div className="mx-auto max-w-lg py-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary">
          <Check className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold">Report submitted</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for contributing to your community&apos;s environmental picture.
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl text-white" style={{ backgroundColor: meta.color }}>
              <CategoryIcon name={meta.icon} className="size-5" />
            </span>
            <div>
              <p className="font-semibold">{meta.label}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {submitted.approximateLocation}
              </p>
            </div>
            <div className="ml-auto">
              <SeverityBadge severity={submitted.severity} />
            </div>
          </div>

          {submitted.incidentId ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-primary/5 p-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-primary">Grouped with a likely incident</p>
                <p className="text-xs text-muted-foreground">
                  Our system detected other nearby reports that appear related. Your report was added to help verify a
                  developing incident.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                We&apos;ll watch for related reports nearby. If others report something similar, we&apos;ll group them
                into an incident automatically.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/map"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            View on the map
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmitted(null)
              setStep(0)
              setImage(undefined)
              setCategory(null)
              setDescription("")
              setTags([])
              setSeverity("moderate")
            }}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold"
          >
            Report something else
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold">Report an observation</h1>
      <p className="text-sm text-muted-foreground">Share what you&apos;re seeing to help your community.</p>

      {/* Progress */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col gap-1.5">
            <span
              className={cn(
                "h-1.5 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-border",
              )}
            />
            <span className={cn("text-[11px] font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold">Add a photo</h2>
            <p className="mb-4 text-sm text-muted-foreground">A photo helps others understand and verify. Optional.</p>
            {image ? (
              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image || "/placeholder.svg"} alt="Selected" className="aspect-video w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(undefined)}
                  className="absolute right-3 top-3 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium shadow"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground transition-colors hover:bg-secondary">
                <Camera className="size-8" />
                <span className="text-sm font-medium">Take or upload a photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={() => setImage(SAMPLE_IMAGES[0])} />
              </label>
            )}
            <p className="mb-2 mt-5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ImageIcon className="size-3.5" /> Or pick a sample
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {SAMPLE_IMAGES.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setImage(src)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                    image === src ? "border-primary" : "border-transparent",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src || "/placeholder.svg"} alt="Sample" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-semibold">What are you reporting?</h2>
            <p className="mb-4 text-sm text-muted-foreground">Pick the category that fits best.</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {CATEGORY_GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    group === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORIES.filter((c) => c.group === group).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center text-sm font-medium transition-all",
                    category === c.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-secondary/60",
                  )}
                >
                  <span className="grid size-10 place-items-center rounded-xl text-white" style={{ backgroundColor: c.color }}>
                    <CategoryIcon name={c.icon} className="size-5" />
                  </span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display text-xl font-semibold">Describe what you see</h2>
              <p className="mb-3 text-sm text-muted-foreground">A short description helps others understand.</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="e.g. Thick smoke drifting from the northwest, strong burning smell..."
                className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Severity</label>
              <div className="grid grid-cols-4 gap-2">
                {SEVERITY_ORDER.map((s) => {
                  const meta = SEVERITY_META[s]
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeverity(s)}
                      className={cn(
                        "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all",
                        severity === s ? "border-transparent text-white shadow-sm" : "border-border bg-card",
                      )}
                      style={severity === s ? { backgroundColor: meta.color } : undefined}
                    >
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Tags</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <button key={t} type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))}>
                      <Badge variant="secondary" className="font-normal">
                        {t} ×
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-semibold">Where is this?</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              We only ever share an approximate location to protect your privacy.
            </p>
            <div className="flex flex-col gap-2">
              {LOCATIONS.map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={() => setLocation(l)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left text-sm transition-all",
                    location.label === l.label
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-secondary/60",
                  )}
                >
                  <MapPin className={cn("size-5", location.label === l.label ? "text-primary" : "text-muted-foreground")} />
                  <span className="flex-1 font-medium">{l.label}</span>
                  {location.label === l.label && <Check className="size-4 text-primary" />}
                </button>
              ))}
            </div>
            <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
              Using approximate location near {CURRENT_USER.location}. Exact coordinates are never shown publicly.
            </p>
          </div>
        )}

        {step === 4 && category && (
          <div>
            <h2 className="font-display text-xl font-semibold">Review your report</h2>
            <p className="mb-4 text-sm text-muted-foreground">Make sure everything looks right before submitting.</p>
            <div className="flex flex-col gap-4">
              {image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image || "/placeholder.svg"} alt="Report" className="aspect-video w-full rounded-2xl object-cover" />
              )}
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: categoryMeta(category).color }}
                >
                  <CategoryIcon name={categoryMeta(category).icon} className="size-5" />
                </span>
                <span className="font-semibold">{categoryMeta(category).label}</span>
                <div className="ml-auto">
                  <SeverityBadge severity={severity} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{description || "No description provided."}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-primary" />
                {location.label}
              </p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground disabled:opacity-40"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button onClick={submit}>
            <Check className="size-4" />
            Submit report
          </Button>
        )}
      </div>
    </div>
  )
}
