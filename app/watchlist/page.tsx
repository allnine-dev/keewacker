"use client";

import { useWatchlist, WatchlistItem } from "@/lib/watchlist";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, Play, Film, Tv, Clock } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const movies = watchlist.filter((item) => item.mediaType === "movie");
  const tvShows = watchlist.filter((item) => item.mediaType === "tv");

  if (watchlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <Heart className="h-12 w-12 text-zinc-600" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h1>
        <p className="text-zinc-400 mb-6 max-w-md">
          Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
        </p>
        <Link
          href="/"
          className="bg-[#f5c400] hover:bg-[#f5c400]/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Content
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-[#f5c400]" />
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
          {watchlist.length} {watchlist.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Movies Section */}
      {movies.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Film className="h-5 w-5 text-[#f5c400]" />
            <h2 className="text-xl font-semibold text-white">Movies</h2>
            <span className="text-zinc-500">({movies.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((item) => (
              <WatchlistCard
                key={`${item.mediaType}-${item.tmdbId}`}
                item={item}
                onRemove={() => removeFromWatchlist(item.tmdbId, item.mediaType)}
              />
            ))}
          </div>
        </section>
      )}

      {/* TV Shows Section */}
      {tvShows.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tv className="h-5 w-5 text-[#f5c400]" />
            <h2 className="text-xl font-semibold text-white">TV Shows</h2>
            <span className="text-zinc-500">({tvShows.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {tvShows.map((item) => (
              <WatchlistCard
                key={`${item.mediaType}-${item.tmdbId}`}
                item={item}
                onRemove={() => removeFromWatchlist(item.tmdbId, item.mediaType)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function WatchlistCard({
  item,
  onRemove,
}: {
  item: WatchlistItem;
  onRemove: () => void;
}) {
  const addedDate = new Date(item.addedAt);
  const formattedDate = addedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-[#f5c400]/50 transition-all">
      <Link href={`/watch/${item.mediaType}/${item.tmdbId}`}>
        <div className="aspect-[2/3] relative">
          {item.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <Film className="h-12 w-12 text-zinc-600" />
            </div>
          )}
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-14 h-14 bg-[#f5c400] rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
              <Play className="h-7 w-7 text-black ml-1" />
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-white font-medium text-sm line-clamp-2 mb-1 group-hover:text-[#f5c400] transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 text-zinc-500 text-xs">
          <Clock className="h-3 w-3" />
          Added {formattedDate}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        title="Remove from watchlist"
      >
        <Trash2 className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
