# Jobify

[![CI](https://github.com/Dtzul04/Jobify/actions/workflows/ci.yml/badge.svg)](https://github.com/Dtzul04/Jobify/actions/workflows/ci.yml)

Search live jobs by role and city, filter by employment type, and click a card for a plain-English Gemini summary. Apply opens the listing in a new tab.

## Live

[jobify-jade.vercel.app](https://jobify-jade.vercel.app)

The frontend and API run as one Next.js app on Vercel.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| API | Next.js route handlers (`src/app/api`) |
| Jobs | JSearch (RapidAPI) |
| AI | Google Gemini (one job per card click) |
| Deploy | Vercel |

## How a search works

```
SearchBar → Header → page.tsx → GET /api/jobs → jsearch → JobList
```

- Role + city become one query string (`developer in Miami`).
- Employment type is a separate query param (`FULLTIME`, `PARTTIME`, `CONTRACTOR`, `INTERN`, or `all`).
- Click a card (not Apply) for `POST /api/analyze`.

## Project structure

```
jobify/
├── src/
│   ├── app/
│   │   ├── page.tsx             # Home page: search state + results
│   │   ├── layout.tsx           # Root layout, Poppins font, metadata
│   │   ├── globals.css          # Tailwind import
│   │   └── api/
│   │       ├── jobs/route.ts    # GET /api/jobs
│   │       └── analyze/route.ts # POST /api/analyze
│   ├── components/              # Header, SearchBar, FilterPanel, JobCard, JobList
│   ├── lib/
│   │   ├── fetchJobs.ts         # Browser fetch helpers for /api/*
│   │   ├── jsearch.ts           # JSearch API call (server only)
│   │   └── gemini.ts            # Gemini API call (server only)
│   └── types/                   # Job, JSearchJob, AIAnalysis, EmploymentType
├── .env.example
└── package.json
```

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- A [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) RapidAPI key
- A Google Gemini key (for card summaries)

### Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` in the project root:

```env
JSEARCH_API_KEY=your_jsearch_key
GEMINI_API_KEY=your_gemini_key
```

```bash
npm run dev
```

App and API: `http://localhost:3000`.

The keys are only read on the server, so they never reach the browser.

## What you can do in the UI

- Search by **role** and **city**
- Filter **employment type**, then Search
- Loading, failed, and empty states
- Click a **card** for a Gemini summary (skills + salary if the model finds one)
- **Apply** opens the job without starting a summary

There is no salary filter. JSearch often leaves salary empty.

## API routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs?query=...&employmentType=...` | JSearch listings. `employmentType` of `all` skips the type filter. |
| `POST` | `/api/analyze` | Gemini summary. Body: `{ title, description }`. |

## Deploy

Vercel builds from `main`. In the Vercel project settings, set the Framework Preset to **Next.js**, leave Root Directory empty, and add `JSEARCH_API_KEY` and `GEMINI_API_KEY` under Environment Variables.

## CI

On every push and pull request to `main`, GitHub Actions installs dependencies, runs ESLint, and runs a production build. It does not call JSearch or Gemini.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## License

ISC
