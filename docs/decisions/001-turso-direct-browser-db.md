# ADR-001: Turso (LibSQL) as a Direct Browser Database

**Date:** 2026-06-20
**Status:** Accepted

## Context

BerryWise needs to persist shared expense data across sessions and devices. Options considered:

| Option | Verdict |
|---|---|
| Backend API (Express/ASP.NET) + database | Adds hosting cost and operational complexity for a personal tool |
| `localStorage` / IndexedDB | Not shared across devices — each phone has its own data |
| Firebase / Supabase | Viable but heavyweight SDK, requires auth setup |
| Turso LibSQL HTTP client | SQLite-compatible, HTTP API callable from the browser, free tier sufficient |

## Decision

Use Turso (LibSQL) with `@libsql/client/http`. The client makes SQL calls directly from the browser to the Turso HTTP endpoint. Credentials (`VITE_TURSO_URL`, `VITE_TURSO_TOKEN`) are baked into the Vite static bundle at build time via `import.meta.env`.

## Consequences

**Easier:**
- Zero backend infrastructure — the app is fully static and deploys to GitHub Pages at no cost.
- Real SQL with a familiar SQLite dialect; schema is in `schema.sql` at the repo root.
- Free tier is sufficient for a small group with light write volume.

**Harder:**
- Credentials are in the client bundle. Acceptable for a personal/small group tool; treat the token as semi-public and use the most restrictive permission scope Turso allows.
- No server-side validation — all business logic runs in the browser.
- After rotating credentials a full rebuild and redeploy is required; there is no runtime injection on static hosting.
