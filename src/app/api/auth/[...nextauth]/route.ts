/* v8 ignore file -- pur ré-export des handlers NextAuth, aucune logique
   propre ; le comportement réel est couvert par les tests E2E de connexion/
   déconnexion (admin-startup-crud.spec.ts, admin-rbac.spec.ts). */
import { handlers } from '@/auth';

/** Handlers GET/POST NextAuth (connexion, callback, déconnexion) — voir `@/auth` pour la config. */
export const { GET, POST } = handlers;
