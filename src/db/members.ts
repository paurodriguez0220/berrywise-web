import { db } from './client';
import type { Member } from '../types';

export async function getMembers(): Promise<Member[]> {
  const result = await db.execute('SELECT id, name FROM members ORDER BY name ASC');
  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}

export async function addMember(name: string): Promise<void> {
  await db.execute({ sql: 'INSERT INTO members (name) VALUES (?)', args: [name] });
}
