import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaType: string; genreId: string } }
) {
  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const { mediaType, genreId } = params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  if (!["movie", "tv"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  try {
    const url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    const results = data.results.map((item: any) => ({
      id: item.id,
      title: item.title || item.name,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      overview: item.overview,
      voteAverage: item.vote_average,
      releaseDate: item.release_date || item.first_air_date,
      mediaType,
    }));

    return NextResponse.json({
      results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    });
  } catch (error) {
    console.error("Error fetching genre content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
