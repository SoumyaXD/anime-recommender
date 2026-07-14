# Anime Recommender

A full-stack anime discovery app with:
- React + Vite frontend
- Express backend API
- Data sync script that imports anime from Jikan into a local JSON dataset
- Local watchlist persistence in browser storage

## Project Goals and What Is Already Done

This project currently implements:
- A working backend API with two endpoints:
  - `GET /api/anime` (list)
  - `GET /api/anime/:id` (details by numeric id)
- A frontend with:
  - Home page (popular strip + searchable browse grid)
  - Details page per anime
  - Watchlist page
  - Page transitions via Framer Motion
- Data ingestion from Jikan (`/v4/top/anime`) into `backend/data/anime.json`
- Basic error handling middleware in backend
- CORS enabled between frontend and backend in local development

## Monorepo Structure

```txt
anime-recommender/
  backend/
    data/anime.json
    scripts/sync-anime.js
    src/
      app.js
      routes/anime.routes.js
      controllers/anime.controller.js
      services/anime.service.js
      middleware/
  frontend/
    src/
      pages/
      components/
      context/
      services/api.js
  package.json (root orchestration scripts)
```

## Architecture Overview

### Frontend
- Built with React 19 + Vite
- Routing via `react-router-dom`
- API layer in `frontend/src/services/api.js`
- Watchlist state via `WatchlistContext` and `localStorage`

Main UI flow:
1. `Home.jsx` calls `fetchAnime()` on load.
2. Frontend requests `GET http://localhost:5000/api/anime` (or `VITE_API_BASE_URL` if set).
3. User can:
   - Search by title/genre text on client side.
   - Open details page (`/anime/:id`).
   - Add items to watchlist (stored locally in browser).

### Backend
- Built with Express 5
- App composition in `backend/src/app.js`
- Route/controller/service separation:
  - Routes: request mapping
  - Controllers: validation + response shaping
  - Services: data access from JSON file

Main API flow:
1. Route receives request (`/api/anime` or `/api/anime/:id`).
2. Controller validates inputs (id must be integer).
3. Service reads `backend/data/anime.json`.
4. JSON response returned to frontend.
5. Unknown routes -> `404 { "message": "Route not found" }`.
6. Unhandled errors -> `500 { "message": "Internal server error" }`.

## Frontend-Backend Linkage (How Data Is Brought to UI)

### Data source chain
1. `backend/scripts/sync-anime.js` fetches top anime from Jikan API.
2. Script maps and normalizes each record to app schema.
3. Script writes normalized array into `backend/data/anime.json`.
4. Backend service reads this file at request time.
5. Frontend fetches backend API and renders cards/details.

### API base URL
Frontend uses:
- `import.meta.env.VITE_API_BASE_URL` if provided
- fallback: `http://localhost:5000`

So in production/staging, set:
- `VITE_API_BASE_URL=https://your-api-domain`

### Current data model (normalized)
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

From repo root:

```bash
npm run install:all
```

This installs packages for:
- `backend/`
- `frontend/`

### Run apps in development

From repo root:

```bash
npm run dev
```

Starts both:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173` (Vite default)

Run individually:

```bash
npm run dev:backend
npm run dev:frontend
```

### Data Sync (Jikan -> Local JSON)

Default sync:

```bash
npm --prefix backend run sync:anime
```

Custom pages:

```bash
npm --prefix backend run sync:anime -- --pages=12
```

Script behavior:
- Default pages: `8`
- Max pages: `40`
- Per-page fetch limit: `25`
- Request delay between pages: `450ms` (basic rate-limit friendliness)
- Deduplicates by anime id
- Filters out entries with no primary image
- Writes final data to `backend/data/anime.json`

## Scripts Reference

### Root
- `npm run dev`: run frontend + backend together with `concurrently`
- `npm run dev:backend`: run backend only
- `npm run dev:frontend`: run frontend only
- `npm run install:all`: install backend and frontend deps

### Backend
- `npm run dev`: start backend with `nodemon`
- `npm run start`: start backend with `node`
- `npm run sync:anime`: fetch and refresh local anime dataset

### Frontend
- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: run ESLint

## Dependencies

### Root
- `concurrently`: run both apps in one command
- `nodemon` (dev): restart server on backend changes

### Backend
- `express`: HTTP server and routing
- `cors`: cross-origin access for frontend during development
- `nodemon` (dev): live reload for API server

### Frontend
- `react`, `react-dom`: UI runtime
- `react-router-dom`: routing/navigation
- `framer-motion`: route/page transition animation
- `vite`: build/dev tooling
- `eslint` and related plugins: linting

## Current Limitations

- Backend reads full JSON file on each request (fine for small/medium datasets, not ideal at scale).
- No pagination/filtering/sorting in API yet.
- No authentication/authorization.
- No automated tests currently configured.
- No caching layer.
- No database yet (JSON file storage only).
- Watchlist is client-side only (per browser, not user-account based).

## Scalability and Production Growth Plan

Use this as the next-step roadmap:

1. Data Layer
- Move from `anime.json` to a real DB (PostgreSQL recommended).
- Add schema indexes for title search, rating, year, genres.
- Keep sync job but upsert into DB instead of rewriting file.

2. API Contract
- Add pagination params (`page`, `limit`) to list endpoint.
- Add query filters (`genre`, `year`, `minRating`, `q`).
- Return paginated metadata (`total`, `hasNext`, etc.).

3. Performance
- Cache hot list responses (Redis or in-memory cache).
- Add response compression and HTTP caching headers.
- Consider precomputed "popular" slices for faster home loading.

4. Reliability
- Add request validation (e.g., Zod/Joi/celebrate).
- Add structured logging (pino/winston).
- Add health/readiness endpoints.
- Add retry/backoff around upstream sync fetching.

5. Frontend Scale
- Introduce request/state management for larger app complexity (TanStack Query or Redux Toolkit).
- Implement server-side pagination/infinite scrolling.
- Lazy-load routes/components for better bundle performance.

6. Security
- Tighten CORS policy per environment.
- Add rate limiting (`express-rate-limit`) to public endpoints.
- Add input sanitization where needed.

7. Quality and Delivery
- Add unit and integration tests for backend services/controllers.
- Add component/integration tests for frontend.
- Add CI pipeline: lint + test + build on pull requests.
- Containerize services for consistent deploy environments.

## Environment and Deployment Notes

- Frontend API endpoint should be configured via:
  - `VITE_API_BASE_URL`
- Backend auth tokens can be configured via:
  - `JWT_ACCESS_SECRET` (default: `dev-access-secret-change-me`)
  - `JWT_ACCESS_EXPIRES_IN` (default: `1h`)
  - `JWT_ISSUER` (default: `anime-recommender`)
  - `JWT_AUDIENCE` (default: `anime-recommender-client`)
- Backend port is currently fixed to `5000` in `backend/server.js` (recommended next change: use `process.env.PORT` with fallback).
- In production, serve frontend separately (static host/CDN) and run backend behind a reverse proxy/load balancer.

## Useful Endpoints (Current)

- `GET /api/anime`
  - Returns full local anime array.

- `GET /api/anime/:id`
  - Returns one anime object.
  - `400` if id is invalid.
  - `404` if id not found.

- `POST /api/auth/register`
  - Creates user account and returns `{ user, token }`.
  - Requires `name`, `email`, `password` (password min length 8).

- `POST /api/auth/login`
  - Returns `{ user, token }` for valid credentials.

- `GET /api/auth/me`
  - Returns current user from JWT bearer token.

## Suggested Next Implementation Tasks

1. Add backend pagination + filtering with query params.
2. Add test suite (Jest/Vitest + supertest for backend routes).
3. Move to database-backed persistence for growth.
4. Add environment variable support for backend port and CORS origin.
