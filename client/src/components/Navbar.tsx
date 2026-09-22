// client/src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '@/hooks/useIsMounted';
import '@/public/i18n'; // Force i18n instance initialization safely

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const isMounted = useIsMounted();
  const [selectedLang, setSelectedLang] = useState<string>('en');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Keep selectedLang in sync with i18n instance on mount and upon language change
  useEffect(() => {
    if (i18n.language) {
      setSelectedLang(i18n.language);
    }

    const handleLanguageChange = (lng: string) => {
      setSelectedLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Sends HttpOnly auth cookie to Express backend
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [API_BASE_URL]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang); // Optimistic UI update
    await i18n.changeLanguage(newLang);
  };

  return (
    <header className="w-full flex justify-center p-4">
      <nav className="w-full max-w-6xl flex flex-wrap items-center justify-between border-2 border-solid border-[#ddd] p-5 bg-white relative">
        
        {/* Brand */}
        <div>
          <Link href="/" className="text-black text-2xl font-mono font-bold">
            {t('dashboard.title', 'Broker')}
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-black p-1 space-y-1 focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>

        {/* Links & Language Switcher */}
        <ul className={`w-full md:w-auto flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0 ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <li>
            <Link href="/about" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
              {t('nav.about', 'About us')}
            </Link>
          </li>
          <li>
            <Link href="/contact" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
              {t('nav.contact', 'Contact us')}
            </Link>
          </li>

          {/* Render navigation conditionally based on auth API check */}
          {!loading && (
            <>
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href="/users/profile" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                      {t('nav.dashboard', 'Dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/users/settings" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                      {t('nav.settings', 'Settings')}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/users/register" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                      {t('nav.register', 'Register')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/users/login" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                      {t('nav.login', 'Login')}
                    </Link>
                  </li>
                </>
              )}
            </>
          )}

          {/* Language Switcher */}
          <li className="w-full md:w-auto">
            {isMounted ? (
              <select
                value={selectedLang}
                onChange={handleLanguageChange}
                className="h-12 px-3 text-black font-mono border-[3px] border-solid border-black bg-white cursor-pointer hover:bg-black hover:text-white transition-colors w-full md:w-auto focus:outline-none"
              >
                <option value="en" className="bg-white text-black">
                  English 🇺🇸
                </option>
                <option value="es" className="bg-white text-black">
                  Español 🇪🇸
                </option>
                <option value="fr" className="bg-white text-black">
                  Français 🇫🇷
                </option>
              </select>
            ) : (
              <div className="h-12 w-32 border-[3px] border-black bg-gray-100 animate-pulse" />
            )}
          </li>
        </ul>

      </nav>
    </header>
  );
}