# Jobify

Single-page AI-powered job finder. Pulls real listings from JSearch and uses Google Gemini to summarize each posting so users can quickly find and open relevant opportunities.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Node.js + Express + TypeScript |
| AI | Google Gemini API |
| Jobs data | JSearch API (RapidAPI) |
| Database | None |
| Deploy | Vercel (frontend) + Render (backend) |

## Current Project Structure

```
jobify/
|── client/ 
├── src/         
│   └── server/          
├── public/
├── dist/                
├── .env                
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Getting started

### Prerequisites

- Node.js 
- API keys for JSearch (RapidAPI) and Google Gemini

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

```env
JSEARCH_API_KEY=your_jsearch_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
PORT=3001
VITE_API_URL=http://localhost:3001
```

### Run the backend

```bash
npm run build
npm start
```

Server runs at `http://localhost:3001`.

> After TypeScript changes, run `npm run build` again before `npm start`.

## API routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs?query=...&type=...` | Fetch job listings from JSearch |
| `POST` | `/api/analyze` | Summarize a job with Gemini (`title`, `description`) |

## Scripts

| Script | What it does |
|---|---|
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run the compiled server |

## License

ISC
