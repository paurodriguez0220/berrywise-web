import React, { useState } from 'react';

export interface LoginScreenProps {
  onLogin: (pin: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps): React.JSX.Element {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const success = onLogin(pin);
    if (!success) {
      setError('Wrong PIN. Try again.');
      setPin('');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-8 text-center bg-white">
      <div className="text-6xl mb-4">🍓</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">BerryWise</h1>
      <p className="text-sm text-gray-500 mb-8">Enter the PIN to continue.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(undefined); }}
          placeholder="PIN"
          autoFocus
          className="min-h-12 rounded-xl border border-gray-200 px-4 text-center text-lg tracking-widest text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!pin}
          className="min-h-12 rounded-xl bg-red-500 text-white font-medium text-sm active:scale-95 transition disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
