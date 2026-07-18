# Anime Recommender

A full-stack anime discovery app with:
- React 19 + Vite frontend
- Express 5 backend API
- JWT-based authentication and server-side watchlist persistence
- Server-side pagination, search, and genre filtering
- Data sync script that imports anime from Jikan into a local JSON dataset

## What Is Implemented

### Backend
- `GET /api/anime` — paginated, filterable anime list (query params: `page`, `limit`, `q`, `genre`)
- `GET /api/anime/:id` — single anime by numeric id
- `POST /api/auth/register` — creates user account, returns `{ user, token }`
- `POST /api/auth/login` — returns `{ user, token }` for valid credentials
- `GET /api/auth/me` — returns current user from JWT bearer token
- `GET /api/watchlist` — returns full anime objects for authenticated user's list
- `POST /api/watchlist` — adds anime to authenticated user's list
- `DELETE /api/watchlist/:id` — removes anime from authenticated user's list
- JWT auth middleware (`requireAuth`) protecting watchlist routes
- Rate limiting on auth endpoints (`express-rate-limit`)
- CORS scoped to `ALLOWED_ORIGIN` env var
- Port configurable via `PORT` env var
- `dotenv` loaded at entry point (`server.js`)

### Frontend
- Home page with server-side search (debounced 350ms), genre filter, and pagination
- Popular strip (top 5, unaffected by search/filter)
- Details page per anime
- Watchlist page synced to backend (optimistic updates with rollback)
- Login/Register page (`/auth`) — toggleable form, redirects to home on success
- `AuthContext` — handles login, register, logout, persists user + token in `localStorage`
- `WatchlistContext` consumes `AuthContext` — auto-fetches on login, clears on logout
- Navbar shows user name + logout button when signed in, or "Sign In" link when not
- Unauthenticated watchlist clicks redirect to `/auth` instead of silently failing
- Page transitions via Framer Motion

## Monorepo Structure

```txt
anime-recommender/
  backend/
    data/
      anime.json
      watchlists.json
    scripts/sync-anime.js
    src/
      app.js
      config/auth.config.js
      controllers/
        anime.controller.js
        auth.controller.js
        watchlist.controller.js
      middleware/
        auth.middleware.js
        error.middleware.js
        not-found.middleware.js
        rate-limit.middleware.js
      repositories/
        user.repository.js
      routes/
        anime.routes.js
        auth.routes.js
        watchlist.routes.js
      services/
        anime.service.js
        auth.service.js
        password.service.js
        token.service.js
        watchlist.service.js
    .env.example
    server.js
  frontend/
    src/
      components/
        AnimeCard.jsx
        Navbar.jsx
      context/
        AuthContext.jsx
        Watchlistcontent.jsx
      pages/
        Auth.jsx
        Home.jsx
        Details.jsx
        Watchlist.jsx
      services/
        api.js
  package.json
```

## Architecture Overview

### Frontend
- Built with React 19 + Vite
- Routing via `react-router-dom`
- API layer in `frontend/src/services/api.js`
- Watchlist state via `WatchlistContext` — syncs to backend, falls back gracefully if unauthenticated

Main UI flow:
1. `Home.jsx` fetches server-paginated anime on mount and on search/filter/page changes.
2. Search input debounces 350ms before triggering a network request.
3. Genre filter input narrows results server-side.
4. User can open a details page, add items to their server-side watchlist (requires login).

### Backend
- Built with Express 5
- `dotenv` initialised at `server.js` entry point
- Route/controller/service/repository separation
- In-memory user store (`user.repository.js`) — users lost on server restart (interim, pre-database)
- Watchlist persisted to `backend/data/watchlists.json`

Main API flow:
1. `GET /api/anime?page=1&limit=20&q=naruto&genre=action`
2. Controller extracts query params, passes to service.
3. Service filters and slices the JSON array, returns `{ data, meta }`.
4. `meta` includes `{ total, page, limit, hasNextPage }`.

Auth flow:
1. User registers or logs in via `/auth` page.
2. `AuthContext` calls `POST /api/auth/register` or `/login`, stores `token` and `user` in `localStorage`.
3. `WatchlistContext` reacts to `isAuthenticated` from `AuthContext` — fetches watchlist on login, clears on logout.
4. Protected routes require `Authorization: Bearer <token>` header.
5. `requireAuth` middleware verifies token and attaches `req.auth.sub` (user id).

## API Reference

### Anime

`GET /api/anime`
- Query params: `page` (default 1), `limit` (default 20, max 100), `q` (title search), `genre`
- Returns `{ data: [...], meta: { total, page, limit, hasNextPage } }`

`GET /api/anime/:id`
- Returns one anime object
- `400` if id is not a valid integer
- `404` if not found

### Auth

`POST /api/auth/register`
- Body: `{ name, email, password }` (password min 8 chars)
- Returns `{ user, token }`

`POST /api/auth/login`
- Body: `{ email, password }`
- Returns `{ user, token }`

`GET /api/auth/me`
- Requires `Authorization: Bearer <token>`
- Returns `{ user }`

### Watchlist (all require auth)

`GET /api/watchlist` — returns full anime objects for user's list

`POST /api/watchlist` — body: `{ animeId }`, returns 201

`DELETE /api/watchlist/:id` — returns 200

## Data Model

Each anime object includes:
- `id` (number, MAL id)
- `source`, `sourceId`
- `title`, `titleJapanese`
- `rating`
- `description`
- `genres` (string[])
- `image` (primary image URL)
- `images` (gallery URLs)
- `episodes`, `status`, `year`

## Setup and Run

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm

### Install dependencies

```bash
npm run install:all
```

### Environment configuration

Copy the example env file and fill in values:

```bash
cp backend/.env.example backend/.env
```

`backend/.env.example`:
```
PORT=5000
ALLOWED_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=change-me-in-production
JWT_ACCESS_EXPIRES_IN=1h
JWT_ISSUER=anime-recommender
JWT_AUDIENCE=anime-recommender-client
```

### Run in development

```bash
npm run dev
```

Starts both:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

Run individually:

```bash
npm run dev:backend
npm run dev:frontend
```

### Data Sync (Jikan -> Local JSON)

```bash
npm --prefix backend run sync:anime
```

Custom pages:

```bash
npm --prefix backend run sync:anime -- --pages=12
```

- Default pages: `8`, max: `40`, per-page: `25`
- 450ms delay between pages (rate-limit friendly)
- Deduplicates by anime id, filters entries with no image
- Writes to `backend/data/anime.json`

## Dependencies

### Root
- `concurrently` — run both apps together
- `nodemon` (dev)

### Backend
- `express` — HTTP server and routing
- `cors` — scoped CORS middleware
- `dotenv` — environment variable loading
- `jsonwebtoken` — JWT signing and verification
- `bcrypt` / `argon2` — password hashing
- `express-rate-limit` — auth endpoint rate limiting
- `nodemon` (dev)

### Frontend
- `react`, `react-dom`
- `react-router-dom`
- `framer-motion`
- `vite`, `eslint` (dev)

## Current Limitations

- User store is in-memory only — users are lost on server restart (no database yet)
- Watchlist persisted to JSON file — not suitable for concurrent writes at scale
- No automated tests
- No caching layer

## Remaining Roadmap

1. Move user store and watchlist to PostgreSQL
2. Add request validation (Zod)
3. Add structured logging (pino)
4. Add health check endpoint
5. Add unit and integration tests (Vitest + supertest)
6. Containerize with Docker
7. CI pipeline: lint + test + build on PRs
8. ML features: recommendation engine, semantic search, anime similarity
