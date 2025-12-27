"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getServerById, getDefaultServer, ServerParams } from "@/lib/servers";
import { VidlinkPlayerEvent, PlaybackProgress, MediaType } from "@/lib/types";
import ServerSelector from "./ServerSelector";

interface PlayerFrameProps {
  tmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
  onEvent?: (event: VidlinkPlayerEvent["data"]) => void;
  onMediaData?: (data: any) => void;
}

export default function PlayerFrame({
  tmdbId,
  mediaType,
  season,
  episode,
  onEvent,
  onMediaData,
}: PlayerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentServer, setCurrentServer] = useState<string>("vidlink");
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Build embed URL when server or params change
  useEffect(() => {
    const server = getServerById(currentServer) || getDefaultServer();
    const params: ServerParams = {
      tmdbId,
      mediaType,
      season: season || 1,
      episode: episode || 1,
    };
    const url = server.buildUrl(params);
    setEmbedUrl(url);
    setIsLoading(true);
  }, [currentServer, tmdbId, mediaType, season, episode]);

  const handleServerChange = (serverId: string) => {
    setCurrentServer(serverId);
  };

  const handlePlayerEvent = useCallback(
    async (eventData: VidlinkPlayerEvent["data"]) => {
      console.log("Player event:", eventData);

      // Call parent handler
      onEvent?.(eventData);

      // Save progress on timeupdate and ended events
      if (eventData.event === "timeupdate" || eventData.event === "ended") {
        try {
          const progress: PlaybackProgress = {
            tmdbId,
            mediaType,
            season,
            episode,
            currentTime: eventData.currentTime,
            duration: eventData.duration,
            lastWatched: new Date().toISOString(),
          };

          await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(progress),
          });
        } catch (error) {
          console.error("Error saving progress:", error);
        }
      }
    },
    [tmdbId, mediaType, season, episode, onEvent]
  );

  const handleMediaData = useCallback(
    (data: any) => {
      console.log("Media data received:", data);
      
      // Store in localStorage for continue watching feature
      try {
        const existingData = localStorage.getItem("vidLinkProgress");
        const progress = existingData ? JSON.parse(existingData) : {};
        
        // Merge with existing data
        Object.assign(progress, data);
        localStorage.setItem("vidLinkProgress", JSON.stringify(progress));
      } catch (error) {
        console.error("Error storing media data:", error);
      }

      onMediaData?.(data);
    },
    [onMediaData]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle player events from any embed source
      if (event.data?.type === "PLAYER_EVENT") {
        handlePlayerEvent(event.data.data);
      }

      // Handle media data for continue watching
      if (event.data?.type === "MEDIA_DATA") {
        handleMediaData(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handlePlayerEvent, handleMediaData]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Server Selector */}
      <div className="flex items-center justify-between">
        <ServerSelector
          currentServer={currentServer}
          mediaType={mediaType}
          onServerChange={handleServerChange}
        />
        <p className="text-cinema-muted text-sm">
          {isLoading ? "Loading..." : "Player ready"}
        </p>
      </div>

      {/* Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-cinema-bg">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-cinema-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-cinema-muted text-lg">Loading player...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen={true}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
          onLoad={handleIframeLoad}
          title="Video Player"
          referrerPolicy="origin"
        />
      </div>
    </div>
  );
}
