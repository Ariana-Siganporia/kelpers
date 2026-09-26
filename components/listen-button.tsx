"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Loader2, RotateCcw, Square, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "idle" | "loading" | "playing" | "error"

// Module-level registry so that starting one Listen button stops every other one.
const activeStoppers = new Set<() => void>()

export function ListenButton({
  text,
  label = "Listen",
  className,
  size = "default",
}: {
  text: string
  label?: string
  className?: string
  size?: "default" | "sm"
}) {
  const [status, setStatus] = useState<Status>("idle")
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const activeRef = useRef(false)

  const teardown = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.src = ""
      audioRef.current = null
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    activeRef.current = false
  }, [])

  const stop = useCallback(() => {
    teardown()
    setStatus("idle")
  }, [teardown])

  useEffect(() => {
    activeStoppers.add(stop)
    return () => {
      activeStoppers.delete(stop)
      teardown()
    }
  }, [stop, teardown])

  const start = useCallback(async () => {
    // Toggling while active stops playback / generation.
    if (status === "playing" || status === "loading") {
      stop()
      return
    }

    // Never autoplay — this only runs from a click. Stop any other player first.
    activeStoppers.forEach((s) => {
      if (s !== stop) s()
    })

    setStatus("loading")
    activeRef.current = true

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error("Request failed")

      const blob = await res.blob()
      if (!activeRef.current) return // stopped while we were generating

      const url = URL.createObjectURL(blob)
      urlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => stop()
      audio.onerror = () => setStatus("error")

      await audio.play()
      setStatus("playing")
    } catch {
      teardown()
      setStatus("error")
    }
  }, [status, stop, teardown, text])

  const view = {
    idle: { icon: <Volume2 className="size-4" />, text: label },
    loading: { icon: <Loader2 className="size-4 animate-spin" />, text: "Generating…" },
    playing: { icon: <Square className="size-3.5 fill-current" />, text: "Stop" },
    error: { icon: <RotateCcw className="size-4" />, text: "Retry" },
  }[status]

  return (
    <button
      type="button"
      onClick={start}
      aria-label={
        status === "playing" ? "Stop audio" : status === "error" ? "Retry reading aloud" : `Listen to ${label}`
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        status === "playing"
          ? "border-primary bg-primary/10 text-primary"
          : status === "error"
            ? "border-crisis/40 bg-crisis/10 text-crisis"
            : "border-border bg-card text-foreground hover:bg-secondary",
        className,
      )}
    >
      {view.icon}
      {view.text}
    </button>
  )
}
