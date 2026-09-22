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
      'auth.login_title': 'Sign In to Your Account',
      'auth.login_subtitle': 'Enter your credentials to access your portal.',
      'auth.identifier_label': 'Email Address or Username',
      'auth.identifier_placeholder': 'user@example.com or jondoe',
      'auth.password_label': 'Password',
      'auth.sign_in': 'Sign In',
      'auth.logging_in': 'Logging in...',
      'auth.no_account': "Don't have an account?",
      'auth.register_here': 'Register here',
      'auth.login_failed': 'Login failed',
      'auth.server_error': 'Server connection error. Please try again.',
      'dashboard.welcome': 'Welcome back, {{name}}!',
      'dashboard.account_balance': 'Account Balance',
      'dashboard.deposit_funds': 'Deposit Funds',
      'dashboard.withdraw_funds': 'Withdraw Funds',
      'dashboard.account_type': 'Account Type',
      'dashboard.email_address': 'Email Address',
    },
  },
  es: {
    translation: {
      'dashboard.title': 'Broker',
      'nav.about': 'Sobre nosotros',
      'nav.contact': 'Contacto',
      'nav.register': 'Registrarse',
      'nav.login': 'Iniciar sesión',
      'auth.login_title': 'Inicia sesión en tu cuenta',
      'auth.login_subtitle': 'Ingresa tus credenciales para acceder a tu portal.',
      'auth.identifier_label': 'Correo electrónico o usuario',
      'auth.identifier_placeholder': 'usuario@ejemplo.com o jondoe',
      'auth.password_label': 'Contraseña',
      'auth.sign_in': 'Iniciar sesión',
      'auth.logging_in': 'Iniciando sesión...',
      'auth.no_account': '¿No tienes una cuenta?',
      'auth.register_here': 'Regístrate aquí',
      'auth.login_failed': 'Error de inicio de sesión',
      'auth.server_error': 'Error de conexión al servidor. Inténtalo de nuevo.',
      'dashboard.welcome': '¡Bienvenido de nuevo, {{name}}!',
      'dashboard.account_balance': 'Saldo de la cuenta',
      'dashboard.deposit_funds': 'Depositar fondos',
      'dashboard.withdraw_funds': 'Retirar fondos',
      'dashboard.account_type': 'Tipo de cuenta',
      'dashboard.email_address': 'Correo electrónico',
    },
  },
  fr: {
    translation: {
      'dashboard.title': 'Courtier',
      'nav.about': 'À propos',
      'nav.contact': 'Contactez-nous',
      'nav.register': "S'inscrire",
      'nav.login': 'Connexion',
      'auth.login_title': 'Connectez-vous à votre compte',
      'auth.login_subtitle': 'Entrez vos identifiants pour accéder à votre portail.',
      'auth.identifier_label': 'Adresse e-mail ou nom d\'utilisateur',
      'auth.identifier_placeholder': 'utilisateur@exemple.com ou jondoe',
      'auth.password_label': 'Mot de passe',
      'auth.sign_in': 'Se connecter',
      'auth.logging_in': 'Connexion en cours...',
      'auth.no_account': 'Vous n\'avez pas de compte ?',
      'auth.register_here': 'Inscrivez-vous ici',
      'auth.login_failed': 'Échec de la connexion',
      'auth.server_error': 'Erreur de connexion au serveur. Veuillez réessayer.',
      'dashboard.welcome': 'Bon retour, {{name}} !',
      'dashboard.account_balance': 'Solde du compte',
      'dashboard.deposit_funds': 'Déposer des fonds',
      'dashboard.withdraw_funds': 'Retirer des fonds',
      'dashboard.account_type': 'Type de compte',
      'dashboard.email_address': 'Adresse e-mail',
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