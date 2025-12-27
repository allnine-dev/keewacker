"use client";

import { ReactNode, useState } from "react";
import { TmdbMetadata } from "@/lib/types";
import PlayerFrame from "./PlayerFrame";
import { VidlinkUrlParams } from "@/lib/types";

interface WatchLayoutProps {
  metadata: TmdbMetadata;
  playerParams: VidlinkUrlParams;
  children?: ReactNode;
}

type TabId = "overview" | "episodes" | "similar";

export default function WatchLayout({
  metadata,
  playerParams,
  children,
}: WatchLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-cinema-bg">
      {/* Player Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PlayerFrame
          urlParams={playerParams}
          tmdbId={metadata.id}
          onEvent={(event) => {
            console.log("Playback event:", event);
          }}
        />
      </div>

      {/* Title Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-cinema-border">
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
          {activeTab === "overview" && <OverviewTab metadata={metadata} />}
          {activeTab === "episodes" && metadata.mediaType === "tv" && (
            <div>{children}</div>
          )}
          {activeTab === "similar" && <SimilarTab />}
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

function OverviewTab({ metadata }: { metadata: TmdbMetadata }) {
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

function SimilarTab() {
  return (
    <div className="text-center py-12">
      <p className="text-cinema-muted text-lg">
        Similar content recommendations coming soon...
      </p>
    </div>
  );
}
