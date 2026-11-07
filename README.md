# MediTailor — Hospital Clothing Factory

Full-stack website: **Angular 19** frontend + **FastAPI** backend.

Multi-language: English · Farsi (فارسی) · Arabic · Turkish — with RTL support.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Start API (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python3 -m uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Start frontend (Angular)

```bash
cd frontend
npm install
npm start
```

Opens http://localhost:4200 (proxies `/api` to FastAPI).

## Languages

EN / فا / ع / TR buttons in the header. Farsi and Arabic use RTL.

## Deploy

See `cloudflare-pages.md`. FastAPI needs a Python host (Railway, Render, Fly.io).
