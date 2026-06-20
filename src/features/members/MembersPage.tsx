import React, { useState } from 'react';
import { useMembers } from './use-members';

export function MembersPage(): React.JSX.Element {
  const { members, isLoading, error, add } = useMembers();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [addError, setAddError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setAddError(undefined);
    try {
      await add(name);
      setName('');
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-6 pb-4">
      <h1 className="text-xl font-semibold text-gray-900">Members</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a member…"
          className="flex-1 min-h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          disabled={isSaving}
        />
        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="min-h-11 min-w-11 rounded-xl bg-red-500 px-4 text-sm font-medium text-white active:scale-95 transition disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {(error ?? addError) && <p className="text-sm text-red-500">{error ?? addError}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No members yet. Add one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center min-h-14 rounded-xl bg-white border border-gray-100 px-4 shadow-sm"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-semibold mr-3">
                {member.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-gray-900 text-sm font-medium">{member.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
