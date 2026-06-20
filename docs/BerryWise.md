# BerryWise

A lightweight expense-splitting PWA built with React and Turso. Track shared expenses, split costs, and settle up — accessible from any browser or pinned to your iPhone home screen.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Styling | Tailwind CSS v4 |
| Database | Turso (LibSQL / SQLite in the cloud) |
| Hosting | GitHub Pages (fully static) |
| PWA | vite-plugin-pwa |

---

## Features

- Add members to a group
- Log expenses (who paid, how much, for what)
- Split costs equally or by custom amounts
- View balances (who owes whom)
- Settle up

---

## Database Schema

```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  description TEXT,
  amount REAL,
  paid_by INTEGER REFERENCES members(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE expense_splits (
  id INTEGER PRIMARY KEY,
  expense_id INTEGER REFERENCES expenses(id),
  member_id INTEGER REFERENCES members(id),
  share REAL
);
```

Schema file: `schema.sql` at the repo root.

---

## Project Structure

```
berrywise-web/
├── public/
│   └── icons/
│       └── apple-touch-icon.png
├── src/
│   ├── db/                    (Turso query layer)
│   │   ├── client.ts
│   │   ├── members.ts
│   │   ├── expenses.ts
│   │   └── splits.ts
│   ├── features/
│   │   ├── members/
│   │   ├── expenses/
│   │   ├── balances/
│   │   └── settle/
│   ├── components/
│   │   ├── GateScreen.tsx
│   │   ├── BottomNav.tsx
│   │   └── Layout.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── docs/
│   └── BerryWise.md           (this file)
├── schema.sql
├── .env.example
├── vite.config.ts
└── tsconfig.json
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Turso credentials:

```
VITE_TURSO_URL=libsql://your-db.turso.io
VITE_TURSO_TOKEN=your-auth-token
```

Never commit `.env.local`.

---

## Database Setup (one-time)

```bash
turso db create berrywise
turso db shell berrywise < schema.sql
turso db show berrywise           # copy the URL
turso db tokens create berrywise  # copy the auth token
```

---

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/berrywise/`.

The mobile-only gate is active in the browser — to bypass it during development, temporarily comment out the standalone check in `App.tsx`.

---

## Deployment

```bash
npm run build
npm run deploy   # pushes dist/ to gh-pages branch via gh-pages package
```

Live at: `https://paurodriguez0220.github.io/berrywise-web/`

---

## Database Backup

```bash
# SQL dump
turso db shell berrywise .dump > backup.sql

# Local SQLite file
turso db shell berrywise .dump | sqlite3 berrywise_backup.db
```

---

## iPhone Home Screen (PWA)

BerryWise is designed as an installed PWA. When launched from the home screen it runs fullscreen with no browser chrome.

**To install on iPhone:** Open in Safari → Share → Add to Home Screen.

The app detects standalone mode and shows an install instructions screen (`GateScreen`) when opened directly in a browser.

---

## Security Note

The Turso auth token is used client-side. For personal or small group use this is acceptable. Use a read-scoped token where possible and avoid storing sensitive data.
