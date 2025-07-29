import { useState, useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate framework initialization or check for readiness
    // Replace this with your actual readiness logic if needed
    setReady(true);
    window.frameworkReady?.();
  }, []);

  return ready;
}
