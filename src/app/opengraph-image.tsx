import { ImageResponse } from 'next/og';

/**
 * Image Open Graph dynamique (CDC §7.1 — partage social).
 *
 * Cette image (1200×630) est automatiquement utilisée par Next.js pour les balises
 *  - <meta property="og:image" />
 *  - <meta name="twitter:image" />
 *
 * Pour la prévisualiser en local : http://localhost:3000/opengraph-image
 *
 * Si tu veux un visuel différent pour Twitter, crée un fichier `twitter-image.tsx`.
 * Si tu veux une image différente sur une page spécifique, place le fichier dans
 * son dossier (ex: `src/app/programme-incubation/opengraph-image.tsx`).
 */

// Métadonnées (lues automatiquement par Next.js)
export const runtime = 'edge';
export const alt = "CAURIS DIGITAL — Incubateur numérique d'excellence en Afrique francophone";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2547 50%, #1A1A2E 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Cercle orange décoratif (haut-droit) */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,100,10,0.25) 0%, rgba(232,100,10,0) 70%)',
        }}
      />
      {/* Cercle orange décoratif (bas-gauche) */}
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,100,10,0.20) 0%, rgba(232,100,10,0) 70%)',
        }}
      />

      {/* ============ HEADER : Marque ============ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, zIndex: 10 }}>
        {/* Barre verticale orange (logo abstrait) */}
        <div
          style={{
            width: 8,
            height: 56,
            background: '#E8640A',
            borderRadius: 2,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: 30,
              color: '#E8640A',
              fontWeight: 800,
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            CAURIS DIGITAL
          </div>
          <div
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 500,
              letterSpacing: 2,
              marginTop: 6,
              textTransform: 'uppercase',
            }}
          >
            Incubateur numérique d&apos;excellence
          </div>
        </div>
      </div>

      {/* ============ MILIEU : Titre principal ============ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          zIndex: 10,
          maxWidth: 950,
        }}
      >
        <div
          style={{
            fontSize: 76,
            color: 'white',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Où l&apos;innovation numérique</span>
          <span>
            <span style={{ color: '#E8640A' }}>africaine</span> prend son essor
          </span>
        </div>
      </div>

      {/* ============ FOOTER : Infos site ============ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 30,
          borderTop: '2px solid rgba(232, 100, 10, 0.3)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Programmes d&apos;incubation & accélération
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: 18,
            }}
          >
            Yaoundé · Afrique francophone · 100% en ligne
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#E8640A',
            padding: '14px 24px',
            borderRadius: 8,
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            caurisdigital.org
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
