import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Genre IDs from TMDB
export const MOVIE_GENRES = [
  { id: 28, name: "Action", slug: "action" },
  { id: 12, name: "Adventure", slug: "adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 14, name: "Fantasy", slug: "fantasy" },
  { id: 36, name: "History", slug: "history" },
  { id: 27, name: "Horror", slug: "horror" },
  { id: 10402, name: "Music", slug: "music" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10749, name: "Romance", slug: "romance" },
  { id: 878, name: "Science Fiction", slug: "sci-fi" },
  { id: 10770, name: "TV Movie", slug: "tv-movie" },
  { id: 53, name: "Thriller", slug: "thriller" },
  { id: 10752, name: "War", slug: "war" },
  { id: 37, name: "Western", slug: "western" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure", slug: "action-adventure" },
  { id: 16, name: "Animation", slug: "animation" },
  { id: 35, name: "Comedy", slug: "comedy" },
  { id: 80, name: "Crime", slug: "crime" },
  { id: 99, name: "Documentary", slug: "documentary" },
  { id: 18, name: "Drama", slug: "drama" },
  { id: 10751, name: "Family", slug: "family" },
  { id: 10762, name: "Kids", slug: "kids" },
  { id: 9648, name: "Mystery", slug: "mystery" },
  { id: 10763, name: "News", slug: "news" },
  { id: 10764, name: "Reality", slug: "reality" },
  { id: 10765, name: "Sci-Fi & Fantasy", slug: "sci-fi-fantasy" },
  { id: 10766, name: "Soap", slug: "soap" },
  { id: 10767, name: "Talk", slug: "talk" },
  { id: 10768, name: "War & Politics", slug: "war-politics" },
  { id: 37, name: "Western", slug: "western" },
];

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
