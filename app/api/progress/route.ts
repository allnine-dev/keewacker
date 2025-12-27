import { NextRequest, NextResponse } from "next/server";
import { PlaybackProgress } from "@/lib/types";

// In-memory storage for demo (use database in production)
const progressStore = new Map<string, PlaybackProgress>();

/**
 * GET /api/progress?tmdbId=...&season=...&episode=...
 * Retrieve playback progress
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tmdbId = searchParams.get("tmdbId");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  if (!tmdbId) {
    return NextResponse.json({ error: "tmdbId required" }, { status: 400 });
  }

  const key = `${tmdbId}${season ? `-s${season}` : ""}${episode ? `-e${episode}` : ""}`;
  const progress = progressStore.get(key);

  if (!progress) {
    return NextResponse.json({ progress: null });
  }

  return NextResponse.json({ progress });
}

/**
 * POST /api/progress
 * Save playback progress
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PlaybackProgress;

    const { tmdbId, mediaType, season, episode, currentTime, duration } = body;

    if (!tmdbId || !mediaType || currentTime === undefined || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const key = `${tmdbId}${season ? `-s${season}` : ""}${episode ? `-e${episode}` : ""}`;

    const progress: PlaybackProgress = {
      tmdbId,
      mediaType,
      season,
      episode,
      currentTime,
      duration,
      lastWatched: new Date().toISOString(),
    };

    progressStore.set(key, progress);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
