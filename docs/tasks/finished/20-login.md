# Task: Login Screen (PIN-based, no signup)

**Status:** Defined

## Goal

Add a shared PIN gate before the main app so only people who know the code can view or add transactions.

## Context

All users share one Turso database. Without a gate, anyone who installs the PWA (or has the URL) has full access. A shared PIN is sufficient for a small trusted group — no user accounts needed.

## Implementation Plan

### Step 1 — Auth hook

`src/auth/use-auth.ts`:
- Reads `isAuthenticated` from `localStorage` (key: `berrywise_auth`) on load
- Exposes `login(pin: string): boolean` — compares against `import.meta.env.VITE_APP_PIN`; returns `true` on match, sets `localStorage` + state
- Exposes `logout(): void` — clears `localStorage` + state

### Step 2 — LoginScreen component

`src/components/LoginScreen.tsx`:
- PIN input (type `password`, inputMode `numeric`), Submit button
- On wrong PIN: show error message, clear input
- On correct PIN: call `onSuccess` callback
- Storybook story: `LoginScreen.stories.ts` — Default, WrongPin states

### Step 3 — Wire into App.tsx

```tsx
const { isAuthenticated, login } = useAuth();

if (!import.meta.env.DEV && !isRunningStandalone()) return <GateScreen />;
if (!isAuthenticated) return <LoginScreen onSuccess={() => login(pin)} />;
return <Layout />;
```

### Step 4 — .env

Add to `.env.example`:
```
VITE_APP_PIN=
```

## Acceptance Criteria

- [ ] App shows login screen after the standalone gate, before the main layout
- [ ] Correct PIN grants access and persists across app restarts (localStorage)
- [ ] Wrong PIN shows an error, does not grant access
- [ ] `VITE_APP_PIN` env var validated at module load time
- [ ] Storybook story for LoginScreen (Default + WrongPin)

---
*Added: 2026-06-20*
