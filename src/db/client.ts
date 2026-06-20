import { createClient, type Client } from '@libsql/client/http';

const url = import.meta.env.VITE_TURSO_URL as string | undefined;
const authToken = import.meta.env.VITE_TURSO_TOKEN as string | undefined;

if (!url || !authToken) {
  throw new Error(
    'Missing VITE_TURSO_URL or VITE_TURSO_TOKEN — copy .env.example to .env.local and fill in your Turso credentials.',
  );
}

export const db: Client = createClient({ url, authToken });
