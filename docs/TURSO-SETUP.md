# Turso Database Setup

One-time manual setup. Do this before deploying.

---

## Why manual?

The Turso CLI has no Windows binary. All steps below use the Turso web dashboard — no terminal required.

---

## Step 1 — Create a Turso account

1. Go to **https://turso.tech**
2. Click **Sign Up** — use GitHub or email
3. You'll land on the Turso dashboard

---

## Step 2 — Create the database

1. Click **"New database"**
2. Name it exactly: `berrywise`
3. Pick a region close to you (e.g. `us-east-1` or `eu-west-1`)
4. Click **"Create database"**

---

## Step 3 — Run the schema

1. Open your `berrywise` database from the dashboard
2. Click the **Shell** tab (terminal icon)
3. Paste and run each statement one at a time:

```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

```sql
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY,
  description TEXT,
  amount REAL,
  paid_by INTEGER REFERENCES members(id),
  created_at TEXT DEFAULT (datetime('now'))
);
```

```sql
CREATE TABLE expense_splits (
  id INTEGER PRIMARY KEY,
  expense_id INTEGER REFERENCES expenses(id),
  member_id INTEGER REFERENCES members(id),
  share REAL
);
```

4. Verify with:

```sql
.tables
```

You should see: `expense_splits`, `expenses`, `members`

---

## Step 4 — Get your database URL

1. In the dashboard, open your `berrywise` database
2. Click **Settings** (or the ⚙️ icon)
3. Copy the **Database URL** — it looks like:
   ```
   libsql://berrywise-paurodriguez0220.turso.io
   ```

---

## Step 5 — Create an auth token

1. Still in database Settings, find the **Tokens** section
2. Click **"Create token"**
3. Leave the expiry as **No expiration** (this is a personal app)
4. Copy the token — it's a long string starting with `ey...`

> **Keep this token private.** Never commit it to git. It is already covered by `*.local` in `.gitignore`.

---

## Step 6 — Create .env.local

Create a new file at:
```
C:\Users\paulo.rodriguez\Paulo\berrywise-web\.env.local
```

With this content (replace with your actual values):

```
VITE_TURSO_URL=libsql://berrywise-paurodriguez0220.turso.io
VITE_TURSO_TOKEN=eyJhbGci...your-full-token-here
```

---

## Step 7 — Done. Tell Claude to deploy.

Once `.env.local` is saved, come back and say **"deploy"**.

Claude will run `npm run deploy` and ship BerryWise to GitHub Pages.

---

## Backup (optional, anytime)

From the Turso dashboard Shell tab:

```sql
-- Check all members
SELECT * FROM members;

-- Check all expenses
SELECT * FROM expenses;

-- Check all splits
SELECT * FROM expense_splits;
```

To export a full dump: use the **Export** option in database Settings.
