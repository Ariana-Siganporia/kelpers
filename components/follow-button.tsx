"use client"

import { Check, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

export function FollowButton({
  userId,
  size = "default",
  className,
}: {
  userId: string
  size?: "default" | "sm"
  className?: string
}) {
  const { following, toggleFollow } = useStore()
  const isFollowing = following.includes(userId)

  return (
    <button
      type="button"
      onClick={() => toggleFollow(userId)}
      aria-pressed={isFollowing}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        isFollowing
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:bg-secondary",
        className,
      )}
    >
      {isFollowing ? (
        <>
          <Check className="size-3.5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="size-3.5" />
          Follow
        </>
      )}
    </button>
  )
}
