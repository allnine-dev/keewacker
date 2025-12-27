"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface WatchProgress {
  tmdbId: number;
  mediaType: "movie" | "tv" | "anime";
  title: string;
  posterPath: string | null;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  lastWatched: string;
}

export default function ContinueWatching() {
  const [watchHistory, setWatchHistory] = useState<WatchProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load watch history from localStorage
    try {
      const stored = localStorage.getItem("keewacker_watch_history");
      if (stored) {
        const history = JSON.parse(stored) as WatchProgress[];
        // Sort by lastWatched (most recent first) and filter incomplete
        const sorted = history
          .filter((item) => item.currentTime > 0 && item.currentTime < item.duration * 0.95)
          .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
          .slice(0, 10);
        setWatchHistory(sorted);
      }
    } catch (error) {
      console.error("Error loading watch history:", error);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-cinema-text">Continue Watching</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 animate-pulse">
              <div className="aspect-video bg-cinema-surface rounded-lg" />
              <div className="h-4 bg-cinema-surface rounded mt-2 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (watchHistory.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-cinema-text">Continue Watching</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-cinema-accent">
        {watchHistory.map((item) => {
          const progress = (item.currentTime / item.duration) * 100;
          const watchUrl =
            item.mediaType === "tv" || item.mediaType === "anime"
              ? `/watch/${item.mediaType}/${item.tmdbId}?season=${item.season || 1}&episode=${item.episode || 1}`
              : `/watch/movie/${item.tmdbId}`;

          return (
            <Link
              key={`${item.tmdbId}-${item.season}-${item.episode}`}
              href={watchUrl}
              className="flex-shrink-0 w-64 group"
            >
              <div className="relative aspect-video bg-cinema-surface rounded-lg overflow-hidden">
                {item.posterPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cinema-card">
                    <span className="text-cinema-muted text-4xl">🎬</span>
                  </div>
                )}
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cinema-accent flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 text-cinema-bg ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Episode badge for TV */}
                {(item.mediaType === "tv" || item.mediaType === "anime") && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    S{item.season} E{item.episode}
                  </div>
                )}
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cinema-bg/50">
                  <div
                    className="h-full bg-cinema-accent"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <h3 className="mt-2 text-cinema-text font-medium line-clamp-1 group-hover:text-cinema-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-cinema-muted text-sm">
                {Math.floor((item.duration - item.currentTime) / 60)}m remaining
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Helper function to save watch progress (call this from PlayerFrame)
export function saveWatchProgress(progress: WatchProgress) {
  try {
    const stored = localStorage.getItem("keewacker_watch_history");
    const history: WatchProgress[] = stored ? JSON.parse(stored) : [];

    // Find existing entry or create new
    const key = `${progress.tmdbId}-${progress.season || 0}-${progress.episode || 0}`;
    const existingIndex = history.findIndex(
      (item) =>
        `${item.tmdbId}-${item.season || 0}-${item.episode || 0}` === key
    );

    if (existingIndex >= 0) {
      history[existingIndex] = { ...history[existingIndex], ...progress };
    } else {
      history.unshift(progress);
    }

    // Keep only last 50 items
    const trimmed = history.slice(0, 50);
    localStorage.setItem("keewacker_watch_history", JSON.stringify(trimmed));
  } catch (error) {
    console.error("Error saving watch progress:", error);
  }
}
