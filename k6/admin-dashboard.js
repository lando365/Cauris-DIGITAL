import http from 'k6/http';
import { check } from 'k6';

// CDC V2 §12.5 — "Dashboard avec données réelles" : 20 requêtes simultanées
// admin, P95 < 500 ms. Le seuil porte uniquement sur la requête du dashboard
// (tag "dashboard_get"), pas sur la connexion préalable.
export const options = {
  scenarios: {
    admin_dashboard: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
    },
  },
  thresholds: {
    'http_req_duration{name:dashboard_get}': ['p(95)<500'],
    http_req_failed: ['rate==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const EMAIL = __ENV.SEED_ADMIN_EMAIL;
const PASSWORD = __ENV.SEED_ADMIN_PASSWORD;

function login() {
  const csrfRes = http.get(`${BASE_URL}/api/auth/csrf`);
  const csrfToken = csrfRes.json('csrfToken');
  http.post(
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
}

export default function () {
  if (!EMAIL || !PASSWORD) {
    throw new Error(
      'SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD requis (-e SEED_ADMIN_EMAIL=... -e SEED_ADMIN_PASSWORD=...)'
    );
  }

  // Session ré-établie à chaque itération : le cookie jar de k6 n'est pas
  // partagé entre VUs, donc chaque VU doit s'authentifier lui-même.
  login();

  const res = http.get(`${BASE_URL}/admin`, { tags: { name: 'dashboard_get' } });
  check(res, {
    'statut 200': (r) => r.status === 200,
    'contient "Tableau de bord"': (r) => r.body.includes('Tableau de bord'),
  });
}
