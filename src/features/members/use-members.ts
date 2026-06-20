import { useCallback, useEffect, useState } from 'react';
import { getMembers, addMember } from '../../db/members';
import type { Member } from '../../types';

interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  error: string | undefined;
  add: (name: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useMembers(): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(undefined);
    try {
      setMembers(await getMembers());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const add = useCallback(
    async (name: string): Promise<void> => {
      await addMember(name.trim());
      await refetch();
    },
    [refetch],
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { members, isLoading, error, add, refetch };
}
