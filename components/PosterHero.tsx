"use client";

import Image from "next/image";
import { TmdbMetadata } from "@/lib/types";
import { getTmdbImageUrl } from "@/lib/tmdb";

interface PosterHeroProps {
  metadata: TmdbMetadata;
}

export default function PosterHero({ metadata }: PosterHeroProps) {
  const posterUrl = getTmdbImageUrl(metadata.posterPath, "w500");
  const backdropUrl = getTmdbImageUrl(metadata.backdropPath, "w780");

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-b from-cinema-surface to-cinema-bg">
      {/* Background backdrop with blur */}
      {backdropUrl && (
        <div className="absolute inset-0 opacity-30">
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover blur-sm"
            priority
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-cinema-bg/50 to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Poster */}
        {posterUrl && (
          <div className="flex-shrink-0 w-48 md:w-64 h-72 md:h-96 relative rounded-lg overflow-hidden border-2 border-cinema-border shadow-2xl">
            <Image
              src={posterUrl}
              alt={`${metadata.title} poster`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-cinema-text">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-cinema-muted text-lg">
            <span className="text-cinema-accent font-semibold">
              ⭐ {metadata.voteAverage.toFixed(1)}
            </span>
            <span>•</span>
            <span>{metadata.releaseDate?.slice(0, 4)}</span>
            {metadata.runtime && (
              <>
                <span>•</span>
                <span>{metadata.runtime} min</span>
              </>
            )}
            {metadata.numberOfSeasons && (
              <>
                <span>•</span>
                <span>{metadata.numberOfSeasons} Seasons</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {metadata.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-cinema-card rounded-full text-sm text-cinema-text"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {metadata.overview && (
            <p className="text-cinema-text text-lg leading-relaxed max-w-3xl line-clamp-4">
              {metadata.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
