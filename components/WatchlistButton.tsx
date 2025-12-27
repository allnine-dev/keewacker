"use client";

import { useWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  overview?: string;
  voteAverage?: number;
  releaseDate?: string;
  variant?: "icon" | "full";
}

export default function WatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  overview,
  voteAverage,
  releaseDate,
  variant = "full",
}: WatchlistButtonProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(tmdbId, mediaType);

  const handleClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(tmdbId, mediaType);
    } else {
      addToWatchlist({
        tmdbId,
        mediaType,
        title,
        posterPath,
        overview,
        voteAverage,
        releaseDate,
      });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-full transition-colors ${
          inWatchlist
            ? "bg-cinema-accent text-cinema-bg"
            : "bg-cinema-surface text-cinema-text hover:bg-cinema-card"
        }`}
        title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      >
        {inWatchlist ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        inWatchlist
          ? "bg-cinema-accent text-cinema-bg hover:bg-cinema-accent/80"
          : "bg-cinema-surface text-cinema-text hover:bg-cinema-card border border-cinema-border"
      }`}
    >
      {inWatchlist ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          In Watchlist
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Watchlist
        </>
      )}
    </button>
  );
}
