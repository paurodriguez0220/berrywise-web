import { useCallback, useState } from 'react';

const STORAGE_KEY = 'berrywise_auth';
const PIN = import.meta.env.VITE_APP_PIN as string | undefined;

interface UseAuthResult {
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  // If no PIN is configured, the app is open (no gate).
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !PIN || localStorage.getItem(STORAGE_KEY) === 'true',
  );

  const login = useCallback((pin: string): boolean => {
    if (pin === PIN) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
