import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local' });

// CDC V2 §12.4 : "Les tests E2E s'exécutent sur l'URL de preview Vercel dans la
// pipeline CI." En local (hors CI), on cible un build de production local plutôt
// que `next dev`, pour éviter les artefacts de redirection propres au Fast Refresh
// observés en développement (voir historique des vérifications manuelles).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    // Contourne "Vercel Authentication" (Deployment Protection) sur les
    // Preview : sans ce header, toute navigation est interceptée et
    // redirigée vers vercel.com/login avant même d'atteindre l'app.
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          'x-vercel-set-bypass-cookie': 'true',
        }
      : undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run start',
        port: 3000,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
