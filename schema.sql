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
