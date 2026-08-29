import createNextIntlPlugin from 'next-intl/plugin';

// Plugin next-intl — pointe vers le fichier de config request.ts
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      // Vercel Blob (CDC V2 §5.5) — logos/images uploadés via l'admin.
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
    // Tailles de viewport courantes pour la génération automatique de variantes
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache des images optimisées (60 jours)
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Compression et headers de sécurité
  compress: true,
  poweredByHeader: false,
  // Headers de sécurité supplémentaires
  async headers() {
    // CDC V2 §7.4 — origines externes réellement chargées par le site :
    // Google Analytics (gtag.js), reCAPTCHA v3 (script + iframe + gstatic),
    // OpenStreetMap (carte de localisation sur /contact), et les hôtes
    // d'images distantes déjà déclarés dans images.remotePatterns.
    // Pas de nonce (pas d'infra de nonce par requête) : 'unsafe-inline' reste
    // nécessaire pour le script d'init GA et le <style> injecté par next/font.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://cdn.sanity.io https://*.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com",
      'frame-src https://www.google.com https://www.openstreetmap.org',
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache long pour les assets statiques
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
