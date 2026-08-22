import { config } from 'dotenv';

// Vitest ne charge pas .env/.env.local automatiquement comme Next.js le fait.
// Nécessaire pour que Prisma (DATABASE_URL) fonctionne dans les tests d'intégration.
config({ path: '.env' });
config({ path: '.env.local' });
