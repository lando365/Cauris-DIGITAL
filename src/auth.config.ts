import type { NextAuthConfig } from 'next-auth';

// Config Edge-safe : aucune dépendance Node (bcrypt, Prisma, crypto) ne doit
// jamais être importée ici, ni transitivement. C'est ce fichier — et lui seul —
// que src/middleware.ts importe, pour rester sous la limite de taille des Edge
// Functions (1 Mo sur le plan gratuit Vercel). Le Credentials Provider et ses
// dépendances lourdes vivent dans src/auth.ts, jamais chargé par le middleware.
export const authConfig = {
  pages: { signIn: '/admin/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.sessionToken = user.sessionToken;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.sessionToken = token.sessionToken;
      return session;
    },
  },
} satisfies NextAuthConfig;
