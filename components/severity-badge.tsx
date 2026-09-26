import { Badge } from "@/components/ui/badge"
import { SEVERITY_META } from "@/lib/categories"
import type { Severity } from "@/lib/types"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY_META[severity]
  return (
    <Badge style={{ backgroundColor: s.bg, color: s.color }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
      {s.label}
    </Badge>
  )
}
