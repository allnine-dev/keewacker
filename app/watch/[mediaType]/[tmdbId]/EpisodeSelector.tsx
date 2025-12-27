"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface EpisodeSelectorProps {
  tmdbId: number;
  totalSeasons: number;
  currentSeason: number;
  currentEpisode: number;
}

interface Episode {
  episodeNumber: number;
  name: string;
  overview?: string;
  stillPath?: string;
  airDate?: string;
  runtime?: number;
  voteAverage?: number;
}

interface SeasonData {
  seasonNumber: number;
  name: string;
  overview?: string;
  episodeCount: number;
  episodes: Episode[];
}

export default function EpisodeSelector({
  tmdbId,
  totalSeasons,
  currentSeason,
  currentEpisode,
}: EpisodeSelectorProps) {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch season details when season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tv/${tmdbId}/season/${selectedSeason}`);
        if (!response.ok) {
          throw new Error("Failed to fetch season data");
        }
        const data = await response.json();
        setSeasonData(data);
      } catch (err) {
        console.error("Error fetching season details:", err);
        setError("Failed to load episodes");
        // Fallback to default
        setSeasonData({
          seasonNumber: selectedSeason,
          name: `Season ${selectedSeason}`,
          episodeCount: 10,
          episodes: Array.from({ length: 10 }, (_, i) => ({
            episodeNumber: i + 1,
            name: `Episode ${i + 1}`,
          })),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasonDetails();
  }, [selectedSeason, tmdbId]);

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    // Navigate to first episode of selected season
    router.push(`/watch/tv/${tmdbId}?season=${season}&episode=1`);
  };

  const handleEpisodeSelect = (episode: number) => {
    router.push(
      `/watch/tv/${tmdbId}?season=${selectedSeason}&episode=${episode}`
    );
  };

  return (
    <div className="space-y-8">
      {/* Season Selector */}
      <div>
        <h2 className="text-2xl font-bold text-cinema-text mb-4">
          Select Season
        </h2>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(
            (season) => (
              <button
                key={season}
                onClick={() => handleSeasonChange(season)}
                className={`tv-button rounded-lg font-semibold transition-all ${
                  season === selectedSeason
                    ? "bg-cinema-accent text-cinema-bg"
                    : "bg-cinema-surface text-cinema-text hover:bg-cinema-card"
                }`}
              >
                Season {season}
              </button>
            )
          )}
        </div>
      </div>

      {/* Episode Grid */}
      <div>
        <h2 className="text-2xl font-bold text-cinema-text mb-2">
          {seasonData?.name || `Season ${selectedSeason}`}
        </h2>
        {seasonData?.episodeCount && (
          <p className="text-cinema-muted mb-4">
            {seasonData.episodeCount} Episodes
          </p>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 py-4">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {seasonData?.episodes.map((episode) => (
              <button
                key={episode.episodeNumber}
                onClick={() => handleEpisodeSelect(episode.episodeNumber)}
                className={`text-left rounded-lg overflow-hidden transition-all tv-button tv-card ${
                  selectedSeason === currentSeason &&
                  episode.episodeNumber === currentEpisode
                    ? "ring-4 ring-cinema-accent"
                    : "hover:ring-2 hover:ring-cinema-accent/50"
                }`}
              >
                {/* Episode Thumbnail */}
                <div className="aspect-video bg-cinema-surface relative">
                  {episode.stillPath ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${episode.stillPath}`}
                      alt={episode.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cinema-card">
                      <span className="text-4xl font-bold text-cinema-muted">
                        {episode.episodeNumber}
                      </span>
                    </div>
                  )}
                  {/* Episode number badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    E{episode.episodeNumber}
                  </div>
                  {/* Runtime badge */}
                  {episode.runtime && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {episode.runtime}m
                    </div>
                  )}
                  {/* Currently watching indicator */}
                  {selectedSeason === currentSeason &&
                    episode.episodeNumber === currentEpisode && (
                      <div className="absolute inset-0 bg-cinema-accent/20 flex items-center justify-center">
                        <span className="bg-cinema-accent text-cinema-bg text-sm font-bold px-3 py-1 rounded">
                          Now Playing
                        </span>
                      </div>
                    )}
                </div>
                {/* Episode Info */}
                <div className="p-3 bg-cinema-surface">
                  <h3 className="font-semibold text-cinema-text line-clamp-1">
                    {episode.name}
                  </h3>
                  {episode.overview && (
                    <p className="text-sm text-cinema-muted line-clamp-2 mt-1">
                      {episode.overview}
                    </p>
                  )}
                  {episode.voteAverage !== undefined && episode.voteAverage > 0 && (
                    <p className="text-xs text-cinema-accent mt-2">
                      ⭐ {episode.voteAverage.toFixed(1)}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
