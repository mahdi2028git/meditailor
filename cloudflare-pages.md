# Deploy MediTailor to Cloudflare Pages

## Why builds failed before

- Do **not** use Framework preset **Jekyll** (build command `npx bundle exec jekyll build` fails).
- Do **not** use Angular preset unless you run `npm run build` in `frontend/`.
- Wrangler must point at a folder that exists after the (empty) build.

## Correct settings (static multi-language site)

| Setting | Value |
|---------|--------|
| Framework preset | **None** |
| Root directory | empty (repo root) |
| Build command | **leave empty** |
| Build output directory | `site` |

Static files live in `site/` (`index.html`, `css/`, `js/`).

## CLI

```bash
npx wrangler pages deploy site --project-name=meditailor
```

## Python API

FastAPI does not run on Pages. Host `backend/` on Railway/Render if you need `/api`.
