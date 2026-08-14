# Jobify

Job search UI that pulls live listings from JSearch. Search by role and city, filter by employment type, and browse results as cards.

Gemini is wired on the server (`POST /api/analyze`) but the cards currently show a clamped JSearch description, not an auto-summary.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Node.js + Express + TypeScript |
| Jobs data | JSearch API (RapidAPI) |
| AI | Google Gemini API (analyze route; optional) |
| Database | None |
| Deploy (planned) | Vercel (frontend) + Render (backend) |

## Project structure

```
jobify/
├── client/                 # Vite React app
│   └── src/
│       ├── api/
│       ├── components/
│       └── types/
├── src/server/             # Express API
│   └── services/           # jsearch.ts, gemini.ts
├── .env.example
├── package.json            # backend
└── README.md
```

## Getting started

### Prerequisites

- Node.js
- A [JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) RapidAPI key
- Optional: a Google Gemini key (only for `/api/analyze`)

### Backend

```bash
npm install
```

Copy `.env.example` to `.env` in the project root:

```env
JSEARCH_API_KEY=your_jsearch_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
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

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

App: `http://localhost:5173`.

## What you can do in the UI

- Search by **role** and **city** (city is appended as `role in city` for JSearch)
- Choose **employment type** (All, Full-time, Part-time, Contract, Internship) and click Search — the API sends JSearch `employment_types` (`FULLTIME`, etc.)
- Loading spinner, empty copy, and a results panel under the header
- Open **Apply** on a card (new tab)

Salary on listings is often missing from JSearch, so there is no salary filter yet.

## API routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs?query=...&employmentType=...` | Job listings from JSearch. `employmentType` is optional (`all` omits the JSearch type filter). |
| `POST` | `/api/analyze` | Gemini summary (`title`, `description` in the JSON body) |

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
