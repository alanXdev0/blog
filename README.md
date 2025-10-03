# alananaya.dev • Personal Blog Platform

A modern, Apple-inspired personal blog for **alananaya.dev** featuring a minimalist public site and a secure back-office to publish content. The stack combines a Vite + React + TypeScript frontend with TailwindCSS styling and an Express + SQLite backend for content management.

## Project structure

```
├─ frontend/   # React application (Vite + TailwindCSS)
├─ server/     # Express API with SQLite persistence
└─ README.md   # This guide
```

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../server && npm install
   ```

2. **Configure environment variables**
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env

   # Backend
   cd ../server
   cp .env.example .env
   ```
   Update values as needed. Defaults assume the API runs on `http://localhost:4000` and the Vite app on `http://localhost:5173`.

3. **Seeded admin credentials**
   - Email: `alan@alananaya.dev`
   - Password: `buildgreatapps`

## Development workflow

In two terminals:

```bash
# Terminal 1 – API
cd server
npm run dev

# Terminal 2 – Frontend
cd frontend
npm run dev
```

- The backend starts on `http://localhost:4000` and seeds the database on first run.
- The frontend dev server runs on `http://localhost:5173` and connects to the API (CORS + cookies enabled).

## Production builds

```bash
# Frontend bundle
cd frontend
npm run build

# Backend build
cd ../server
npm run build
# Start compiled server
npm start
```

Static frontend assets live under `frontend/dist/`. Serve them through your preferred hosting or a CDN. The API outputs to `server/dist/`.

## Key features

- **Public site**
  - Hero with focused messaging and clean typography
  - Featured story and filterable post grid (Mobile, Apple, Projects, Reflections, etc.)
  - Portfolio page for projects and an About page with timeline and focus areas
- **Back office**
  - Email/password authentication with HTTP-only cookies
  - Dashboard metrics and quick actions
  - Post management (create, edit, publish/unpublish, tag assignment)
  - Markdown editor with live preview and hero image upload
  - Taxonomy manager for categories and tag palettes
  - Media library with file uploads stored locally under `server/uploads`

## Configuration notes

- Frontend mock data can be re-enabled by setting `VITE_USE_MOCK_DATA=true` in `frontend/.env`.
- Uploaded media is stored on disk (`server/uploads`) and recorded in the `media_assets` table.
- SQLite database lives at `server/data/blog.db`. Back it up or point to a different location by editing `server/src/db/client.ts`.

---

Happy shipping!
