import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const STORAGE_KEY = 'berrywise_auth';

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

async function loadHook() {
  const { useAuth } = await import('./use-auth');
  return useAuth;
}

describe('useAuth — no PIN configured', () => {
  it('is authenticated by default when VITE_APP_PIN is not set', async () => {
    vi.stubEnv('VITE_APP_PIN', '');
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });
});

describe('useAuth — PIN configured', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_APP_PIN', '1234');
  });

  it('starts unauthenticated when no stored session', async () => {
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('starts authenticated when session is already stored', async () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login returns true and marks authenticated on correct PIN', async () => {
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    let loginResult!: boolean;
    act(() => { loginResult = result.current.login('1234'); });
    expect(loginResult).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('login returns false on wrong PIN', async () => {
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    let loginResult!: boolean;
    act(() => { loginResult = result.current.login('9999'); });
    expect(loginResult).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logout clears authentication and storage', async () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const useAuth = await loadHook();
    const { result } = renderHook(() => useAuth());
    act(() => { result.current.logout(); });
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
