import http from 'k6/http';
import { check } from 'k6';

// CDC V2 §12.5 — "Soumission formulaire contact (/api/contact)" :
// 50 soumissions/min, toutes traitées, 0 perte.
export const options = {
  scenarios: {
    contact_submit: {
      executor: 'constant-arrival-rate',
      rate: 50,
      timeUnit: '1m',
      duration: '2m',
      preAllocatedVUs: 10,
      maxVUs: 30,
    },
  },
  thresholds: {
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = {
    firstName: 'Test',
    lastName: 'Charge',
    email: `k6-${__VU}-${__ITER}@example.com`,
    subject: 'autre',
    message:
      'Message généré par le test de charge k6 (CDC V2 §12.5), suffisamment long pour passer la validation minimale de 20 caractères.',
    consent: 'on',
    website: '', // honeypot anti-spam : doit rester vide
  };

  const res = http.post(`${BASE_URL}/api/contact`, payload);
  check(res, {
    'statut 200': (r) => r.status === 200,
    'success: true': (r) => {
      try {
        return r.json('success') === true;
      } catch {
        return false;
      }
    },
  });
}
