import {
  Bird,
  Bug,
  CloudHail,
  CloudLightning,
  Droplet,
  Droplets,
  Flame,
  FlaskConical,
  HeartPulse,
  Leaf,
  Lightbulb,
  Mountain,
  Recycle,
  Sailboat,
  Sprout,
  Sun,
  Tornado,
  Trash2,
  TreeDeciduous,
  Trees,
  TriangleAlert,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  Trash2,
  Recycle,
  Droplets,
  Droplet,
  Wind,
  Flame,
  FlaskConical,
  Bird,
  HeartPulse,
  TreeDeciduous,
  Bug,
  Mountain,
  Sprout,
  Waves,
  CloudLightning,
  Sun,
  CloudHail,
  Tornado,
  TriangleAlert,
  Lightbulb,
  Trees,
  Sailboat,
  Leaf,
}

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Leaf
  return <Icon className={className} />
}

export function categorySvgPath(name: string) {
  return name
}
