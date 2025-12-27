"use client";

import { useState } from "react";
import { VIDEO_SERVERS, VideoServer } from "@/lib/servers";

interface ServerSelectorProps {
  currentServer: string;
  mediaType: "movie" | "tv";
  onServerChange: (serverId: string) => void;
}

export default function ServerSelector({
  currentServer,
  mediaType,
  onServerChange,
}: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const servers = VIDEO_SERVERS.filter((server) =>
    mediaType === "movie" ? server.supportsMovies : server.supportsTv
  );

  const current = servers.find((s) => s.id === currentServer) || servers[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-cinema-surface border border-cinema-border rounded-lg text-cinema-text hover:bg-cinema-card transition-colors tv-focus"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-cinema-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
          />
        </svg>
        <span className="font-medium">{current.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-48 bg-cinema-surface border border-cinema-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-semibold text-cinema-muted uppercase tracking-wider border-b border-cinema-border">
                Select Server
              </div>
              {servers.map((server) => (
                <button
                  key={server.id}
                  onClick={() => {
                    onServerChange(server.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    server.id === currentServer
                      ? "bg-cinema-accent/20 text-cinema-accent"
                      : "text-cinema-text hover:bg-cinema-card"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      server.id === currentServer
                        ? "bg-cinema-accent"
                        : "bg-cinema-muted"
                    }`}
                  />
                  <span className="font-medium">{server.name}</span>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 text-xs text-cinema-muted border-t border-cinema-border">
              Try another server if video doesn&apos;t load
            </div>
          </div>
        </>
      )}
    </div>
  );
}
