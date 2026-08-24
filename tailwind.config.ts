import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // Breakpoint additionnel pour très petits écrans (iPhone SE, etc.)
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Charte graphique CAURIS DIGITAL (CDC §5.1)
        // Orange légèrement assombri par rapport au #E8640A d'origine du CDC :
        // le ton exact ne passait le contraste WCAG AA (4.5:1) sur aucune
        // combinaison réellement utilisée (texte sur blanc/crème/gris clair,
        // badges teintés, texte blanc sur fond orange). #B54E08 reste
        // visuellement la même teinte "orange CAURIS" tout en respectant
        // l'accessibilité partout où elle sert de texte.
        cauris: {
          orange: '#B04C08',
          'orange-dark': '#974107',
          'orange-light': '#F58A3D',
          black: '#1A1A2E',
          cream: '#FFF5EE',
          'gray-text': '#333333',
          // Légèrement assombri (#6C757D → #697179) pour atteindre 4.5:1 sur fond blanc/crème/gris clair
          'gray-secondary': '#697179',
          'gray-bg': '#F5F5F5',
          success: '#2ECC71',
          // Variante assombrie de `success`, réservée au texte sur fond clair
          // teinté (badges "bg-success/10-15"). `success` reste inchangé car
          // il sert aussi de texte sur fond noir (NewsletterForm) où le vert
          // clair d'origine est nécessaire pour le contraste.
          'success-text': '#1D8147',
          error: '#E74C3C',
        },
      },
      fontFamily: {
        // Polices définies dans le CDC §5.2
        heading: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tailles de titres conformes au CDC
        'display-xl': ['64px', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        h3: ['26px', { lineHeight: '1.25', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 4px 16px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        cta: '0 6px 20px rgba(232, 100, 10, 0.35)',
      },
      borderRadius: {
        card: '12px',
        btn: '6px',
      },
      spacing: {
        section: '80px',
        'section-lg': '120px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'count-up': 'countUp 2s ease-out',
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        cauris: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
