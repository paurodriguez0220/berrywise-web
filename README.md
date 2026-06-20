# BerryWise

Expense-splitting PWA for small groups — log shared costs, split them equally or by custom amounts, and settle up. Designed to be installed on iPhone as a home screen app.

## Getting Started

**Prerequisites:** Node 20+, a [Turso](https://turso.tech) account (free tier).

```bash
git clone https://github.com/paurodriguez0220/berrywise-web.git
cd berrywise-web
npm install
cp .env.example .env.local   # fill in VITE_TURSO_URL and VITE_TURSO_TOKEN
npm run dev                  # http://localhost:5173/berrywise-web/
```

The PWA standalone gate (install instructions screen) is bypassed automatically in dev mode.

**Database setup (one-time):** See `docs/TURSO-SETUP.md` for step-by-step instructions using the Turso web dashboard.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:5173/berrywise-web/` |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run deploy` | Build then push `dist/` to the `gh-pages` branch |
| `npm run storybook` | Storybook component explorer at `http://localhost:6006` |
| `npm run lint` | Run ESLint |

## Architecture

Fully static React SPA — no backend. The browser talks directly to Turso (LibSQL SQLite cloud) over HTTP. Vite bakes the Turso credentials into the bundle at build time.

**Design patterns:**
- **Repository pattern** — `src/db/` isolates all SQL; features import named query functions and never write raw SQL outside that layer.
- **Feature-based folder structure** — `src/features/{members,expenses,balances,settle}/` each owns its hook and page component.
- **Module-level cache** — `getMembers()` caches for 10 s and invalidates on write; prevents redundant HTTP calls when multiple tabs load the same data.
- **PWA standalone gate** — `App.tsx` checks `display-mode: standalone` / `navigator.standalone`; shows an install screen when opened in a plain browser. Bypassed in dev via `import.meta.env.DEV`.

## Dependencies

| Dependency | Purpose |
|---|---|
| Turso (LibSQL) | Hosted SQLite database — stores members, expenses, splits |
| `@libsql/client` | HTTP client for Turso; runs in the browser, no server required |
| `vite-plugin-pwa` | Generates web manifest and Workbox service worker |

## Configuration

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|---|---|
| `VITE_TURSO_URL` | Turso database URL — `libsql://your-db.turso.io` |
| `VITE_TURSO_TOKEN` | Turso auth token |

These values are baked into the static bundle at build time. After rotating credentials, rebuild and redeploy.

## Links

- Live: https://paurodriguez0220.github.io/berrywise-web/
- Repo: https://github.com/paurodriguez0220/berrywise-web
- Standards: https://github.com/paurodriguez0220/standards-docs

---
*Maintained by paurodriguez0220 · Last updated: 2026-06-20*
*Standards: https://github.com/paurodriguez0220/standards-docs*
