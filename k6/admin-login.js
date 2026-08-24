import http from 'k6/http';
import { check } from 'k6';

// CDC V2 §12.5 — "Connexion admin simultanée" : 10 admins connectés en
// parallèle, pas de dégradation de session.
//
// Reproduit le flux réel de NextAuth v5 (Credentials Provider, CDC §7.1) :
// GET /api/auth/csrf → POST /api/auth/callback/credentials. Le jar de
// cookies de k6 (par VU) porte automatiquement le cookie csrf puis le
// cookie de session d'une requête à l'autre.
export const options = {
  scenarios: {
    admin_login: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const EMAIL = __ENV.SEED_ADMIN_EMAIL;
const PASSWORD = __ENV.SEED_ADMIN_PASSWORD;

export default function () {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      'SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD requis (-e SEED_ADMIN_EMAIL=... -e SEED_ADMIN_PASSWORD=...)'
    );
  }

  const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
  const csrfToken = csrfRes.json('csrfToken');
  check(csrfRes, { 'csrf token reçu': () => !!csrfToken });

  const loginRes = http.post(
    `${BASE_URL}/api/auth/callback/credentials`,
    {
      csrfToken,
      email: EMAIL,
      password: PASSWORD,
      redirect: 'false',
      callbackUrl: `${BASE_URL}/admin`,
    },
    { tags: { name: 'login_post' } }
  );
  check(loginRes, { 'login accepté (200/302)': (r) => r.status === 200 || r.status === 302 });

  // Vérifie que la session est bien active : /admin ne doit pas rediriger vers /admin/login.
  const dashboardRes = http.get(`${BASE_URL}/admin`, { tags: { name: 'post_login_dashboard' } });
  check(dashboardRes, {
    'session active (pas de redirection vers /admin/login)': (r) => !r.url.includes('/admin/login'),
  });
}
