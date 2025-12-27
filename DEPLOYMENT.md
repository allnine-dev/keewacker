# Keewacker Deployment Guide

## Prerequisites

- Node.js 18+ installed
- OMDb API key (free from https://www.omdbapi.com/apikey.aspx)
- Git installed

## Quick Start (Development)

### 1. Clone or Navigate to Project
```bash
cd /workspaces/keewacker
```

### 2. Run Setup Script
```bash
./setup.sh
```

Or manually:
```bash
# Copy environment template
cp .env.local.example .env.local

# Install dependencies
npm install
```

### 3. Configure Environment
Edit `.env.local` and add your OMDb API key:
```env
OMDB_API_KEY=your_actual_key_here
NEXT_PUBLIC_VIDSRC_ORIGIN=https://vidsrc.cc
NEXT_PUBLIC_APP_NAME=Keewacker
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Navigate to: http://localhost:3000

## Testing the Setup

### Test Homepage
```
http://localhost:3000
```
Should show the Keewacker homepage with featured content.

### Test Movie Playback
```
http://localhost:3000/watch/movie/tt6263850
```
Should show Deadpool 2 with working player.

### Test TV Playback
```
http://localhost:3000/watch/tv/tt0944947?season=1&episode=1
```
Should show Game of Thrones S1E1 with episode selector.

### Test API Endpoints
```bash
# Test metadata fetch
curl http://localhost:3000/api/imdb/tt6263850

# Should return JSON with movie metadata
```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `OMDB_API_KEY`
   - Add `NEXT_PUBLIC_VIDSRC_ORIGIN` = `https://vidsrc.cc`
   - Add `NEXT_PUBLIC_APP_NAME` = `Keewacker`
   - Add `NEXT_PUBLIC_BASE_URL` = `https://your-domain.vercel.app`

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Build
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Update next.config.js:**
   ```javascript
   module.exports = {
     output: 'standalone',
     // ... rest of config
   };
   ```

3. **Build and run:**
   ```bash
   docker build -t keewacker .
   docker run -p 3000:3000 \
     -e OMDB_API_KEY=your_key \
     -e NEXT_PUBLIC_VIDSRC_ORIGIN=https://vidsrc.cc \
     keewacker
   ```

### Option 3: Traditional Node.js Server

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Set environment variables:**
   ```bash
   export OMDB_API_KEY=your_key_here
   export NEXT_PUBLIC_VIDSRC_ORIGIN=https://vidsrc.cc
   export NEXT_PUBLIC_APP_NAME=Keewacker
   export NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

3. **Start server:**
   ```bash
   npm start
   ```

4. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "keewacker" -- start
   pm2 save
   pm2 startup
   ```

### Option 4: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Add environment variables in Netlify Dashboard**

## Environment Variables Reference

### Required
- `OMDB_API_KEY` - Your OMDb API key (get from omdbapi.com)

### Optional
- `NEXT_PUBLIC_VIDSRC_ORIGIN` - Default: `https://vidsrc.cc`
- `NEXT_PUBLIC_APP_NAME` - Default: `Keewacker`
- `NEXT_PUBLIC_BASE_URL` - Your production domain (for SSR API calls)

## Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Movie watch page works (`/watch/movie/tt6263850`)
- [ ] TV watch page works (`/watch/tv/tt0944947?season=1&episode=1`)
- [ ] Player iframe loads and plays video
- [ ] Metadata is fetched (check titles and posters)
- [ ] Episode selector works for TV shows
- [ ] Focus states are visible (try Tab key)
- [ ] Remote hints appear (press ?)
- [ ] Browser console shows no errors
- [ ] API routes respond correctly:
  - [ ] GET /api/imdb/tt6263850
  - [ ] POST /api/progress
  - [ ] GET /api/progress

## Production Upgrades

Before going live, consider these upgrades:

### 1. Database Integration
Replace in-memory progress storage with a database:
```typescript
// app/api/progress/route.ts
// Replace Map with Prisma, Supabase, or MongoDB
```

Recommended databases:
- **Supabase** (PostgreSQL) - Easy setup, free tier
- **PlanetScale** (MySQL) - Serverless, generous free tier
- **MongoDB Atlas** - Document DB, free tier
- **Vercel Postgres** - Integrated with Vercel

### 2. Authentication
Add user accounts:
- **NextAuth.js** - Authentication for Next.js
- **Clerk** - Drop-in auth UI
- **Supabase Auth** - If using Supabase

### 3. Search Functionality
Implement search:
- Use OMDb search endpoint: `?s={query}`
- Add Algolia or Meilisearch for better UX
- Cache popular searches

### 4. Analytics
Track usage:
- **Vercel Analytics** - Built-in for Vercel deploys
- **Google Analytics 4** - Free, comprehensive
- **Plausible** - Privacy-focused alternative

### 5. Error Monitoring
Catch production errors:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Full monitoring

### 6. Caching Strategy
Improve performance:
- Enable Next.js ISR (Incremental Static Regeneration)
- Use Redis for API response caching
- Implement CDN caching headers

### 7. Rate Limiting
Protect APIs:
- Add rate limiting middleware
- Use Upstash Rate Limit or similar
- Protect OMDb API key usage

## Monitoring

### Check Logs
```bash
# Vercel
vercel logs

# PM2
pm2 logs keewacker

# Docker
docker logs keewacker
```

### Monitor OMDb API Usage
Free tier: 1,000 requests/day

Check usage at: http://www.omdbapi.com/apikey.aspx

### Performance Metrics
- Core Web Vitals (use Lighthouse)
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)

## Troubleshooting

### Issue: "Metadata not found"
- **Cause**: Invalid or missing OMDb API key
- **Fix**: Check .env.local or environment variables

### Issue: Player not loading
- **Cause**: CORS issues or Vidsrc availability
- **Fix**: Check browser console, verify Vidsrc is accessible

### Issue: Build fails
- **Cause**: Missing dependencies or TypeScript errors
- **Fix**: Run `npm install` and `npm run build` locally first

### Issue: API routes 404
- **Cause**: Incorrect base URL in production
- **Fix**: Set NEXT_PUBLIC_BASE_URL environment variable

### Issue: Images not loading
- **Cause**: Next.js image optimization config
- **Fix**: Check next.config.js remotePatterns

### Issue: Focus states not visible
- **Cause**: CSS not loading properly
- **Fix**: Verify Tailwind is configured correctly

## Support

For issues with:
- **Vidsrc API**: Check https://vidsrc.cc documentation
- **OMDb API**: Visit https://www.omdbapi.com
- **Next.js**: Check https://nextjs.org/docs

## Security Considerations

1. **Never expose OMDb API key client-side**
   - Always use server-side API routes
   - Check [app/api/imdb/[imdbId]/route.ts](app/api/imdb/[imdbId]/route.ts)

2. **Validate iframe origin**
   - Only accept messages from https://vidsrc.cc
   - Check [components/PlayerFrame.tsx](components/PlayerFrame.tsx)

3. **Sanitize user inputs**
   - Validate IMDb IDs before API calls
   - Use Zod schemas for validation

4. **Set proper CSP headers**
   - Allow iframes from vidsrc.cc only
   - Restrict script sources

5. **Rate limit API endpoints**
   - Prevent abuse of OMDb quota
   - Implement per-IP limits

## Backup and Recovery

1. **Backup environment variables**
   - Keep secure copy of .env.local
   - Document all required env vars

2. **Version control**
   - Commit all code changes
   - Use semantic versioning
   - Tag production releases

3. **Database backups** (if applicable)
   - Daily automated backups
   - Test restoration process

## License

This project is MIT licensed. See LICENSE file for details.

## Next Steps

After deployment:
1. Test all functionality in production
2. Set up monitoring and alerts
3. Configure error tracking
4. Implement analytics
5. Plan feature roadmap
6. Gather user feedback

Enjoy your Keewacker deployment! 🎬
