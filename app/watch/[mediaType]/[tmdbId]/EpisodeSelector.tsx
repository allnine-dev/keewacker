"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface EpisodeSelectorProps {
  tmdbId: number;
  totalSeasons: number;
  currentSeason: number;
  currentEpisode: number;
}

interface SeasonData {
  seasonNumber: number;
  episodeCount: number;
  episodes: {
    episodeNumber: number;
    name: string;
  }[];
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
  const [isLoading, setIsLoading] = useState(false);

  // Fetch season details when season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      setIsLoading(true);
      try {
        // For now, use a default episode count
        // In production, you'd fetch from TMDB API
        setSeasonData({
          seasonNumber: selectedSeason,
          episodeCount: 20, // Default
          episodes: Array.from({ length: 20 }, (_, i) => ({
            episodeNumber: i + 1,
            name: `Episode ${i + 1}`,
          })),
        });
      } catch (error) {
        console.error("Error fetching season details:", error);
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

  const episodeCount = seasonData?.episodeCount || 20;

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
        <h2 className="text-2xl font-bold text-cinema-text mb-4">
          Season {selectedSeason} Episodes
        </h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: episodeCount }, (_, i) => i + 1).map(
              (episode) => (
                <button
                  key={episode}
                  onClick={() => handleEpisodeSelect(episode)}
                  className={`aspect-video rounded-lg font-bold text-xl tv-button tv-card transition-all ${
                    selectedSeason === currentSeason &&
                    episode === currentEpisode
                      ? "bg-cinema-accent text-cinema-bg ring-4 ring-cinema-accent"
                      : "bg-cinema-surface text-cinema-text hover:bg-cinema-card"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-3xl font-bold">{episode}</div>
                    <div className="text-sm opacity-75">Episode</div>
                  </div>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
