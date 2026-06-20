import { db } from './client';
import type { Member } from '../types';

let membersCache: { data: Member[]; ts: number } | null = null;
const CACHE_TTL_MS = 10_000;

export async function getMembers(): Promise<Member[]> {
  if (membersCache && Date.now() - membersCache.ts < CACHE_TTL_MS) {
    return membersCache.data;
  }
  const result = await db.execute('SELECT id, name FROM members ORDER BY name ASC');
  const data = result.rows.map((row) => ({ id: row.id as number, name: row.name as string }));
  membersCache = { data, ts: Date.now() };
  return data;
}

export function invalidateMembersCache(): void {
  membersCache = null;
}

export async function addMember(name: string): Promise<void> {
  await db.execute({ sql: 'INSERT INTO members (name) VALUES (?)', args: [name] });
  invalidateMembersCache();
}
