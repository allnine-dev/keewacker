import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaType: string; tmdbId: string } }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { mediaType, tmdbId } = params;

  if (!["movie", "tv"].includes(mediaType)) {
    return NextResponse.json(
      { error: "Invalid media type" },
      { status: 400 }
    );
  }

  try {
    // Fetch recommendations from TMDB
    const url = `${TMDB_BASE_URL}/${mediaType}/${tmdbId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform results
    const recommendations = data.results.slice(0, 12).map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      overview: item.overview,
      voteAverage: item.vote_average,
      releaseDate: item.release_date || item.first_air_date,
      mediaType: mediaType,
    }));

    return NextResponse.json({ results: recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
