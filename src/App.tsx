import React from 'react';
import { GateScreen } from './components/GateScreen';
import { Layout } from './components/Layout';

function isRunningStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function App(): React.JSX.Element {
  // In dev mode, skip the standalone gate so you can test in the browser
  if (!import.meta.env.DEV && !isRunningStandalone()) {
    return <GateScreen />;
  }
  return <Layout />;
}
