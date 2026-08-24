import http from 'k6/http';
import { check } from 'k6';

// CDC V2 §12.5 — "Lecture liste startups (/api/startups)" : 100 requêtes
// simultanées, P95 < 200 ms, 0 erreur.
export const options = {
  scenarios: {
    startups_read: {
      executor: 'constant-vus',
      vus: 100,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/startups`);
  check(res, {
    'statut 200': (r) => r.status === 200,
    'réponse contient data[]': (r) => Array.isArray(r.json('data')),
  });
}
