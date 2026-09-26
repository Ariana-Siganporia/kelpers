import { NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_CHARS = 5000

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!apiKey || !voiceId) {
    return NextResponse.json({ error: "Text-to-speech is not configured." }, { status: 503 })
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const rawText = (payload as { text?: unknown } | null)?.text
  const text = typeof rawText === "string" ? rawText.trim() : ""

  if (!text) {
    return NextResponse.json({ error: "No text was provided to read aloud." }, { status: 400 })
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json({ error: "The text is too long to read aloud." }, { status: 413 })
  }

  let upstream: Response
  try {
    upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    })
  } catch {
    return NextResponse.json({ error: "Could not reach the speech service." }, { status: 502 })
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "Failed to generate audio." }, { status: 502 })
  }

  const audio = await upstream.arrayBuffer()
  return new NextResponse(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  })
}
