import React from 'react';
import { GateScreen } from './components/GateScreen';
import { LoginScreen } from './components/LoginScreen';
import { Layout } from './components/Layout';
import { useAuth } from './auth/use-auth';

function isRunningStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function App(): React.JSX.Element {
  const { isAuthenticated, login } = useAuth();

  if (!import.meta.env.DEV && !isRunningStandalone()) {
    return <GateScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <Layout />;
}
