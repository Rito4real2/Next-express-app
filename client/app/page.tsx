'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NavigationPage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <header className="w-full flex flex-col items-center justify-center p-4">
        <nav className="w-full max-w-6xl flex flex-wrap items-center justify-between border-2 border-solid border-[#ddd] p-5 relative bg-white">
          
          {/* Logo Brand */}
          <div>
            <h2 className="text-black text-2xl font-mono font-bold">
              Broker
            </h2>
          </div>

          {/* Hamburger Icon Button (Visible on Mobile/Tablet) */}
          <button
            onClick={toggleMenu}
            type="button"
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border-2 border-black p-1 space-y-1 focus:outline-none"
            aria-label="Toggle navigation menu"
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
            className={`
              w-full md:w-auto
              flex flex-col md:flex-row
              items-center md:items-center
              gap-4 md:gap-6
              mt-4 md:mt-0
              ${isOpen ? 'flex' : 'hidden md:flex'}
            `}
          >
            <li>
              <Link
                href="/about"
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                Contact us
              </Link>
            </li>
            <li>
              <Link
                href="/users/register"
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                href="/users/login"
                className="flex items-center justify-center px-4 h-12 text-black font-mono border-[3px] border-solid border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
              >
                Login
              </Link>
            </li>
          </ul>

        </nav>
      </header>
    </div>
  );
}