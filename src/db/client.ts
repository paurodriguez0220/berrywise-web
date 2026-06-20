import { createClient, type Client } from '@libsql/client/http';

export const db: Client = createClient({
  url: import.meta.env.VITE_TURSO_URL as string,
  authToken: import.meta.env.VITE_TURSO_TOKEN as string,
});
