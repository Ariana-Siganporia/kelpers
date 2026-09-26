import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type Variant = "default" | "secondary" | "outline" | "crisis"

const VARIANTS: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border-border text-foreground",
  crisis: "bg-crisis text-crisis-foreground",
}

export function Badge({
  children,
  className,
  style,
  variant = "default",
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: Variant
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  )
}
