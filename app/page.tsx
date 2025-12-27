import Link from "next/link";
import Image from "next/image";
import { TmdbSearchItem } from "@/lib/types";
import { getTmdbImageUrl, getTrending } from "@/lib/tmdb";
import ContinueWatching from "@/components/ContinueWatching";

export default async function HomePage() {
  // Fetch trending content
  const trendingAll = await getTrending("all", "week");
  const trendingMovies = await getTrending("movie", "week");
  const trendingTv = await getTrending("tv", "week");

  // Get featured item (first trending)
  const featured = trendingAll[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featured && <HeroSection item={featured} />}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Continue Watching */}
        <ContinueWatching />
        
        <ContentSection title="Trending This Week" items={trendingAll.slice(1, 9)} />
        <ContentSection title="Popular Movies" items={trendingMovies.slice(0, 8)} />
        <ContentSection title="Popular TV Shows" items={trendingTv.slice(0, 8)} />

        {/* How to Use */}
        <div className="mt-16 bg-cinema-surface rounded-2xl p-8 border border-cinema-border">
          <h2 className="text-3xl font-bold text-cinema-accent mb-6">
            How to Use Keewacker
          </h2>
          <div className="space-y-4 text-lg text-cinema-text">
            <p>
              <strong className="text-cinema-accent">1.</strong> Use the search bar
              to find any movie or TV show
            </p>
            <p>
              <strong className="text-cinema-accent">2.</strong> Click on any title
              to start watching instantly
            </p>
            <p>
              <strong className="text-cinema-accent">3.</strong> For TV shows,
              select your season and episode
            </p>
            <p className="mt-6 text-cinema-muted">
              All content metadata powered by TMDB. Video streaming by Vidlink.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ item }: { item: TmdbSearchItem }) {
  const title = item.title || item.name || "Unknown";
  const year = item.releaseDate?.slice(0, 4) || item.firstAirDate?.slice(0, 4);
  const backdropUrl = getTmdbImageUrl(item.backdropPath, "original");
  const posterUrl = getTmdbImageUrl(item.posterPath, "w500");
  const watchUrl =
    item.mediaType === "tv"
      ? `/watch/tv/${item.id}?season=1&episode=1`
      : `/watch/movie/${item.id}`;

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Background */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-bg via-cinema-bg/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-bg via-transparent to-cinema-bg/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        {/* Poster */}
        {posterUrl && (
          <div className="flex-shrink-0 w-48 md:w-64 h-72 md:h-96 relative rounded-lg overflow-hidden border-2 border-cinema-border shadow-2xl">
            <Image
              src={posterUrl}
              alt={`${title} poster`}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-block px-3 py-1 bg-cinema-accent text-cinema-bg rounded-full text-sm font-semibold mb-2">
            🔥 Trending Now
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-cinema-text">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-cinema-muted text-lg">
            <span className="text-cinema-accent font-semibold">
              ⭐ {item.voteAverage.toFixed(1)}
            </span>
            <span>•</span>
            <span>{year}</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              item.mediaType === "movie"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-purple-500/20 text-purple-400"
            }`}>
              {item.mediaType === "movie" ? "Movie" : "TV Series"}
            </span>
          </div>

          {item.overview && (
            <p className="text-cinema-text text-lg leading-relaxed max-w-2xl line-clamp-3">
              {item.overview}
            </p>
          )}

          <div className="flex gap-4 justify-center md:justify-start mt-6">
            <Link
              href={watchUrl}
              className="tv-button bg-cinema-accent text-cinema-bg hover:bg-cinema-accent/90 rounded-lg text-xl font-bold tv-focus"
            >
              ▶ Watch Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSection({
  title,
  items,
}: {
  title: string;
  items: TmdbSearchItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-cinema-text mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{items.map((item) => (
        <ContentCard key={`${item.mediaType}-${item.id}`} item={item} />
      ))}</div>
    </section>
  );
}

function ContentCard({ item }: { item: TmdbSearchItem }) {
  const title = item.title || item.name || "Unknown";
  const year = item.releaseDate?.slice(0, 4) || item.firstAirDate?.slice(0, 4);
  const posterUrl = getTmdbImageUrl(item.posterPath, "w342");
  const watchUrl =
    item.mediaType === "tv"
      ? `/watch/tv/${item.id}?season=1&episode=1`
      : `/watch/movie/${item.id}`;

  return (
    <Link
      href={watchUrl}
      className="block bg-cinema-surface hover:bg-cinema-card rounded-xl overflow-hidden tv-focus tv-card transition-all group"
    >
      <div className="aspect-[2/3] bg-cinema-card relative overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎬
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            item.mediaType === "movie"
              ? "bg-blue-500/80 text-white"
              : "bg-purple-500/80 text-white"
          }`}>
            {item.mediaType === "movie" ? "Movie" : "TV"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-cinema-text mb-1 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-cinema-muted">
          <span>{year}</span>
          <span>•</span>
          <span className="text-cinema-accent">⭐ {item.voteAverage.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
