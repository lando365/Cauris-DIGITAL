import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * true uniquement après l'hydratation côté client — évite les mismatchs
 * SSR/CSR sans passer par un useState+setState dans un useEffect
 * (react-hooks/set-state-in-effect).
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
