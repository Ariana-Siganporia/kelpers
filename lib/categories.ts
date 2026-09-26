import type { CategoryId, Severity } from "./types"

export interface CategoryMeta {
  id: CategoryId
  label: string
  group: string
  color: string
  icon: string
}

export const CATEGORY_GROUPS = [
  "Pollution & Waste",
  "Nature & Wildlife",
  "Weather & Environmental Conditions",
  "Community & Infrastructure",
  "Community Action",
] as const

export const CATEGORIES: CategoryMeta[] = [
  // Pollution & Waste
  { id: "litter", label: "Litter", group: "Pollution & Waste", color: "#a16207", icon: "Trash2" },
  { id: "recycling", label: "Recycling issue", group: "Pollution & Waste", color: "#0891b2", icon: "Recycle" },
  { id: "water-pollution", label: "Water pollution", group: "Pollution & Waste", color: "#0369a1", icon: "Droplets" },
  { id: "air-pollution", label: "Air pollution", group: "Pollution & Waste", color: "#64748b", icon: "Wind" },
  { id: "smoke-fire", label: "Smoke / fire", group: "Pollution & Waste", color: "#dc2626", icon: "Flame" },
  { id: "chemical", label: "Chemical pollution", group: "Pollution & Waste", color: "#7c3aed", icon: "FlaskConical" },
  // Nature & Wildlife
  { id: "wildlife", label: "Wildlife sighting", group: "Nature & Wildlife", color: "#16a34a", icon: "Bird" },
  { id: "injured-wildlife", label: "Injured wildlife", group: "Nature & Wildlife", color: "#ea580c", icon: "HeartPulse" },
  { id: "damaged-tree", label: "Damaged tree", group: "Nature & Wildlife", color: "#92400e", icon: "TreeDeciduous" },
  { id: "invasive-species", label: "Invasive species", group: "Nature & Wildlife", color: "#ca8a04", icon: "Bug" },
  { id: "habitat-damage", label: "Habitat damage", group: "Nature & Wildlife", color: "#b45309", icon: "Mountain" },
  { id: "plant-observation", label: "Plant / ecosystem", group: "Nature & Wildlife", color: "#65a30d", icon: "Sprout" },
  // Weather & Environmental Conditions
  { id: "flooding", label: "Flooding", group: "Weather & Environmental Conditions", color: "#2563eb", icon: "Waves" },
  { id: "storm-damage", label: "Storm damage", group: "Weather & Environmental Conditions", color: "#4f46e5", icon: "CloudLightning" },
  { id: "drought", label: "Drought", group: "Weather & Environmental Conditions", color: "#d97706", icon: "Sun" },
  { id: "extreme-weather", label: "Extreme weather", group: "Weather & Environmental Conditions", color: "#7c3aed", icon: "CloudHail" },
  { id: "natural-disaster", label: "Natural disaster", group: "Weather & Environmental Conditions", color: "#b91c1c", icon: "Tornado" },
  // Community & Infrastructure
  { id: "unsafe-infrastructure", label: "Unsafe bike/pedestrian", group: "Community & Infrastructure", color: "#db2777", icon: "TriangleAlert" },
  { id: "water-leak", label: "Water leak", group: "Community & Infrastructure", color: "#0ea5e9", icon: "Droplet" },
  { id: "light-pollution", label: "Light pollution", group: "Community & Infrastructure", color: "#9333ea", icon: "Lightbulb" },
  { id: "park-condition", label: "Park condition", group: "Community & Infrastructure", color: "#059669", icon: "Trees" },
  { id: "beach-coastal", label: "Beach / coastal issue", group: "Community & Infrastructure", color: "#0d9488", icon: "Sailboat" },
  // Community Action
  { id: "beach-cleanup", label: "Beach cleanup needed", group: "Community Action", color: "#0d9488", icon: "Waves" },
  { id: "park-cleanup", label: "Park cleanup needed", group: "Community Action", color: "#059669", icon: "Trees" },
  { id: "restoration", label: "Restoration opportunity", group: "Community Action", color: "#16a34a", icon: "Sprout" },
]

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<CategoryId, CategoryMeta>,
)

export function categoryMeta(id: CategoryId): CategoryMeta {
  return CATEGORY_MAP[id] ?? CATEGORIES[0]
}

export const SEVERITY_META: Record<Severity, { label: string; color: string; bg: string; ring: number }> = {
  low: { label: "Low", color: "#65a30d", bg: "rgba(101,163,13,0.12)", ring: 1 },
  moderate: { label: "Moderate", color: "#ca8a04", bg: "rgba(202,138,4,0.12)", ring: 2 },
  high: { label: "High", color: "#ea580c", bg: "rgba(234,88,12,0.12)", ring: 3 },
  severe: { label: "Severe", color: "#dc2626", bg: "rgba(220,38,38,0.14)", ring: 4 },
}

export const SEVERITY_ORDER: Severity[] = ["low", "moderate", "high", "severe"]
