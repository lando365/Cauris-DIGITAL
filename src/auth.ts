import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createDbSession, revokeDbSession } from '@/lib/session';
import { isLocked, recordFailedLogin, resetFailedLogins } from '@/lib/login-rate-limit';
import { authConfig } from '@/auth.config';

// CDC V2 §7.1 : Credentials Provider + sessions révocables en base.
// NextAuth n'autorise pas la stratégie "database" native avec le Credentials
// Provider (limitation documentée d'Auth.js). On utilise donc un cookie JWT
// (obligatoire côté Auth.js pour Credentials) qui ne porte qu'un sessionToken
// opaque ; la session réelle (utilisateur, validité, révocation) vit dans la
// table Session et est vérifiée côté serveur via requireAdminSession() —
// voir src/lib/require-admin.ts. Le middleware Edge (src/middleware.ts) importe
// une instance NextAuth séparée basée sur auth.config.ts, PAS ce fichier :
// authorize() ci-dessous dépend de bcrypt/Prisma, incompatibles avec l'Edge
// Runtime et trop lourds pour la limite de taille des Edge Functions.
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === 'string' ? credentials.email : undefined;
        const password = typeof credentials?.password === 'string' ? credentials.password : undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) return null;

        if (await isLocked(user.id)) {
          throw new Error('ACCOUNT_LOCKED');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
          await recordFailedLogin(user.id);
          return null;
        }

        await resetFailedLogins(user.id);
        const { sessionToken } = await createDbSession(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sessionToken,
        };
      },
    }),
  ],
  events: {
    async signOut(message) {
      if ('token' in message && message.token?.sessionToken) {
        await revokeDbSession(message.token.sessionToken);
      }
    },
  },
});
