# Keewacker - Cinema Streaming Platform

A Next.js-based streaming platform that embeds playback using Vidsrc iframe endpoints with IMDb integration.

## Features

- ✅ **Exact Vidsrc API Implementation** - Full support for movie, TV, and anime endpoints
- ✅ **IMDb Metadata** - Fetch rich metadata using OMDb API (tt... IDs)
- ✅ **TV-Ready UI** - 10-foot interface with keyboard/remote navigation
- ✅ **Player Event Tracking** - PostMessage integration for playback events
- ✅ **Progress Tracking** - Save and resume playback progress
- ✅ **Cinema Dark Theme** - Professional dark theme with warm yellow accents
- ✅ **Responsive Design** - Works on desktop, tablet, and TV interfaces

## Tech Stack

- **Next.js 14+** (App Router, TypeScript)
- **Tailwind CSS** (Cinema dark theme)
- **Zod** (Validation)
- **OMDb API** (Metadata)
- **Vidsrc.cc** (Video embedding)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OMDb API Key (free from https://www.omdbapi.com/apikey.aspx)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Edit `.env.local` and add your OMDb API key:**
   ```env
   OMDB_API_KEY=your_key_here
   NEXT_PUBLIC_VIDSRC_ORIGIN=https://vidsrc.cc
   NEXT_PUBLIC_APP_NAME=Keewacker
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

## Usage

### Watch a Movie
Navigate to: `/watch/movie/[imdbId]`

Example: `/watch/movie/tt6263850` (Deadpool 2)

### Watch a TV Show
Navigate to: `/watch/tv/[imdbId]?season=1&episode=1`

Example: `/watch/tv/tt0944947?season=1&episode=1` (Game of Thrones)

### Watch Anime
Navigate to: `/watch/anime/[id]?episode=1&type=sub`

Example: `/watch/anime/ani21?episode=1&type=sub`

## Project Structure

```
keewacker/
├── app/
│   ├── layout.tsx              # Root layout with shell
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + TV focus states
│   ├── watch/
│   │   └── [mediaType]/
│   │       └── [imdbId]/
│   │           ├── page.tsx    # Watch page
│   │           └── EpisodeSelector.tsx
│   └── api/
│       ├── imdb/[imdbId]/
│       │   └── route.ts        # IMDb metadata proxy
│       └── progress/
│           └── route.ts        # Progress tracking
├── components/
│   ├── KeewackerShell.tsx      # App shell with nav
│   ├── PosterHero.tsx          # Hero section with poster
│   ├── WatchLayout.tsx         # Watch page layout
│   ├── PlayerFrame.tsx         # Video player iframe
│   └── TvRemoteHints.tsx       # Remote control guide
├── lib/
│   ├── vidsrc.ts               # Vidsrc URL builder
│   ├── imdb.ts                 # OMDb metadata fetcher
│   └── types.ts                # TypeScript types
└── ...config files
```

## Vidsrc API

The platform implements the exact Vidsrc API specification:

### Movie Endpoint
```
/{version}/embed/movie/{id}
```

### TV Endpoints
```
/{version}/embed/tv/{id}
/{version}/embed/tv/{id}/{season}
/{version}/embed/tv/{id}/{season}/{episode}
```

### Anime Endpoint
```
/v2/embed/anime/{id}/{episode}/{type}
```

### Supported Parameters
- `poster`: Show/hide poster
- `autoPlay`: Auto-start playback
- `startAt`: Start time in seconds
- `color`: Player accent color (hex)
- `sub.file` / `sub.label`: Custom subtitles
- `sub.info`: Multiple subtitle tracks (JSON)

## Player Events

The player listens for postMessage events from the Vidsrc iframe:

```typescript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://vidsrc.cc') return;
  
  if (event.data.type === 'PLAYER_EVENT') {
    const { event, currentTime, duration } = event.data.data;
    // Handle: 'play', 'pause', 'time', 'complete'
  }
});
```

## TV-Ready Navigation

The UI is optimized for TV remotes and keyboards:

- **Arrow Keys**: Navigate between elements
- **Enter**: Select/Play
- **Backspace/Escape**: Go back
- **? or H**: Show remote hints
- **Yellow Focus Rings**: Visible focus indicators
- **Large Hit Targets**: Minimum 56px buttons

## Styling

Cinema dark theme with professional aesthetics:

- **Background**: Near black (`#0a0a0a`)
- **Surfaces**: Charcoal (`#1a1a1a`, `#242424`)
- **Accent**: Warm yellow (`#f5c400`)
- **Text**: Off-white (`#e5e5e5`)
- **No neon colors** - Cinema aesthetic only

## Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## API Routes

### GET /api/imdb/[imdbId]
Fetch metadata for an IMDb ID (server-side, protects API key)

**Response:**
```json
{
  "imdbId": "tt6263850",
  "title": "Deadpool 2",
  "year": "2018",
  "rated": "R",
  "runtime": "119 min",
  "genres": ["Action", "Adventure", "Comedy"],
  "plot": "...",
  "poster": "https://...",
  "imdbRating": "7.6",
  "type": "movie"
}
```

### POST /api/progress
Save playback progress

**Request:**
```json
{
  "imdbId": "tt6263850",
  "mediaType": "movie",
  "currentTime": 1234,
  "duration": 7140,
  "lastWatched": "2025-12-27T..."
}
```

### GET /api/progress?imdbId=...
Retrieve saved progress

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OMDB_API_KEY` | Yes | Your OMDb API key |
| `NEXT_PUBLIC_VIDSRC_ORIGIN` | No | Vidsrc origin (default: https://vidsrc.cc) |
| `NEXT_PUBLIC_APP_NAME` | No | App name (default: Keewacker) |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL for API calls (default: http://localhost:3000) |

## Production Deployment

1. Set `NEXT_PUBLIC_BASE_URL` to your production domain
2. Use a real database for progress tracking (replace in-memory Map)
3. Add authentication/user accounts
4. Implement search functionality
5. Add favorites/watchlist features
6. Cache metadata more aggressively

## License

MIT

## Credits

- **Video Embedding**: [Vidsrc.cc](https://vidsrc.cc)
- **Metadata**: [OMDb API](https://www.omdbapi.com/)
- **Framework**: [Next.js](https://nextjs.org/)
