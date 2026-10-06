'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  // Each item gets its own distinct image src and translation key
  const footerHighlights = [
    {
      id: 1,
      imageSrc: '/logo.png',
      imageAlt: 'Excellence Badge',
      textKey: 'footer.excellence',
      defaultText: '25 years of excellence',
    },
    {
      id: 2,
      imageSrc: '/logo.png', // Replace with individual image path (e.g., '/badge-regulated.png')
      imageAlt: 'Regulated Badge',
      textKey: 'footer.regulated',
      defaultText: 'Globally Regulated Broker',
    },
    {
      id: 3,
      imageSrc: '/logo.png', // Replace with individual image path (e.g., '/badge-support.png')
      imageAlt: 'Support Badge',
      textKey: 'footer.support',
      defaultText: '24/7 Multilingual Support',
    },
  ];

  return (
    <footer className="w-full bg-gray-800 text-white py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        {/* HIGHLIGHTS SECTION */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 md:gap-12 w-full">
          {footerHighlights.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600/50"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                {t(item.textKey, item.defaultText)}
              </span>
            </div>
          ))}
        </div>

        <hr className="w-full border-gray-700 my-2" />

        {/* COPYRIGHT */}
        <p className="font-mono text-xs sm:text-sm text-gray-400 text-center">
          {t('footer.copyright', '© 2026 Your Company. All rights reserved.')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;