"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TmdbSearchItem, TmdbSearchResult } from "@/lib/types";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbSearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: TmdbSearchResult = await res.json();
          setResults(data.results.slice(0, 8)); // Limit to 8 results
          setIsOpen(true);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: TmdbSearchItem) => {
      const mediaType = item.mediaType;
      const tmdbId = item.id;

      if (mediaType === "tv") {
        router.push(`/watch/tv/${tmdbId}?season=1&episode=1`);
      } else {
        router.push(`/watch/movie/${tmdbId}`);
      }

      setQuery("");
      setIsOpen(false);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Search movies & TV shows..."
          className="w-full bg-cinema-surface border-2 border-cinema-border rounded-lg px-4 py-3 pl-12 text-lg text-cinema-text placeholder-cinema-muted tv-focus transition-colors focus:border-cinema-accent"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-results"
        />
        
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cinema-muted">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-cinema-surface border-2 border-cinema-border rounded-lg shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          role="listbox"
        >
          {results.map((item, index) => (
            <SearchResultItem
              key={`${item.mediaType}-${item.id}`}
              item={item}
              isSelected={index === selectedIndex}
              onClick={() => handleSelect(item)}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-cinema-surface border-2 border-cinema-border rounded-lg p-6 text-center text-cinema-muted z-50">
          No results found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

function SearchResultItem({
  item,
  isSelected,
  onClick,
}: {
  item: TmdbSearchItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  const title = item.title || item.name || "Unknown";
  const year = item.releaseDate?.slice(0, 4) || item.firstAirDate?.slice(0, 4);
  const posterUrl = getTmdbImageUrl(item.posterPath, "w92");

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 text-left transition-colors tv-focus ${
        isSelected
          ? "bg-cinema-accent/20 border-l-4 border-cinema-accent"
          : "hover:bg-cinema-card border-l-4 border-transparent"
      }`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Poster */}
      <div className="flex-shrink-0 w-12 h-18 bg-cinema-card rounded overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            width={48}
            height={72}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🎬
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-cinema-text truncate">{title}</div>
        <div className="flex items-center gap-2 text-sm text-cinema-muted">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              item.mediaType === "movie"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-purple-500/20 text-purple-400"
            }`}
          >
            {item.mediaType === "movie" ? "Movie" : "TV"}
          </span>
          {year && <span>{year}</span>}
          {item.voteAverage > 0 && (
            <span className="text-cinema-accent">
              ⭐ {item.voteAverage.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// Export image URL helper for use elsewhere
export { getTmdbImageUrl };
