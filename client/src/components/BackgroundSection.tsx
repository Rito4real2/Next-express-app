'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/Slider';

const BackgroundSection = () => {
  const { t } = useTranslation();

  const markets = [
    { key: 'forex', label: t('home.markets.forex', 'Forex') },
    { key: 'crypto', label: t('home.markets.crypto', 'Crypto') },
    { key: 'indexes', label: t('home.markets.indexes', 'Indexes') },
    { key: 'stocks', label: t('home.markets.stocks', 'Stocks') },
    { key: 'energy', label: t('home.markets.energy', 'Energy') },
    { key: 'commodities', label: t('home.markets.commodities', 'Commodities') },
  ];

  return (
    <div className="w-full">
      {/* HERO SECTION WITH SLIDER */}
      <section className="relative w-full min-h-[480px] sm:min-h-[520px] lg:min-h-[600px] flex items-center justify-start overflow-hidden p-4 sm:p-8 lg:p-16">
        {/* Absolute Slider Background */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Slider />
        </div>

        {/* Floating Content Card */}
        <div className="w-full max-w-lg p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 z-10 transition-all">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-gray-900 leading-tight">
            {t('home.hero_title', 'Get More Freedom in the Markets.')}
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 leading-relaxed font-mono">
            {t(
              'home.hero_subtitle',
              'Trade Cryptocurrencies, Stocks, Indices, Commodities and Forex from a single platform.'
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <Link
              href="/users/register"
              className="w-full sm:w-auto text-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium font-mono text-sm transition cursor-pointer shadow-sm hover:shadow"
            >
              {t('home.open_account', 'Open Account')}
            </Link>

            <Link
              href="/users/login"
              className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium font-mono text-sm transition cursor-pointer"
            >
              {t('home.login_account', 'Login Account')}
            </Link>
          </div>

          <p className="text-[10px] sm:text-[11px] text-gray-500 mt-4 leading-normal font-mono">
            {t(
              'home.risk_disclaimer',
              '*Trading in Forex/CFDs is highly speculative and carries a high level of risk.'
            )}
          </p>
        </div>
      </section>

      {/* MARKET CATEGORIES SECTION */}
      <main className="p-4 sm:p-8 lg:p-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col justify-center items-center">
          <div className="flex border items-center justify-center align-center border-gray-200 w-full m-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold font-mono text-gray-800 p-4 text-center sm:text-left">
            {t('home.section_title', 'Less Commission, More Profit')}
          </h2>
        </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {markets.map((market) => (
              <div
                key={market.key}
                className="flex items-center gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-2xs hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                  {market.label.charAt(0)}
                </div>
                <span className="text-xs sm:text-sm font-semibold font-mono text-gray-700 truncate">
                  {market.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BackgroundSection;