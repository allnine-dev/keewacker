"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";

export interface WatchlistItem {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  overview?: string;
  voteAverage?: number;
  releaseDate?: string;
  addedAt: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (tmdbId: number, mediaType: string) => void;
  isInWatchlist: (tmdbId: number, mediaType: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("keewacker_watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("keewacker_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = (item: Omit<WatchlistItem, "addedAt">) => {
    setWatchlist((prev) => {
      // Check if already exists
      const exists = prev.some(
        (i) => i.tmdbId === item.tmdbId && i.mediaType === item.mediaType
      );
      if (exists) return prev;
      return [{ ...item, addedAt: new Date().toISOString() }, ...prev];
    });
  };

  const removeFromWatchlist = (tmdbId: number, mediaType: string) => {
    setWatchlist((prev) =>
      prev.filter((item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType))
    );
  };

  const isInWatchlist = (tmdbId: number, mediaType: string) => {
    return watchlist.some(
      (item) => item.tmdbId === tmdbId && item.mediaType === mediaType
    );
  };

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
