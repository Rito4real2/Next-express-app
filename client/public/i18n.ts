// public/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      'dashboard.title': 'Broker',
      'nav.about': 'About us',
      'nav.contact': 'Contact us',
      'nav.register': 'Register',
      'nav.login': 'Login',
    },
  },
  es: {
    translation: {
      'dashboard.title': 'Broker',
      'nav.about': 'Sobre nosotros',
      'nav.contact': 'Contacto',
      'nav.register': 'Registrarse',
      'nav.login': 'Iniciar sesión',
    },
  },
  fr: {
    translation: {
      'dashboard.title': 'Courtier',
      'nav.about': 'À propos',
      'nav.contact': 'Contactez-nous',
      'nav.register': "S'inscrire",
      'nav.login': 'Connexion',
    },
  },
};

if (!i18n.isInitialized) {
  // Only use language detector on client side
  if (typeof window !== 'undefined') {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr'],
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
    react: {
      useSuspense: false, // CRITICAL: Fixes Vercel SSR runtime crashes
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;