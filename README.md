# 🎬 KEEWACKER  
### A clean, IMDb-powered streaming interface built on Vidsrc embeds

![Status](https://img.shields.io/badge/status-active-success)
![Next.js](https://img.shields.io/badge/build-Next.js-black)
![UI](https://img.shields.io/badge/UI-cinema--dark-yellow)
![TV Ready](https://img.shields.io/badge/TV-ready-blue)

**Keewacker** is a modern movie, TV, and anime streaming interface that embeds licensed playback using **Vidsrc** and pulls rich metadata using **IMDb IDs (`tt...`)**.

Built to feel cinematic. Built to work everywhere. 🍿

---

## ✨ What is Keewacker?

Keewacker is **not a hosting service**.  
It is a **smart, embed-based streaming frontend** designed for speed, clarity, and trust.

**Keewacker lets you:**
- 🎥 Stream movies, TV shows, and anime
- 🆔 Use IMDb IDs (`tt...`) as the source of truth
- 🖼️ Auto-load posters, plots, ratings, and metadata
- 📺 Run smoothly on TVs, desktops, and mobile
- 🎮 Navigate with a remote (10-foot UI)

Think **Pluto / Plex vibes**, but dev-first.

---

## 🧠 How It Works

IMDb ID (tt...)
↓
OMDb Metadata
↓
Vidsrc Embed (iframe)
↓
Keewacker Player + UI

yaml
Copy code

Simple. Clean. Reliable.

---

## 🎮 Feature Status

Movies Support ██████████████░░░░░░░ 75%
TV Shows Support ██████████████████░░ 90%
Anime Support ███████████████░░░░░ 80%
IMDb Metadata ████████████████████ 100%
TV / Remote UI ██████████████████░░ 90%

yaml
Copy code

---

## 🚀 Core Features

- 🎬 Movie, TV & anime playback
- 🆔 IMDb ID–based routing
- 🖼️ Poster & backdrop fetching
- 📝 Subtitle support (single & multi-file)
- ⏯️ Resume playback
- 📡 Player events (`play`, `pause`, `time`, `complete`)
- 📺 TV-ready navigation (10-foot UI)

---

## 🧭 App Sections

- 🏠 **Home** — Trending, Continue Watching, Popular
- ⭐ **Featured** — Editor picks & highlights
- 💎 **Good Stuff** — Hidden gems & binge-worthy picks
- 🆕 **New to Keewacker** — Recently added titles
- 🗂️ **Categories** — Movies, TV, Anime, Genres

---

## 🖥️ Watch Page Layout
![Watch Page Example](https://raw.githubusercontent.com/allnine-dev/keewacker/7b95578d019687561f9048810c255a41dda6119f/Screenshot%202025-12-27%202.23.16%20AM.png)

🎬 Title (IMDb ★ Rating)
🗓️ Year • Runtime • Genre
📖 Plot Summary

📺 Season / Episode Selector
➡️ More Like This

yaml
Copy code

Designed to scale from **laptop → TV** seamlessly.

---

## 🧩 Tech Stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **OMDb API** (IMDb metadata)
- **Vidsrc** (embed playback)

---

## 📁 Project Structure

app/
├─ page.tsx
├─ watch/
│ └─ [mediaType]/
│ └─ [imdbId]/
│ └─ page.tsx
components/
├─ PlayerFrame.tsx
├─ WatchLayout.tsx
├─ TvRemoteHints.tsx
lib/
├─ vidsrc.ts
├─ imdb.ts

yaml
Copy code

---

## 🔗 Embed Logic (Example)

```ts
buildVidsrcUrl({
  version: "v3",
  mediaType: "movie",
  id: "tt6263850",
  autoPlay: false,
  color: "#F5C400"
});
Keewacker handles URL construction, parameters, and safety.

📺 TV / Remote Support
⬆️⬇️⬅️➡️ Arrow navigation

⏎ Enter to select

⬅️ Backspace / Esc to go back

🟡 High-contrast focus rings

🔘 Large buttons & hit targets

Built for the couch 🛋️

🚀 Getting Started
bash
Copy code
npm install
npm run dev
Create .env.local:

env
Copy code
OMDB_API_KEY=your_key_here
NEXT_PUBLIC_VIDSRC_ORIGIN=https://vidsrc.cc
