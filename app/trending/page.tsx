import Link from "next/link";
import Image from "next/image";
import { TmdbSearchItem } from "@/lib/types";
import { getTmdbImageUrl, getTrending } from "@/lib/tmdb";

export const revalidate = 3600; // Revalidate every hour

export default async function TrendingPage() {
  const trendingMovies = await getTrending("movie", "week");
  const trendingTv = await getTrending("tv", "week");
  const trendingToday = await getTrending("all", "day");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-cinema-text mb-8">Trending</h1>

      <ContentSection title="🔥 Trending Today" items={trendingToday.slice(0, 10)} />
      <ContentSection title="🎬 Popular Movies" items={trendingMovies.slice(0, 10)} />
      <ContentSection title="📺 Popular TV Shows" items={trendingTv.slice(0, 10)} />
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
      <h2 className="text-2xl font-bold text-cinema-text mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <ContentCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
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
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              item.mediaType === "movie"
                ? "bg-blue-500/80 text-white"
                : "bg-purple-500/80 text-white"
            }`}
          >
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
          <span className="text-cinema-accent">
            ⭐ {item.voteAverage.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
