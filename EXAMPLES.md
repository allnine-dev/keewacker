# Keewacker Usage Examples

## Example URLs to Test

### Movies

**Deadpool 2**
```
http://localhost:3000/watch/movie/tt6263850
```

**The Dark Knight**
```
http://localhost:3000/watch/movie/tt0468569
```

**Inception**
```
http://localhost:3000/watch/movie/tt1375666
```

**The Shawshank Redemption**
```
http://localhost:3000/watch/movie/tt0111161
```

**Interstellar**
```
http://localhost:3000/watch/movie/tt0816692
```

### TV Shows

**Game of Thrones - S1E1**
```
http://localhost:3000/watch/tv/tt0944947?season=1&episode=1
```

**Breaking Bad - S1E1**
```
http://localhost:3000/watch/tv/tt0903747?season=1&episode=1
```

**Stranger Things - S1E1**
```
http://localhost:3000/watch/tv/tt4574334?season=1&episode=1
```

**The Office - S1E1**
```
http://localhost:3000/watch/tv/tt0386676?season=1&episode=1
```

**Friends - S1E1**
```
http://localhost:3000/watch/tv/tt0108778?season=1&episode=1
```

## How to Find IMDb IDs

1. Go to https://www.imdb.com/
2. Search for any movie or TV show
3. Look at the URL - the IMDb ID is the part that starts with "tt"

Example:
- URL: `https://www.imdb.com/title/tt6263850/`
- IMDb ID: `tt6263850`

## Testing the Vidsrc URL Builder

The `buildVidsrcUrl` function in [lib/vidsrc.ts](lib/vidsrc.ts) can be tested with various parameters:

### Basic Movie
```typescript
buildVidsrcUrl({
  version: "v3",
  mediaType: "movie",
  id: "tt6263850"
})
// Result: https://vidsrc.cc/v3/embed/movie/tt6263850
```

### Movie with Autoplay and Color
```typescript
buildVidsrcUrl({
  version: "v3",
  mediaType: "movie",
  id: "tt6263850",
  autoPlay: true,
  color: "F5C400"
})
// Result: https://vidsrc.cc/v3/embed/movie/tt6263850?autoPlay=true&color=F5C400
```

### TV Episode
```typescript
buildVidsrcUrl({
  version: "v3",
  mediaType: "tv",
  id: "tt0944947",
  season: 1,
  episode: 1,
  autoPlay: true
})
// Result: https://vidsrc.cc/v3/embed/tv/tt0944947/1/1?autoPlay=true
```

### Anime
```typescript
buildVidsrcUrl({
  version: "v2",
  mediaType: "anime",
  id: "ani21",
  episode: 2,
  animeType: "sub"
})
// Result: https://vidsrc.cc/v2/embed/anime/ani21/2/sub
```

## Testing Metadata Fetch

### API Endpoint Test
```bash
# Fetch Deadpool 2 metadata
curl http://localhost:3000/api/imdb/tt6263850

# Expected response:
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

## Testing Progress Tracking

### Save Progress
```bash
curl -X POST http://localhost:3000/api/progress \
  -H "Content-Type: application/json" \
  -d '{
    "imdbId": "tt6263850",
    "mediaType": "movie",
    "currentTime": 1234,
    "duration": 7140,
    "lastWatched": "2025-12-27T12:00:00Z"
  }'
```

### Retrieve Progress
```bash
curl http://localhost:3000/api/progress?imdbId=tt6263850
```

## Keyboard Navigation Testing

Press the following keys while on the site:

- **?** or **H** - Show remote control hints
- **Escape** - Close hints dialog
- **Tab** - Navigate between focusable elements
- **Enter** - Activate buttons/links
- **Arrow Keys** - Navigate grids and lists

## TV Remote Testing

If testing on a TV or with a remote:

1. Navigate to the home page
2. Use D-pad to move between content cards
3. Press Enter to select
4. On watch page, use D-pad to navigate season/episode grid
5. Focus indicators should be clearly visible (yellow rings)

## Player Event Testing

Open browser console and navigate to any watch page. You should see:

```
Player play at 0s of 7140s
Player time at 5s of 7140s
Player time at 10s of 7140s
Player pause at 12s of 7140s
Player complete at 7140s of 7140s
```

These events come from the Vidsrc iframe via postMessage.

## Common IMDb IDs for Testing

| Title | IMDb ID | Type | Notes |
|-------|---------|------|-------|
| Deadpool 2 | tt6263850 | Movie | Action/Comedy |
| The Dark Knight | tt0468569 | Movie | Classic superhero |
| Inception | tt1375666 | Movie | Mind-bending |
| Interstellar | tt0816692 | Movie | Sci-fi epic |
| Game of Thrones | tt0944947 | TV | 8 seasons |
| Breaking Bad | tt0903747 | TV | 5 seasons |
| Stranger Things | tt4574334 | TV | Ongoing |
| The Office | tt0386676 | TV | Comedy |
| Friends | tt0108778 | TV | Sitcom classic |

## Troubleshooting

### "Metadata not found"
- Check that OMDB_API_KEY is set in .env.local
- Verify the IMDb ID is correct (starts with "tt")
- Check OMDb API daily limit (1000 requests/day on free tier)

### Player not loading
- Check browser console for CORS errors
- Verify NEXT_PUBLIC_VIDSRC_ORIGIN is correct
- Some content may not be available on Vidsrc

### Focus indicators not visible
- Check that globals.css is loaded
- Verify Tailwind is configured correctly
- Try pressing Tab key multiple times
