// Types for Keewacker

export type MediaType = "movie" | "tv" | "anime";
export type AnimeType = "sub" | "dub";
export type IconStyle = "vid" | "default";
export type PlayerType = "jw" | "default";

// Vidlink URL Parameters
export interface VidlinkUrlParams {
  mediaType: MediaType;
  tmdbId?: number | string;
  malId?: number | string; // For anime (MyAnimeList ID)
  season?: number;
  episode?: number;
  animeType?: AnimeType;
  fallback?: boolean; // For anime - fallback to sub/dub if type not found
  primaryColor?: string;
  secondaryColor?: string;
  iconColor?: string;
  icons?: IconStyle;
  title?: boolean;
  poster?: boolean;
  autoplay?: boolean;
  nextButton?: boolean;
  player?: PlayerType;
  startAt?: number;
  subFile?: string;
  subLabel?: string;
}

// TMDB Metadata
export interface TmdbMetadata {
  id: number;
  title: string;
  originalTitle?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: { id: number; name: string }[];
  runtime?: number; // minutes (movies)
  mediaType: "movie" | "tv";
  // TV-specific
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  firstAirDate?: string;
  lastAirDate?: string;
  status?: string;
  // Additional
  tagline?: string;
  adult?: boolean;
  originalLanguage?: string;
}

// TMDB Search Result
export interface TmdbSearchResult {
  page: number;
  totalPages: number;
  totalResults: number;
  results: TmdbSearchItem[];
}

export interface TmdbSearchItem {
  id: number;
  title?: string; // movies
  name?: string; // tv shows
  originalTitle?: string;
  originalName?: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate?: string; // movies
  firstAirDate?: string; // tv
  voteAverage: number;
  mediaType: "movie" | "tv";
  genreIds: number[];
}

// Vidlink Player Event
export interface VidlinkPlayerEvent {
  type: "PLAYER_EVENT";
  data: {
    event: "play" | "pause" | "seeked" | "ended" | "timeupdate";
    currentTime: number;
    duration: number;
    mtmdbId: number;
    mediaType: "movie" | "tv";
    season?: number;
    episode?: number;
  };
}

// Vidlink Media Data (for continue watching)
export interface VidlinkMediaData {
  type: "MEDIA_DATA";
  data: {
    [tmdbId: string]: {
      id: number;
      type: "movie" | "tv";
      title: string;
      poster_path: string;
      backdrop_path?: string;
      progress: {
        watched: number;
        duration: number;
      };
      last_updated?: number;
      // TV-specific
      last_season_watched?: string;
      last_episode_watched?: string;
      show_progress?: {
        [key: string]: {
          season: string;
          episode: string;
          progress: {
            watched: number;
            duration: number;
          };
        };
      };
    };
  };
}

export interface PlaybackProgress {
  tmdbId: number;
  mediaType: MediaType;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  lastWatched: string;
}
