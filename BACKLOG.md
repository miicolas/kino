# Kino — Backlog

État basé sur le code actuel + cahier des charges MVP.

> **Stack actuelle :** Elysia + Eden (à la place de Hono + tRPC mentionné dans le CDC).
> Si tu veux rester sur Elysia/Eden, c'est cohérent — sinon, migrer maintenant avant de construire le reste.

---

## Légende

- ✅ Fait
- 🔄 En cours / partiel
- ⬜ À faire

---

## Sprint 1 — Fondation

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 1.1 | Monorepo Turborepo + Bun workspaces | ✅ | |
| 1.2 | `apps/web` (Next.js 16, Tailwind 4, shadcn) | ✅ | |
| 1.3 | `packages/ui` avec shadcn/ui | ✅ | Composants de base présents |
| 1.4 | `packages/typescript-config` | ✅ | |
| 1.5 | Biome configuré | ✅ | `ultracite` + `biome.jsonc` |
| 1.6 | `.env.example` | ✅ | |
| 1.7 | `docker/docker-compose.yml` avec PostgreSQL | ✅ | |
| 1.8 | Better Auth client (`auth-client.ts`) | ✅ | |
| 1.9 | TanStack Query provider | ✅ | |
| 1.10 | **`apps/server` — app Bun standalone** | ⬜ | Actuellement un stub dans `apps/web/server/` |
| 1.11 | **`packages/db` — schéma Drizzle complet** | ⬜ | `packages/contract` supprimé, à recréer proprement |
| 1.12 | **`packages/auth` — config Better Auth serveur** | ⬜ | Côté client présent, côté serveur manquant |
| 1.13 | **`packages/config` — chargement `.env` typé** | ⬜ | |
| 1.14 | **`packages/logger` — logs structurés** | ⬜ | |
| 1.15 | **Migrations Drizzle fonctionnelles** | ⬜ | |
| 1.16 | **Page `/setup` — création compte admin** | ⬜ | |
| 1.17 | **Page `/login`** | ⬜ | |
| 1.18 | **Route santé `GET /health`** | ⬜ | |

---

## Sprint 2 — Bibliothèque

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 2.1 | Table `libraries` + migration | ⬜ | |
| 2.2 | Table `media_files` + migration | ⬜ | |
| 2.3 | Table `media_items` + migration | ⬜ | |
| 2.4 | **`packages/media`** — détection `.mp4/.mkv/.mov/.m4v/.webm` | ⬜ | |
| 2.5 | **`packages/media`** — parsing noms de fichiers (titre, année) | ⬜ | |
| 2.6 | **`packages/media`** — hash fichiers | ⬜ | |
| 2.7 | **`packages/ffmpeg`** — wrapper `ffprobe` | ⬜ | |
| 2.8 | **`packages/ffmpeg`** — détection compatibilité direct play | ⬜ | |
| 2.9 | Route tRPC/Elysia `library.create` | ⬜ | |
| 2.10 | Route tRPC/Elysia `library.scan` | ⬜ | |
| 2.11 | Pipeline de scan complet (dossier → `media_file`) | ⬜ | cf. §16 CDC |
| 2.12 | Page `/settings/libraries` — ajouter une bibliothèque | ⬜ | |
| 2.13 | Page `/library` — grille des films | ⬜ | |

---

## Sprint 3 — Métadonnées

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 3.1 | **`packages/metadata`** — intégration TMDb | ⬜ | `searchMovie`, `getMovieDetails` |
| 3.2 | **`packages/metadata`** — téléchargement poster/backdrop | ⬜ | stockage dans `/cache` |
| 3.3 | Table `media_metadata`, `genres`, `media_genres` | ⬜ | |
| 3.4 | Intégrer metadata dans pipeline de scan | ⬜ | étapes 7-10 du pipeline |
| 3.5 | Route `GET /poster/:mediaId` | ⬜ | route sécurisée |
| 3.6 | Route `GET /backdrop/:mediaId` | ⬜ | route sécurisée |
| 3.7 | Route `media.byId` | ⬜ | |
| 3.8 | Page `/movie/[id]` — détail film | ⬜ | backdrop, poster, genres, synopsis, bouton Play |
| 3.9 | Page `/home` — Netflix-like | ⬜ | Hero, récemment ajoutés |
| 3.10 | Page `/search` | ⬜ | |
| 3.11 | Route `media.manualMatch` — correction TMDb | ⬜ | |

---

## Sprint 4 — Sous-titres

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 4.1 | **`packages/subtitles`** — détection `.srt`/`.vtt` | ⬜ | |
| 4.2 | **`packages/subtitles`** — parsing langue depuis le nom du fichier | ⬜ | ex: `Drive.fr.srt` → `fr` |
| 4.3 | **`packages/subtitles`** — conversion SRT → WebVTT | ⬜ | sortie dans `/cache/subtitles/` |
| 4.4 | Table `subtitle_tracks` | ⬜ | |
| 4.5 | Intégrer sous-titres dans pipeline de scan | ⬜ | étapes 11-13 du pipeline |
| 4.6 | Route sécurisée `GET /subtitles/:subtitleTrackId.vtt` | ⬜ | vérification session obligatoire |
| 4.7 | Route `subtitles.listForMedia` | ⬜ | |
| 4.8 | Route `subtitles.setDefault` | ⬜ | |

---

## Sprint 5 — Lecture vidéo

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 5.1 | Table `video_assets` | ⬜ | |
| 5.2 | Table `watch_progress` | ⬜ | |
| 5.3 | Table `favorites` | ⬜ | |
| 5.4 | Route sécurisée `GET /video/:assetId/source` | ⬜ | direct play |
| 5.5 | Route `media.getPlayback` — retourne `PlaybackResponse` | ⬜ | url + subtitles + progress |
| 5.6 | Composant player web (Shaka Player ou `<video>` natif MVP) | ⬜ | play/pause, fullscreen, timeline, raccourcis |
| 5.7 | Affichage sous-titres dans player (`<track>`) | ⬜ | |
| 5.8 | Route `progress.update` — sauvegarde toutes les 10s | ⬜ | |
| 5.9 | Route `progress.markCompleted` — marquage à 90% | ⬜ | |
| 5.10 | Page `/watch/[id]` | ⬜ | fullscreen, sans chrome |
| 5.11 | Route `favorites.toggle` / `favorites.list` | ⬜ | |
| 5.12 | Section "Continuer à regarder" sur `/home` | ⬜ | |
| 5.13 | Section "Favoris" sur `/home` | ⬜ | |

---

## Sprint 6 — Self-host propre

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 6.1 | `docker/Dockerfile.server` — build production | ⬜ | |
| 6.2 | `docker/Dockerfile.web` — build production | ⬜ | |
| 6.3 | `docker-compose.yml` — service `migrate` propre | 🔄 | Présent mais pointe sur `@repo/contract` supprimé |
| 6.4 | README — installation, Docker, variables d'env | 🔄 | Présent mais incomplet (pas de guide install étape par étape) |
| 6.5 | `packages/logger` — logs scanner + player + ffmpeg | ⬜ | |
| 6.6 | Page `/settings` — général (nom serveur, URL) | ⬜ | |
| 6.7 | Page `/settings/subtitles` | ⬜ | langue par défaut, auto-activation |
| 6.8 | Page `/settings/remote-access` | ⬜ | local / Cloudflare Tunnel / reverse proxy |
| 6.9 | Documentation Cloudflare Tunnel + Caddy/Nginx | ⬜ | dans `apps/docs` ou README |
| 6.10 | Tests de bout-en-bout du flux complet (critères §26 CDC) | ⬜ | |

---

## Sprint 7 — HLS / Transcodage (v0.2)

| # | Tâche | État | Notes |
|---|-------|------|-------|
| 7.1 | **`packages/ffmpeg`** — `transcodeToHls()` | ⬜ | sortie fMP4/CMAF |
| 7.2 | Table `jobs` pour job queue | ⬜ | |
| 7.3 | Job runner (`jobs/job-runner.ts`) | ⬜ | |
| 7.4 | Job `scan.job.ts` | ⬜ | |
| 7.5 | Job `transcode.job.ts` | ⬜ | |
| 7.6 | Route `GET /stream/:assetId/master.m3u8` | ⬜ | |
| 7.7 | Route `GET /stream/:assetId/:segment` | ⬜ | |
| 7.8 | Player Shaka Player — lecture HLS | ⬜ | |
| 7.9 | Affichage statut "Processing…" sur page film | ⬜ | |
| 7.10 | Page `/settings/playback` — qualité, transcodage | ⬜ | |

---

## Packages à créer (résumé)

| Package | Priorité | Description |
|---------|----------|-------------|
| `packages/db` | 🔴 Sprint 1 | Schéma Drizzle, client DB, migrations |
| `packages/auth` | 🔴 Sprint 1 | Config Better Auth serveur |
| `packages/config` | 🔴 Sprint 1 | Chargement `.env` typé |
| `packages/logger` | 🟡 Sprint 1-2 | Logs structurés |
| `packages/types` | 🟡 Sprint 2 | DTOs partagés |
| `packages/validators` | 🟡 Sprint 2 | Zod schemas |
| `packages/media` | 🔴 Sprint 2 | Détection, parsing, hash |
| `packages/ffmpeg` | 🔴 Sprint 2 | ffprobe + transcodage |
| `packages/metadata` | 🔴 Sprint 3 | TMDb |
| `packages/subtitles` | 🔴 Sprint 4 | SRT→VTT, parsing langue |

---

## Ordre recommandé pour commencer maintenant

```
1. Décider : rester sur Elysia/Eden ou migrer vers Hono/tRPC ?
2. Créer apps/server (Bun standalone, séparé de apps/web)
3. Créer packages/db (schéma Drizzle : users, libraries, media_items, media_files, video_assets, subtitle_tracks, watch_progress, favorites, settings, jobs)
4. Créer packages/auth (Better Auth côté serveur)
5. Créer packages/config
6. Lancer Docker Compose local + migrations
7. Page /setup + /login
8. packages/media + packages/ffmpeg (ffprobe)
9. Pipeline de scan
10. packages/metadata (TMDb)
11. Pages /home, /library, /movie/[id]
12. packages/subtitles
13. Route streaming + player
14. Progression + favoris
15. Docker production + README
```
