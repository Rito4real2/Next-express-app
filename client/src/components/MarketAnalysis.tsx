'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MarketAnalysis() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-gray-50/50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* TEXT CONTENT */}
        <div className="flex-1 flex flex-col gap-3 text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-gray-900 leading-tight">
            {t('market_analysis.title', 'Market Analysis and Trade Inspiration')}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base font-mono text-gray-600 leading-relaxed">
            {t(
              'market_analysis.description',
              "Stay ahead of the market with our comprehensive analysis and trade inspiration. Our team of experts provides daily insights, market trends, and trading strategies to help you make informed decisions. Whether you're a beginner or an experienced trader, our analysis will give you the edge you need to succeed in the financial markets. With a thriving network of experts, being a client of TheAlertNation opens doors to many opportunities. Powerful market insight and the top trade setups in the industry. You will have extensive connections to professional traders."
            )}
          </p>
        </div>

        {/* RESPONSIVE YOUTUBE VIDEO CONTAINER */}
        <div className="w-full lg:w-[480px] xl:w-[560px] shrink-0">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/z7538iNe2Pw?si=-co92WbQFHTOSREu"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}