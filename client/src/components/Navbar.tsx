// client/src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '@/hooks/useIsMounted';
import '../../lib/locales/i18n'; // Force i18n instance initialization safely

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation();
  const isMounted = useIsMounted();
  const [selectedLang, setSelectedLang] = useState<string>('en');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
          credentials: 'include',
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
  const closeMenu = () => setIsOpen(false);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    await i18n.changeLanguage(newLang);
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-solid border-[#ddd] shadow-sm">
      <nav className="w-full px-4 py-3 sm:px-8 md:py-4">
        
        {/* Top Bar: Brand + Mobile Toggle */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="text-xl sm:text-2xl font-mono font-bold text-black tracking-tight hover:opacity-80 transition-opacity"
          >
            {t('dashboard.title', 'Broker')}
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-black p-1 space-y-1 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Links & Language Switcher Dropdown/Grid */}
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 hidden md:block mt-0'}`}>
          <ul className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 md:gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
            
            <li>
              <Link 
                href="/about" 
                onClick={closeMenu}
                className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                {t('nav.about', 'About us')}
              </Link>
            </li>
            
            <li>
              <Link 
                href="/contact" 
                onClick={closeMenu}
                className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                {t('nav.contact', 'Contact us')}
              </Link>
            </li>

            {!loading && (
              <>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link 
                        href="/users/profile" 
                        onClick={closeMenu}
                        className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                      >
                        {t('nav.dashboard', 'Dashboard')}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/users/settings" 
                        onClick={closeMenu}
                        className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                      >
                        {t('nav.settings', 'Settings')}
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link 
                        href="/users/register" 
                        onClick={closeMenu}
                        className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                      >
                        {t('nav.register', 'Register')}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/users/login" 
                        onClick={closeMenu}
                        className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                      >
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
                  className="h-11 px-3 text-sm sm:text-base text-black font-mono border-[3px] border-solid border-black bg-white cursor-pointer hover:bg-black hover:text-white transition-colors w-full md:w-auto focus:outline-none"
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
                <div className="h-11 w-full md:w-32 border-[3px] border-black bg-gray-100 animate-pulse" />
              )}
            </li>
          </ul>
        </div>

      </nav>
    </header>
  );
}