import { useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  useEffect(() => {
    const twa = window?.Telegram?.WebApp;
    if (!twa) return;

    // Signal that the Mini App is ready to be displayed.
    twa.ready();

    // Expand to full available height (removes the default half-screen mode).
    twa.expand();
  }, []);

  return <Dashboard />;
}
