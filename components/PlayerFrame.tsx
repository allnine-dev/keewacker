"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { buildVidlinkUrl } from "@/lib/vidlink";
import { VidlinkUrlParams, VidlinkPlayerEvent, PlaybackProgress } from "@/lib/types";

interface PlayerFrameProps {
  urlParams: VidlinkUrlParams;
  tmdbId: number;
  onEvent?: (event: VidlinkPlayerEvent["data"]) => void;
  onMediaData?: (data: any) => void;
}

const VIDLINK_ORIGIN = process.env.NEXT_PUBLIC_VIDLINK_ORIGIN || "https://vidlink.pro";

export default function PlayerFrame({
  urlParams,
  tmdbId,
  onEvent,
  onMediaData,
}: PlayerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = buildVidlinkUrl(urlParams);
    setEmbedUrl(url);
    setIsLoading(true);
  }, [urlParams]);

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
            mediaType: urlParams.mediaType === "anime" ? "anime" : urlParams.mediaType,
            season: urlParams.season,
            episode: urlParams.episode,
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
    [tmdbId, urlParams, onEvent]
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
      // CRITICAL: Validate origin
      if (event.origin !== VIDLINK_ORIGIN) {
        return;
      }

      // Handle player events
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
  );
}
