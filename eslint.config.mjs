import nextConfig from 'eslint-config-next';

const config = [
  ...nextConfig,
  {
    // k6/ : export default function() est la convention imposée par l'outil
    // (fonction VU exécutée par le runtime k6), pas un oubli de nommage.
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'k6/**',
    ],
  },
];

export default config;
