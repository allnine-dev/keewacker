// Video server configurations for Keewacker

export interface VideoServer {
  id: string;
  name: string;
  buildUrl: (params: ServerParams) => string;
  supportsTv: boolean;
  supportsMovies: boolean;
}

export interface ServerParams {
  tmdbId: number | string;
  imdbId?: string;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

// Server configurations
export const VIDEO_SERVERS: VideoServer[] = [
  {
    id: "vidlink",
    name: "KWM 1",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidlink.pro/movie/${tmdbId}`;
    },
  },
  {
    id: "vidsrc-pro",
    name: "KWM 2",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.pro/embed/movie/${tmdbId}`;
    },
  },
  {
    id: "vidsrc-cc",
    name: "KWM 3",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
    },
  },
  {
    id: "vidsrc-xyz",
    name: "KWM 4",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
    },
  },
  {
    id: "vidsrc-icu",
    name: "KWM 5",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.icu/embed/movie/${tmdbId}`;
    },
  },
  {
    id: "2embed",
    name: "KWM 6",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
      }
      return `https://www.2embed.cc/embed/${tmdbId}`;
    },
  },
  {
    id: "autoembed",
    name: "KWM 7",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`;
      }
      return `https://autoembed.co/movie/tmdb/${tmdbId}`;
    },
  },
  {
    id: "multiembed",
    name: "KWM 8",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
    },
  },
  {
    id: "moviesapi",
    name: "KWM 9",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`;
      }
      return `https://moviesapi.club/movie/${tmdbId}`;
    },
  },
  {
    id: "smashystream",
    name: "KWM 10",
    supportsTv: true,
    supportsMovies: true,
    buildUrl: ({ tmdbId, mediaType, season, episode }) => {
      if (mediaType === "tv") {
        return `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`;
      }
      return `https://player.smashy.stream/movie/${tmdbId}`;
    },
  },
];

export function getServerById(id: string): VideoServer | undefined {
  return VIDEO_SERVERS.find((server) => server.id === id);
}

export function getDefaultServer(): VideoServer {
  return VIDEO_SERVERS[0];
}

export function getServersForMediaType(mediaType: "movie" | "tv"): VideoServer[] {
  return VIDEO_SERVERS.filter((server) =>
    mediaType === "movie" ? server.supportsMovies : server.supportsTv
  );
}
