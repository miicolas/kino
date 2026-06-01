<div align="center">

# Kino

**Your home cinema, anywhere.**

A self-hosted media server that turns a folder of movies into a private, Netflix-like streaming experience.

[Features](#features) · [Quick start](#quick-start) · [Architecture](#architecture) · [Roadmap](#roadmap) · [Contributing](#contributing)

</div>

---

## What is Kino?

Kino is a self-hosted media server, similar in spirit to Plex or Jellyfin, but built with a modern web stack and a premium design from day one.

You point Kino at a folder of movies on your Mac mini, PC, NAS or homelab, and it takes care of the rest:

- Scans your video files
- Fetches metadata, posters and backdrops from TMDb
- Detects external subtitles (`.srt`, `.vtt`) and converts them on the fly
- Streams playback through a modern web player
- Saves your progress so you can resume later
- Works locally, or remotely via an optional Cloudflare Tunnel

Your files stay on your machine. Kino is **not** a SaaS — there is no upload, no external cloud, no public catalog.

> **Positioning:** Plex for the plumbing, Netflix for the experience, Letterboxd / Mubi for the aesthetic.

## Features

### MVP (v0.1)

- **One-command install** via Docker Compose (PostgreSQL included)
- **First-run setup** with admin account creation and library configuration
- **Library scanner** for `.mp4`, `.mkv`, `.mov`, `.m4v`, `.webm`
- **TMDb metadata** — titles, synopses, genres, posters, backdrops
- **External subtitles** — auto-detected, language-parsed, SRT → WebVTT conversion
- **Direct play** for web-compatible files (MP4 / H.264 / AAC)
- **Resume playback** with automatic progress saving every 10 seconds
- **Continue watching**, **favorites**, **recently added**, **search**
- **Secure streaming routes** — every media route is authenticated
- **Premium UI** — dark, cinematic, immersive

### After MVP

- HLS / CMAF transcoding with FFmpeg for incompatible files (v0.2)
- Remote access via Cloudflare Tunnel and documented reverse proxy setups (v0.3)
- Full TV series support — seasons, episodes, next episode (v0.4)
- Collections, watchlist, stats, history, simple recommendations (v0.5)

## Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | [Bun](https://bun.sh) |
| Monorepo | [Turborepo](https://turbo.build) + Bun workspaces |
| Backend | Bun + [Hono](https://hono.dev) + [tRPC](https://trpc.io) |
| Frontend | [Next.js](https://nextjs.org) + React + Tailwind + shadcn/ui |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Better Auth](https://www.better-auth.com) |
| Video | FFmpeg + ffprobe |
| Streaming | Direct play (MVP) → HLS fMP4 / CMAF (v0.2+) |
| Player | [Shaka Player](https://shaka-player-demo.appspot.com/) (hls.js fallback) |
| Deployment | Docker Compose |
| Remote access | Cloudflare Tunnel (optional) + reverse proxy |

## Quick start

### Requirements

- Docker and Docker Compose
- A folder containing video files you legally own
- A free [TMDb API key](https://www.themoviedb.org/settings/api)

### 1. Clone and configure

```bash
git clone https://github.com/miicolas/kino.git
cd kino
cp .env.example .env
```

Edit `.env`:

```env
APP_URL=http://localhost:3000
SERVER_URL=http://localhost:3001

AUTH_SECRET=change-me-super-secret
DATABASE_URL=postgres://kino:kino@postgres:5432/kino

MEDIA_PATH=/absolute/path/to/your/movies

TMDB_API_KEY=your-tmdb-key
```

### 2. Launch

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000), create your admin account, point Kino at your library, and let it scan.

### Optional: remote access

Spin up the bundled Cloudflare Tunnel profile after setting `CLOUDFLARE_TUNNEL_TOKEN` in `.env`:

```bash
docker compose -f docker/docker-compose.yml --profile remote up -d
```

Reverse proxy setups (Caddy, Nginx, Traefik) are documented in [`apps/docs`](apps/docs).

## Folder layout for your media

Kino expects one folder per movie, with subtitles named alongside the video file:

```
/media/
  Drive (2011)/
    Drive (2011).mkv
    Drive (2011).fr.srt
    Drive (2011).en.srt
```

Supported subtitle naming:

```
Movie Name (2020).fr.srt
Movie Name (2020).en.vtt
Movie Name (2020).forced.fr.srt
```

## Architecture

```
kino/
├── apps/
│   ├── web        # Next.js — UI, player, settings
│   ├── server     # Bun + Hono + tRPC — API, scanner, streaming
│   └── docs       # Documentation site
│
├── packages/
│   ├── db         # Drizzle schema + client
│   ├── auth       # Better Auth config + helpers
│   ├── ui         # Shared design system
│   ├── media      # File detection, filename parsing, hashing
│   ├── ffmpeg     # ffprobe + transcoding wrappers
│   ├── metadata   # TMDb integration
│   ├── subtitles  # Detection, language parsing, SRT→VTT
│   ├── config     # Typed env loading
│   ├── validators # Zod schemas
│   ├── logger     # Structured logs
│   └── types      # Shared types / DTOs
│
├── tooling/       # eslint, typescript, tailwind configs
└── docker/        # Dockerfiles + docker-compose.yml
```

### Streaming routes

Video is never served over tRPC. Dedicated HTTP routes, all authenticated:

```
GET /video/:assetId/source
GET /stream/:assetId/master.m3u8
GET /stream/:assetId/:segment
GET /subtitles/:subtitleTrackId.vtt
GET /poster/:mediaId
GET /backdrop/:mediaId
```

### Scan pipeline

```
scan folder → detect video → ffprobe → hash → create media_file
            → parse filename → TMDb lookup → media_item + artwork
            → detect subtitles → SRT→VTT → subtitle_tracks
            → check direct-play compatibility → video_asset
```

## Development

```bash
bun install
bun run dev          # starts web + server + docs
bun run db:migrate
bun run db:studio
bun run typecheck
bun run lint
```

Workspaces are managed by Bun; tasks are orchestrated by Turborepo. Persistent processes (`dev`, `db:studio`) are configured in [`turbo.json`](turbo.json).

## Roadmap

| Version | Theme | Highlights |
| --- | --- | --- |
| **v0.1** | MVP self-host | Docker, scanner, TMDb, subtitles, direct play, progress, favorites |
| **v0.2** | Robust playback | HLS transcoding, Shaka Player, compatibility detection |
| **v0.3** | Remote access | Cloudflare Tunnel, reverse proxy docs, signed URLs |
| **v0.4** | TV series | Seasons, episodes, next episode, continue series |
| **v0.5** | Premium experience | Collections, watchlist, moods, stats |
| **v1.0** | Stable | Backup/restore, user management, polished UI |

## Security model

- Authentication is mandatory; sessions are HTTP-only.
- No media file is ever publicly served — every streaming and subtitle route checks the session.
- The first user created becomes admin; public registration is disabled afterwards.
- Signed, expiring playback URLs and rate limiting are on the roadmap.

## Legal

Kino is designed to organize and play content that **you legally own or are allowed to host**. It does **not** include:

- scraping of pirated content
- public catalogs of copyrighted material
- download tools for protected media
- public sharing of content you do not own

What you put in your media folder is your responsibility.

## Contributing

Kino is open source and contributions are welcome. Before opening a PR:

- Keep the stack as-is: Bun, Turborepo, PostgreSQL, Drizzle, Better Auth.
- Don't move video through tRPC — use the dedicated HTTP routes.
- Treat subtitles as a core feature, not an add-on.
- Preserve the self-hosted, local-first philosophy.

Open an issue first for anything non-trivial so we can align on scope.

## License

To be defined. Suggested: AGPL-3.0 or MIT — pick one before the first public release.

---

<div align="center">

Built with care for people who still believe their movie collection deserves a beautiful home.

</div>
