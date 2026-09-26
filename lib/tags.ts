import type { CategoryId } from "./types"

// Category-relevant tag suggestions used for autocomplete in the report flow.
export const TAG_SUGGESTIONS: Partial<Record<CategoryId, string[]>> = {
  "smoke-fire": ["smoke", "haze", "wildfire", "fire", "air quality", "ash"],
  "air-pollution": ["air quality", "haze", "smog", "dust", "odor"],
  "water-pollution": ["runoff", "oil", "foam", "debris", "contamination", "water quality"],
  chemical: ["chemical", "spill", "contamination", "odor"],
  litter: ["trash", "plastic", "bottles", "wrappers", "dumping"],
  recycling: ["recycling", "overflow", "bins", "contamination"],
  wildlife: ["birds", "injured animal", "habitat", "wildlife"],
  "injured-wildlife": ["injured animal", "rescue", "wildlife", "habitat"],
  "damaged-tree": ["tree", "storm", "fallen", "hazard"],
  "invasive-species": ["invasive", "kudzu", "ivy", "plants", "restoration"],
  "habitat-damage": ["habitat", "erosion", "restoration", "conservation"],
  "plant-observation": ["plants", "ecosystem", "native", "bloom"],
  flooding: ["flood", "standing water", "road flooding", "storm"],
  "storm-damage": ["storm", "wind", "downed tree", "power line"],
  drought: ["drought", "dry", "low water", "heat"],
  "extreme-weather": ["heat", "storm", "wind", "hail"],
  "natural-disaster": ["disaster", "emergency", "evacuation"],
  "unsafe-infrastructure": ["hazard", "sidewalk", "bike lane", "safety"],
  "water-leak": ["leak", "water", "pipe", "waste"],
  "light-pollution": ["light", "glare", "night", "brightness"],
  "park-condition": ["park", "trail", "maintenance", "litter"],
  "beach-coastal": ["coastal", "plastic", "debris", "shoreline", "tide"],
  "beach-cleanup": ["beach", "coastal", "plastic", "cleanup"],
  "park-cleanup": ["park", "cleanup", "litter", "trail"],
  restoration: ["restoration", "native", "planting", "conservation"],
}

// Generic tags that are useful across any category.
export const GENERAL_TAGS = ["urgent", "recurring", "hazard", "safety", "public", "cleanup"]

export function tagSuggestions(
  category: CategoryId | null,
  query: string,
  existing: string[],
  limit = 8,
): string[] {
  const base = category ? TAG_SUGGESTIONS[category] ?? [] : []
  const pool = [...base, ...GENERAL_TAGS]
  const q = query.trim().toLowerCase()
  const existingLower = existing.map((e) => e.toLowerCase())
  const seen = new Set<string>()
  const out: string[] = []

  for (const tag of pool) {
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    if (existingLower.includes(key)) continue
    if (q && !key.includes(q)) continue
    out.push(tag)
    if (out.length >= limit) break
  }
  return out
}
