'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function NavigationPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isMounted = useIsMounted();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Safely resolve active language on client vs server default
  const currentLanguage = isMounted && i18n.language ? i18n.language : 'en';

  return (
    <div className="w-full">
      <header className="w-full flex flex-col items-center justify-center p-4">
        <nav className="w-full max-w-6xl flex flex-wrap items-center justify-between border-2 border-solid border-[#ddd] p-5 relative bg-white">
          
          {/* Logo Brand */}
          <div>
            <h2 className="text-black text-2xl font-mono font-bold">
              {t('dashboard.title', 'Broker')}
            </h2>
          </div>

          {/* Hamburger Icon Button */}
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-black p-1 space-y-1 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
                isOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
                isOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>

          {/* Navigation Links List */}
          <ul
            className={`w-full md:w-auto flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 mt-4 md:mt-0 ${
              isOpen ? 'flex' : 'hidden md:flex'
            }`}
          >
            <li>
              <Link
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                href="/about"
              >
                {t('nav.about', 'About us')}
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                href="/contact"
              >
                {t('nav.contact', 'Contact us')}
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                href="/users/register"
              >
                {t('nav.register', 'Register')}
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
                href="/users/login"
              >
                {t('nav.login', 'Login')}
              </Link>
            </li>

            {/* Language Switcher */}
            <li className="w-full md:w-auto">
              {isMounted ? (
                <select
                  value={currentLanguage}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
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
    </div>
  );
}