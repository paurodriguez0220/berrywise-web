# BerryWise — Build Checklist

Track progress by checking off tasks as they are completed.

---

## Phase 1 — Project Setup

- [x] **#2** Scaffold Vite + React + TypeScript project
  - `npm create vite@latest berrywise-web -- --template react-ts`
  - Verify `npm run dev` boots cleanly

- [x] **#3** Install and configure dependencies *(blocked by #2)*
  - `npm install -D tailwindcss @tailwindcss/vite`
  - `npm install @libsql/client`
  - `npm install -D gh-pages vite-plugin-pwa`
  - Add `@import "tailwindcss";` to `src/index.css`

- [x] **#4** Configure `vite.config.ts` *(blocked by #3)*
  - Set `base: '/berrywise/'`
  - Add Tailwind Vite plugin
  - Add VitePWA plugin with manifest (name, theme_color `#e63946`, display `standalone`)

- [x] **#5** Configure `tsconfig.json` and `index.html` *(blocked by #3)*
  - Verify `"strict": true` in tsconfig
  - Add Apple PWA meta tags (apple-touch-icon, apple-mobile-web-app-capable, title, status-bar-style)
  - Set `viewport-fit=cover` in meta viewport for iPhone 15+ safe area support
  - Add `<link rel="manifest">` to index.html

- [x] **#6** Set up environment variables *(blocked by #2)*
  - Create `.env.example` with `VITE_TURSO_URL=` and `VITE_TURSO_TOKEN=`
  - Add `.env.local` to `.gitignore`

---

## Phase 2 — Database

- [x] **#7** Create Turso database and run schema *(can do anytime)*
  ```bash
  turso db create berrywise
  turso db shell berrywise < schema.sql
  turso db show berrywise           # copy URL → .env.local
  turso db tokens create berrywise  # copy token → .env.local
  ```
  - Create `schema.sql` at repo root (members, expenses, expense_splits tables)

- [x] **#8** Implement `src/types/index.ts` *(blocked by #2)*
  - `Member`, `Expense`, `Split`, `Balance` interfaces
  - Named exports only, no `any`

- [x] **#9** Implement Turso client `src/db/client.ts` *(blocked by #3, #6, #7)*
  - Single `db` export via `createClient` from `@libsql/client/http`
  - Reads `VITE_TURSO_URL` and `VITE_TURSO_TOKEN` from `import.meta.env`

- [x] **#10** Implement DB query layer `src/db/` *(blocked by #8, #9)*
  - `members.ts` → `getMembers`, `addMember`
  - `expenses.ts` → `getExpenses`, `addExpense`
  - `splits.ts` → `getSplitsForExpense`, `addSplits`
  - Named exports only, no business logic

---

## Phase 3 — Features

- [x] **#11** Build Members feature *(blocked by #10)*
  - `src/features/members/use-members.ts` — fetch hook with loading + refetch
  - `MembersPage.tsx` — list + add member form
  - Mobile-first Tailwind layout, 44px min touch targets

- [x] **#12** Build Expenses feature *(blocked by #10)*
  - `use-expenses.ts`, `ExpensesPage.tsx`, `AddExpenseModal.tsx`
  - Bottom sheet modal (slides up from bottom on mobile)
  - Split type: Equal (auto-divide) or Custom (per-member inputs)
  - FAB (floating action button) to open modal

- [x] **#13** Build Balances feature *(blocked by #10)*
  - `use-balances.ts` — net per member = paid − owed (pure derivation, no DB write)
  - `BalancesPage.tsx` — green (owed to them) / red (owes) per person

- [x] **#14** Build Settle Up feature *(blocked by #10)*
  - `SettlePage.tsx` — shows who owes whom
  - "Mark Settled" inserts an expense: `description = "Settlement: debtor → creditor"`, `paid_by = debtor`, single split for creditor

---

## Phase 4 — App Shell & PWA

- [x] **#15** Build App shell *(blocked by #11, #12, #13, #14)*
  - `GateScreen.tsx` — install instructions when not in standalone mode
  - `BottomNav.tsx` — fixed bottom 4-tab bar, `pb-[env(safe-area-inset-bottom)]` for home indicator
  - `Layout.tsx` — wraps pages with safe area padding
  - `App.tsx` — standalone gate check + tab routing

- [ ] **#16** Add PWA icon asset *(blocked by #2)*
  - Place 180×180px PNG at `public/icons/apple-touch-icon.png`
  - Berry-themed preferred; iOS applies rounded corners automatically

---

## Phase 5 — Ship

- [x] **#17** Create GitHub repo and push initial commit *(blocked by #15)*
  - Create `paurodriguez0220/berrywise-web` on GitHub
  - Remote: `https://github.com/paurodriguez0220/berrywise-web.git`
  - Push `main` branch

- [ ] **#18** Deploy to GitHub Pages *(blocked by #4, #15, #16, #17)*
  ```bash
  npm run build
  npm run deploy
  ```
  - Enable Pages in repo settings (source: `gh-pages` branch)
  - Verify live at `https://paurodriguez0220.github.io/berrywise/`

- [ ] **#19** Test PWA install on iPhone *(blocked by #18)*
  - Open in Safari → Share → Add to Home Screen
  - Launch from icon: no URL bar, gate screen gone, all 4 tabs work
  - Add a member, log an expense, check balances, settle up

---

## Quick Reference

| | |
|---|---|
| Live URL | `https://paurodriguez0220.github.io/berrywise/` |
| Repo | `https://github.com/paurodriguez0220/berrywise-web` |
| DB | Turso · `berrywise` |
| Stack | Vite + React + TypeScript + Tailwind + @libsql/client |
| Deploy | `npm run deploy` (gh-pages) |
