'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Hook pour interagir avec Google reCAPTCHA v3.
 *
 * Usage :
 * ```tsx
 * const { getToken, isEnabled } = useRecaptcha();
 *
 * const onSubmit = async (e) => {
 *   const token = await getToken('contact_form');
 *   // Envoyer token dans le payload de la requête API
 * };
 * ```
 *
 * Le hook fonctionne en mode "no-op" si NEXT_PUBLIC_RECAPTCHA_SITE_KEY n'est pas configurée :
 * `isEnabled` vaut `false`, `getToken` retourne `null`. Pratique pour le dev local.
 */

// Augmente window pour le SDK Google grecaptcha (chargé via script externe)
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface UseRecaptchaReturn {
  /** Génère un token reCAPTCHA pour l'action donnée. Retourne `null` si désactivé/échec. */
  getToken: (action: string) => Promise<string | null>;
  /** `true` si une site key est configurée. */
  isEnabled: boolean;
  /** `true` une fois le script Google chargé et prêt. */
  isReady: boolean;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const isEnabled = !!siteKey;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;

    // Poll pour grecaptcha tant qu'il n'est pas dispo (chargé par <Script lazyOnload>)
    let cancelled = false;
    const checkReady = () => {
      if (cancelled) return;
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          if (!cancelled) setIsReady(true);
        });
      } else {
        // Pas encore chargé — on retente dans 200ms
        setTimeout(checkReady, 200);
      }
    };
    checkReady();

    return () => {
      cancelled = true;
    };
  }, [isEnabled]);

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) {
        return null;
      }
      try {
        return await window.grecaptcha.execute(siteKey, { action });
      } catch (err) {
        console.error('[recaptcha] Erreur lors de la génération du token:', err);
        return null;
      }
    },
    [siteKey]
  );

  return { getToken, isEnabled, isReady };
}
