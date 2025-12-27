import { VidlinkUrlParams } from "./types";

const VIDLINK_ORIGIN =
  process.env.NEXT_PUBLIC_VIDLINK_ORIGIN || "https://vidlink.pro";

/**
 * Builds a complete Vidlink embed URL following exact API specification
 */
export function buildVidlinkUrl(params: VidlinkUrlParams): string {
  const {
    mediaType,
    tmdbId,
    season,
    episode,
    malId,
    animeType,
    fallback,
    primaryColor,
    secondaryColor,
    iconColor,
    icons,
    title,
    poster,
    autoplay,
    nextButton,
    player,
    startAt,
    subFile,
    subLabel,
  } = params;

  // Build path based on media type
  let path: string;

  if (mediaType === "anime") {
    // Anime: /anime/{MALid}/{number}/{subOrDub}
    if (!malId || episode === undefined || !animeType) {
      throw new Error("Anime requires malId, episode number, and animeType (sub/dub)");
    }
    path = `/anime/${malId}/${episode}/${animeType}`;
  } else if (mediaType === "tv") {
    // TV: /tv/{tmdbId}/{season}/{episode}
    if (season === undefined || episode === undefined) {
      throw new Error("TV shows require season and episode numbers");
    }
    path = `/tv/${tmdbId}/${season}/${episode}`;
  } else {
    // Movie: /movie/{tmdbId}
    path = `/movie/${tmdbId}`;
  }

  // Build query parameters (only include defined values)
  const queryParams = new URLSearchParams();

  // Anime fallback
  if (fallback !== undefined) {
    queryParams.append("fallback", String(fallback));
  }

  // Color customization (without #)
  if (primaryColor) {
    queryParams.append("primaryColor", primaryColor.replace("#", ""));
  }
  if (secondaryColor) {
    queryParams.append("secondaryColor", secondaryColor.replace("#", ""));
  }
  if (iconColor) {
    queryParams.append("iconColor", iconColor.replace("#", ""));
  }

  // Icon style
  if (icons) {
    queryParams.append("icons", icons);
  }

  // Display options
  if (title !== undefined) {
    queryParams.append("title", String(title));
  }
  if (poster !== undefined) {
    queryParams.append("poster", String(poster));
  }
  if (autoplay !== undefined) {
    queryParams.append("autoplay", String(autoplay));
  }
  if (nextButton !== undefined) {
    queryParams.append("nextbutton", String(nextButton));
  }

  // Player type
  if (player) {
    queryParams.append("player", player);
  }

  // Start time
  if (startAt !== undefined) {
    queryParams.append("startAt", String(startAt));
  }

  // External subtitles
  if (subFile) {
    queryParams.append("sub_file", subFile);
    if (subLabel) {
      queryParams.append("sub_label", subLabel);
    }
  }

  const queryString = queryParams.toString();
  const fullUrl = `${VIDLINK_ORIGIN}${path}${queryString ? `?${queryString}` : ""}`;

  return fullUrl;
}

/**
 * Validate TMDB ID format
 */
export function isValidTmdbId(id: string | number): boolean {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0;
}
