"use client";

import { ReactNode, useState, useEffect } from "react";
import { TmdbMetadata } from "@/lib/types";
import PlayerFrame from "./PlayerFrame";
import WatchlistButton from "./WatchlistButton";
import Image from "next/image";
import Link from "next/link";
import { Share2, Check, Copy, User } from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  voteAverage: number;
  releaseDate: string;
  mediaType: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  profilePath: string | null;
  department: string;
}

interface WatchLayoutProps {
  metadata: TmdbMetadata;
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  children?: ReactNode;
}

type TabId = "overview" | "episodes" | "similar";

export default function WatchLayout({
  metadata,
  tmdbId,
  mediaType,
  season,
  episode,
  children,
}: WatchLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-cinema-bg">
      {/* Player Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PlayerFrame
          tmdbId={tmdbId}
          mediaType={mediaType}
          season={season}
          episode={episode}
          onEvent={(event) => {
            console.log("Playback event:", event);
          }}
        />
      </div>

      {/* Title Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-cinema-border">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-cinema-text mb-2">
              {metadata.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-cinema-muted">
              {metadata.voteAverage !== undefined && (
                <span className="text-cinema-accent font-semibold text-lg">
                  ⭐ {metadata.voteAverage.toFixed(1)}
                </span>
              )}
              {metadata.releaseDate && (
                <>
                  <span>•</span>
                  <span>{metadata.releaseDate?.slice(0, 4)}</span>
                </>
              )}
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
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <WatchlistButton
              tmdbId={tmdbId}
              mediaType={mediaType}
              title={metadata.title}
              posterPath={metadata.posterPath || null}
              variant="full"
            />
            <ShareButton />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 border-b border-cinema-border">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabButton>
          {metadata.mediaType === "tv" && (
            <TabButton
              active={activeTab === "episodes"}
              onClick={() => setActiveTab("episodes")}
            >
              Episodes
            </TabButton>
          )}
          <TabButton
            active={activeTab === "similar"}
            onClick={() => setActiveTab("similar")}
          >
            More Like This
          </TabButton>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "overview" && <OverviewTab metadata={metadata} tmdbId={tmdbId} mediaType={mediaType} />}
          {activeTab === "episodes" && metadata.mediaType === "tv" && (
            <div>{children}</div>
          )}
          {activeTab === "similar" && <SimilarTab tmdbId={tmdbId} mediaType={mediaType} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-lg font-semibold tv-focus transition-colors ${
        active
          ? "text-cinema-accent border-b-4 border-cinema-accent"
          : "text-cinema-muted hover:text-cinema-text"
      }`}
    >
      {children}
    </button>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Fall back to clipboard copy
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
      title="Share"
    >
      {copied ? (
        <>
          <Check className="h-5 w-5 text-green-400" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </button>
  );
}

function OverviewTab({ metadata, tmdbId, mediaType }: { metadata: TmdbMetadata; tmdbId: number; mediaType: "movie" | "tv" }) {
  const [cast, setCast] = useState<CastMember[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(`/api/credits/${mediaType}/${tmdbId}`);
        if (response.ok) {
          const data = await response.json();
          setCast(data.cast || []);
          setCrew(data.crew || []);
        }
      } catch (err) {
        console.error("Error fetching credits:", err);
      } finally {
        setCreditsLoading(false);
      }
    };
    fetchCredits();
  }, [tmdbId, mediaType]);

  return (
    <div className="space-y-8">
      {/* Tagline */}
      {metadata.tagline && (
        <p className="text-xl text-cinema-accent italic">&ldquo;{metadata.tagline}&rdquo;</p>
      )}

      {/* Plot */}
      {metadata.overview && (
        <div>
          <h2 className="text-2xl font-bold text-cinema-text mb-4">Overview</h2>
          <p className="text-cinema-text text-lg leading-relaxed">
            {metadata.overview}
          </p>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metadata.genres.length > 0 && (
          <DetailItem
            label="Genres"
            value={metadata.genres.map((g) => g.name).join(", ")}
          />
        )}
        {metadata.originalLanguage && (
          <DetailItem
            label="Original Language"
            value={metadata.originalLanguage.toUpperCase()}
          />
        )}
        {metadata.status && (
          <DetailItem label="Status" value={metadata.status} />
        )}
        {metadata.mediaType === "tv" && metadata.numberOfSeasons && (
          <DetailItem label="Seasons" value={`${metadata.numberOfSeasons}`} />
        )}
        {metadata.mediaType === "tv" && metadata.numberOfEpisodes && (
          <DetailItem label="Episodes" value={`${metadata.numberOfEpisodes}`} />
        )}
        {metadata.voteCount && (
          <DetailItem label="Vote Count" value={metadata.voteCount.toLocaleString()} />
        )}
      </div>

      {/* Cast & Crew Section */}
      {!creditsLoading && (cast.length > 0 || crew.length > 0) && (
        <div className="space-y-6">
          {/* Crew */}
          {crew.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-cinema-text mb-4">Crew</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {crew.map((person) => (
                  <div key={`${person.id}-${person.job}`} className="bg-cinema-surface p-3 rounded-lg">
                    <div className="text-cinema-text font-medium">{person.name}</div>
                    <div className="text-cinema-muted text-sm">{person.job}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-cinema-text mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="bg-cinema-surface rounded-lg overflow-hidden group">
                    <div className="aspect-[2/3] relative bg-cinema-card">
                      {person.profilePath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${person.profilePath}`}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cinema-muted">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-cinema-text font-medium text-sm line-clamp-1">{person.name}</div>
                      <div className="text-cinema-muted text-xs line-clamp-1">{person.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cinema-surface p-4 rounded-lg">
      <div className="text-cinema-muted text-sm uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-cinema-text text-lg">{value}</div>
    </div>
  );
}

function SimilarTab({ tmdbId, mediaType }: { tmdbId: number; mediaType: "movie" | "tv" }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/recommendations/${mediaType}/${tmdbId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setRecommendations(data.results || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [tmdbId, mediaType]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cinema-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cinema-muted text-lg">No recommendations available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {recommendations.map((item) => (
        <Link
          key={item.id}
          href={mediaType === "tv" ? `/watch/tv/${item.id}?season=1&episode=1` : `/watch/movie/${item.id}`}
          className="group tv-card rounded-lg overflow-hidden bg-cinema-surface hover:ring-2 hover:ring-cinema-accent transition-all"
        >
          {/* Poster */}
          <div className="aspect-[2/3] relative bg-cinema-card">
            {item.posterPath ? (
              <Image
                src={`https://image.tmdb.org/t/p/w342${item.posterPath}`}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cinema-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
            )}
            {/* Rating Badge */}
            {item.voteAverage > 0 && (
              <div className="absolute top-2 right-2 bg-black/70 text-cinema-accent text-xs font-bold px-2 py-1 rounded">
                ⭐ {item.voteAverage.toFixed(1)}
              </div>
            )}
          </div>
          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-cinema-text line-clamp-2 text-sm group-hover:text-cinema-accent transition-colors">
              {item.title}
            </h3>
            {item.releaseDate && (
              <p className="text-xs text-cinema-muted mt-1">
                {item.releaseDate.slice(0, 4)}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
