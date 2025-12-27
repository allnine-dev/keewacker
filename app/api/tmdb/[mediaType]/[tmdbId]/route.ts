import { NextRequest, NextResponse } from "next/server";
import { fetchMovieDetails, fetchTvDetails } from "@/lib/tmdb";

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaType: string; tmdbId: string } }
) {
  const { mediaType, tmdbId } = params;

  if (!tmdbId || isNaN(parseInt(tmdbId, 10))) {
    return NextResponse.json(
      { error: "Invalid TMDB ID. Must be a number" },
      { status: 400 }
    );
  }

  if (!["movie", "tv"].includes(mediaType)) {
    return NextResponse.json(
      { error: "Invalid media type. Must be 'movie' or 'tv'" },
      { status: 400 }
    );
  }

  try {
    const metadata =
      mediaType === "movie"
        ? await fetchMovieDetails(tmdbId)
        : await fetchTvDetails(tmdbId);

    if (!metadata) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error in TMDB API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
