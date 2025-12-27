import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse by Genre - Keewacker",
  description: "Browse movies and TV shows by genre",
};

const MOVIE_GENRES = [
  { id: 28, name: "Action", slug: "action", emoji: "💥" },
  { id: 12, name: "Adventure", slug: "adventure", emoji: "🗺️" },
  { id: 16, name: "Animation", slug: "animation", emoji: "🎨" },
  { id: 35, name: "Comedy", slug: "comedy", emoji: "😂" },
  { id: 80, name: "Crime", slug: "crime", emoji: "🔫" },
  { id: 99, name: "Documentary", slug: "documentary", emoji: "📹" },
  { id: 18, name: "Drama", slug: "drama", emoji: "🎭" },
  { id: 10751, name: "Family", slug: "family", emoji: "👨‍👩‍👧‍👦" },
  { id: 14, name: "Fantasy", slug: "fantasy", emoji: "🧙" },
  { id: 36, name: "History", slug: "history", emoji: "📜" },
  { id: 27, name: "Horror", slug: "horror", emoji: "👻" },
  { id: 10402, name: "Music", slug: "music", emoji: "🎵" },
  { id: 9648, name: "Mystery", slug: "mystery", emoji: "🔍" },
  { id: 10749, name: "Romance", slug: "romance", emoji: "💕" },
  { id: 878, name: "Science Fiction", slug: "sci-fi", emoji: "🚀" },
  { id: 53, name: "Thriller", slug: "thriller", emoji: "😱" },
  { id: 10752, name: "War", slug: "war", emoji: "⚔️" },
  { id: 37, name: "Western", slug: "western", emoji: "🤠" },
];

const TV_GENRES = [
  { id: 10759, name: "Action & Adventure", slug: "action-adventure", emoji: "💥" },
  { id: 16, name: "Animation", slug: "animation", emoji: "🎨" },
  { id: 35, name: "Comedy", slug: "comedy", emoji: "😂" },
  { id: 80, name: "Crime", slug: "crime", emoji: "🔫" },
  { id: 99, name: "Documentary", slug: "documentary", emoji: "📹" },
  { id: 18, name: "Drama", slug: "drama", emoji: "🎭" },
  { id: 10751, name: "Family", slug: "family", emoji: "👨‍👩‍👧‍👦" },
  { id: 9648, name: "Mystery", slug: "mystery", emoji: "🔍" },
  { id: 10765, name: "Sci-Fi & Fantasy", slug: "sci-fi-fantasy", emoji: "🚀" },
  { id: 10768, name: "War & Politics", slug: "war-politics", emoji: "⚔️" },
  { id: 37, name: "Western", slug: "western", emoji: "🤠" },
];

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-cinema-bg">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-cinema-accent mb-8">
          Browse by Genre
        </h1>

        {/* Movie Genres */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-cinema-text mb-6">
            🎬 Movie Genres
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MOVIE_GENRES.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/movie/${genre.id}`}
                className="bg-cinema-surface hover:bg-cinema-card border border-cinema-border rounded-xl p-4 text-center transition-all hover:scale-105 hover:border-cinema-accent group"
              >
                <div className="text-4xl mb-2">{genre.emoji}</div>
                <div className="text-cinema-text font-medium group-hover:text-cinema-accent transition-colors">
                  {genre.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TV Genres */}
        <section>
          <h2 className="text-2xl font-bold text-cinema-text mb-6">
            📺 TV Show Genres
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {TV_GENRES.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/tv/${genre.id}`}
                className="bg-cinema-surface hover:bg-cinema-card border border-cinema-border rounded-xl p-4 text-center transition-all hover:scale-105 hover:border-cinema-accent group"
              >
                <div className="text-4xl mb-2">{genre.emoji}</div>
                <div className="text-cinema-text font-medium group-hover:text-cinema-accent transition-colors">
                  {genre.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
