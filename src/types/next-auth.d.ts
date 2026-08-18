import type { Role } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: Role;
    sessionToken: string;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
    sessionToken: string;
  }
}

// next-auth/jwt.d.ts ne fait que ré-exporter (`export *`) le module
// @auth/core/jwt — l'augmentation de types doit cibler le module où
// l'interface JWT est réellement déclarée pour que le merge fonctionne.
declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: Role;
    sessionToken: string;
  }
}
