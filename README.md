# Jobify

Search live jobs by role and city, filter by employment type, and click a card for a plain-English Gemini summary. Apply opens the listing in a new tab.

## Live

| | URL |
|---|---|
| App | [jobify-jade.vercel.app](https://jobify-jade.vercel.app) |
| API | [jobify.onrender.com](https://jobify.onrender.com) |

The API is on Render’s free plan. It sleeps when idle, so the **first search can take about a minute**. Opening the app pings `GET /api/health` to start waking the server.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Node.js + Express + TypeScript |
| Jobs | JSearch (RapidAPI) |
| AI | Google Gemini (one job per card click) |
| Database | None |
| Deploy | Vercel (frontend) + Render (API) |

## How a search works

```
SearchBar → Header → App → GET /api/jobs → jsearch → JobList
```

- Role + city become one query string (`developer in Miami`).
- Employment type is a separate query param (`FULLTIME`, `PARTTIME`, `CONTRACTOR`, `INTERN`, or `all`).
- Click a card (not Apply) for `POST /api/analyze`.

## Project structure

```
jobify/
├── client/                      # Vite React app (Vercel)
│   └── src/
│       ├── api/                 # fetch + wakeApi
│       ├── components/
│       └── types/               # re-exports server Job types
├── src/server/                  # Express API (Render)
│   ├── index.ts                 # env, middleware, /api/health
│   ├── routes/                  # jobs.ts, analyze.ts
│   ├── services/                # jsearch.ts, gemini.ts
│   └── types/                   # Job, JSearchJob, EmploymentType
├── .env.example
└── package.json                 # API scripts
```

## Getting started

### Prerequisites

- Node.js
- A [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) RapidAPI key
- A Google Gemini key (for card summaries)

### Backend

```bash
npm install
```

Copy `.env.example` to `.env` in the project root:

```env
JSEARCH_API_KEY=your_jsearch_key
GEMINI_API_KEY=your_gemini_key
PORT=3001
```

```bash
npm run build
npm start
```

API: `http://localhost:3001`. Rebuild after TypeScript changes (`npm run build` then `npm start`).

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

App: `http://localhost:5173`.

## What you can do in the UI

- Search by **role** and **city**
- Filter **employment type**, then Search
- Loading, failed (server asleep), and empty states
- Click a **card** for a Gemini summary (skills + salary if the model finds one)
- **Apply** opens the job without starting a summary

There is no salary filter. JSearch often leaves salary empty.

## API routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Wake ping. Returns `{ ok: true }`. |
| `GET` | `/api/jobs?query=...&employmentType=...` | JSearch listings. `employmentType` of `all` skips the type filter. |
| `POST` | `/api/analyze` | Gemini summary. Body: `{ title, description }`. |

## CI

On every push and pull request to `main`, GitHub Actions installs dependencies and builds the API and the client (`tsc` + Vite). It does not call JSearch or Gemini.

## Scripts

**Root (API)**

| Script | What it does |
|---|---|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled server |

**`client/`**

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production frontend build |

## License

ISC
