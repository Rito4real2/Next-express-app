// client/src/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Helper function to check if the user authentication cookie exists
    const checkAuth = () => {
      const hasToken = document.cookie.split('; ').some((item) => item.startsWith('token='));
      setIsLoggedIn(hasToken);
    };

    checkAuth();
  }, []);

  return (
    <header className="w-full flex justify-center p-4">
      <nav className="w-full max-w-6xl flex flex-wrap items-center justify-between border-2 border-solid border-[#ddd] p-5 bg-white">
        
        {/* Brand */}
        <div>
          <Link href="/" className="text-black text-2xl font-mono font-bold">
            Broker
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-black p-1 space-y-1"
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>

        {/* Links */}
        <ul className={`w-full md:w-auto flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0 ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <li>
            <Link href="/about" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
              About us
            </Link>
          </li>
          <li>
            <Link href="/contact" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
              Contact us
            </Link>
          </li>

          {/* Conditional Navigation Links */}
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/users/profile" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/users/settings" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                  Settings
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/users/register" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/users/login" className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>

      </nav>
    </header>
  );
}