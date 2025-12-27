"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

interface MediaItem {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  mediaType: string;
}

const MOVIE_GENRES: Record<string, string> = {
  "28": "Action",
  "12": "Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "10751": "Family",
  "14": "Fantasy",
  "36": "History",
  "27": "Horror",
  "10402": "Music",
  "9648": "Mystery",
  "10749": "Romance",
  "878": "Science Fiction",
  "53": "Thriller",
  "10752": "War",
  "37": "Western",
};

const TV_GENRES: Record<string, string> = {
  "10759": "Action & Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "10751": "Family",
  "9648": "Mystery",
  "10765": "Sci-Fi & Fantasy",
  "10768": "War & Politics",
  "37": "Western",
};

export default function GenreContentPage() {
  const params = useParams();
  const mediaType = params.mediaType as string;
  const genreId = params.genreId as string;

  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const genreName =
    mediaType === "movie"
      ? MOVIE_GENRES[genreId] || "Unknown Genre"
      : TV_GENRES[genreId] || "Unknown Genre";

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/genre/${mediaType}/${genreId}?page=${page}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setItems(data.results);
        setTotalPages(Math.min(data.totalPages, 500)); // TMDB limits to 500 pages
      } catch (err) {
        setError("Failed to load content");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [mediaType, genreId, page]);

  return (
    <div className="min-h-screen bg-cinema-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/genre"
            className="text-cinema-muted hover:text-cinema-accent transition-colors"
          >
            ← All Genres
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-cinema-accent mb-2">
          {genreName}
        </h1>
        <p className="text-cinema-muted mb-8">
          {mediaType === "movie" ? "Movies" : "TV Shows"}
        </p>

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-cinema-surface rounded-lg" />
                <div className="h-4 bg-cinema-surface rounded mt-2 w-3/4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={
                    mediaType === "tv"
                      ? `/watch/tv/${item.id}?season=1&episode=1`
                      : `/watch/movie/${item.id}`
                  }
                  className="group"
                >
                  <div className="aspect-[2/3] relative bg-cinema-surface rounded-lg overflow-hidden">
                    {item.posterPath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cinema-card">
                        <span className="text-cinema-muted text-4xl">🎬</span>
                      </div>
                    )}
                    {/* Rating Badge */}
                    {item.voteAverage > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-cinema-accent text-xs font-bold px-2 py-1 rounded">
                        ⭐ {item.voteAverage.toFixed(1)}
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cinema-accent flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-cinema-bg ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-cinema-text font-medium line-clamp-2 group-hover:text-cinema-accent transition-colors">
                    {item.title}
                  </h3>
                  {item.releaseDate && (
                    <p className="text-cinema-muted text-sm">
                      {item.releaseDate.slice(0, 4)}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-cinema-surface text-cinema-text rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cinema-card transition-colors"
              >
                ← Previous
              </button>
              <span className="text-cinema-text">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-cinema-surface text-cinema-text rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cinema-card transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
