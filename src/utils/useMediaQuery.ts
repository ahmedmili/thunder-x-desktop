import { useState, useEffect } from 'react';

type MediaQuery = {
  matches: boolean;
  addListener: (callback: (event: MediaQueryListEvent) => void) => void;
  removeListener: (callback: (event: MediaQueryListEvent) => void) => void;
};

export default function useMediaQuery(query: string): boolean {
  const mediaQuery: MediaQuery = window.matchMedia(query);
  const [matches, setMatches] = useState<boolean>(mediaQuery.matches);

  useEffect(() => {
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addListener(handler);

    return () => {
      mediaQuery.removeListener(handler);
    };
  }, [mediaQuery]);

  return matches;
}
