import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: NextRequest,
  { params }: { params: { tmdbId: string; seasonNumber: string } }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { tmdbId, seasonNumber } = params;

  try {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Season not found" },
          { status: 404 }
        );
      }
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform to our format
    const seasonData = {
      seasonNumber: data.season_number,
      name: data.name,
      overview: data.overview,
      posterPath: data.poster_path,
      airDate: data.air_date,
      episodeCount: data.episodes?.length || 0,
      episodes: (data.episodes || []).map((ep: any) => ({
        episodeNumber: ep.episode_number,
        name: ep.name,
        overview: ep.overview,
        stillPath: ep.still_path,
        airDate: ep.air_date,
        runtime: ep.runtime,
        voteAverage: ep.vote_average,
      })),
    };

    return NextResponse.json(seasonData);
  } catch (error) {
    console.error("Error fetching season details:", error);
    return NextResponse.json(
      { error: "Failed to fetch season details" },
      { status: 500 }
    );
  }
}
