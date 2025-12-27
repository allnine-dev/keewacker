import { Metadata } from "next";
import { notFound } from "next/navigation";
import WatchLayout from "@/components/WatchLayout";
import { TmdbMetadata, VidlinkUrlParams } from "@/lib/types";
import { fetchMovieDetails, fetchTvDetails } from "@/lib/tmdb";
import EpisodeSelector from "./EpisodeSelector";

interface WatchPageProps {
  params: { mediaType: string; tmdbId: string };
  searchParams: { season?: string; episode?: string; type?: string };
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const metadata = await fetchMetadata(params.mediaType, params.tmdbId);
  if (!metadata) {
    return { title: "Not Found" };
  }
  return {
    title: `${metadata.title} - Keewacker`,
    description: metadata.overview,
  };
}

async function fetchMetadata(
  mediaType: string,
  tmdbId: string
): Promise<TmdbMetadata | null> {
  const id = parseInt(tmdbId, 10);
  if (isNaN(id)) return null;

  if (mediaType === "movie") {
    return fetchMovieDetails(id);
  } else if (mediaType === "tv" || mediaType === "anime") {
    return fetchTvDetails(id);
  }
  return null;
}

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const { mediaType, tmdbId } = params;
  const { season, episode, type } = searchParams;

  // Validate media type
  if (!["movie", "tv", "anime"].includes(mediaType)) {
    notFound();
  }

  // Fetch metadata
  const metadata = await fetchMetadata(mediaType, tmdbId);
  if (!metadata) {
    notFound();
  }

  // Build player params for Vidlink
  const playerParams: VidlinkUrlParams = {
    mediaType: mediaType as "movie" | "tv" | "anime",
    tmdbId: parseInt(tmdbId, 10),
    autoplay: true,
    primaryColor: "F5C400",
    title: true,
    poster: true,
  };

  // Add season/episode for TV
  if (mediaType === "tv") {
    playerParams.season = season ? parseInt(season, 10) : 1;
    playerParams.episode = episode ? parseInt(episode, 10) : 1;
  }

  // Add episode/type for anime
  if (mediaType === "anime" && episode && type) {
    playerParams.episode = parseInt(episode, 10);
    playerParams.animeType = type as "sub" | "dub";
  }

  return (
    <WatchLayout metadata={metadata} playerParams={playerParams}>
      {/* Episode selector for TV shows */}
      {metadata.mediaType === "tv" && (
        <EpisodeSelector
          tmdbId={parseInt(tmdbId, 10)}
          totalSeasons={metadata.numberOfSeasons || 1}
          currentSeason={season ? parseInt(season, 10) : 1}
          currentEpisode={episode ? parseInt(episode, 10) : 1}
        />
      )}

      {/* Anime episode selector */}
      {mediaType === "anime" && (
        <div className="space-y-4">
          <p className="text-cinema-muted text-lg">
            Anime episode selector - Coming soon
          </p>
        </div>
      )}
    </WatchLayout>
  );
}
