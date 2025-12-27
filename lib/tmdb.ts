import { TmdbMetadata, TmdbSearchResult, TmdbSearchItem } from "./types";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/**
 * Get full image URL from TMDB path
 */
export function getTmdbImageUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

/**
 * Fetch movie details from TMDB
 */
export async function fetchMovieDetails(
  tmdbId: number | string
): Promise<TmdbMetadata | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured");
    return null;
  }

  try {
    const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    return normalizeMovieData(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

/**
 * Fetch TV show details from TMDB
 */
export async function fetchTvDetails(
  tmdbId: number | string
): Promise<TmdbMetadata | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured");
    return null;
  }

  try {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    return normalizeTvData(data);
  } catch (error) {
    console.error("Error fetching TV details:", error);
    return null;
  }
}

/**
 * Search movies and TV shows on TMDB
 */
export async function searchMulti(
  query: string,
  page: number = 1
): Promise<TmdbSearchResult | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured");
    return null;
  }

  try {
    const url = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Filter to only movies and TV shows, exclude people
    const filteredResults = data.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => normalizeSearchItem(item));

    return {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      results: filteredResults,
    };
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return null;
  }
}

/**
 * Get trending movies and TV shows
 */
export async function getTrending(
  mediaType: "movie" | "tv" | "all" = "all",
  timeWindow: "day" | "week" = "week"
): Promise<TmdbSearchItem[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured");
    return [];
  }

  try {
    const url = `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => normalizeSearchItem(item));
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
}

/**
 * Get TV season details
 */
export async function fetchSeasonDetails(
  tmdbId: number | string,
  seasonNumber: number
): Promise<any | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not configured");
    return null;
  }

  try {
    const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching season details:", error);
    return null;
  }
}

// Normalize movie data from TMDB API
function normalizeMovieData(data: any): TmdbMetadata {
  return {
    id: data.id,
    title: data.title,
    originalTitle: data.original_title,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.release_date,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
    genres: data.genres || [],
    runtime: data.runtime,
    mediaType: "movie",
    tagline: data.tagline,
    adult: data.adult,
    originalLanguage: data.original_language,
  };
}

// Normalize TV data from TMDB API
function normalizeTvData(data: any): TmdbMetadata {
  return {
    id: data.id,
    title: data.name,
    originalTitle: data.original_name,
    overview: data.overview,
    posterPath: data.poster_path,
    backdropPath: data.backdrop_path,
    releaseDate: data.first_air_date,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
    genres: data.genres || [],
    mediaType: "tv",
    numberOfSeasons: data.number_of_seasons,
    numberOfEpisodes: data.number_of_episodes,
    firstAirDate: data.first_air_date,
    lastAirDate: data.last_air_date,
    status: data.status,
    tagline: data.tagline,
    originalLanguage: data.original_language,
  };
}

// Normalize search item from TMDB API
function normalizeSearchItem(item: any): TmdbSearchItem {
  return {
    id: item.id,
    title: item.title,
    name: item.name,
    originalTitle: item.original_title,
    originalName: item.original_name,
    overview: item.overview,
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path,
    releaseDate: item.release_date,
    firstAirDate: item.first_air_date,
    voteAverage: item.vote_average,
    mediaType: item.media_type,
    genreIds: item.genre_ids || [],
  };
}
