'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import history from '@/public/images/icons/history.svg'
import trophy from '@/public/images/icons/trophy.svg'
import phone from '@/public/images/icons/phone.svg'
import visa from '@/public/images/logos/visa.jpg'
import mastercard from '@/public/images/logos/Mastercard.webp'
import paypal from '@/public/images/logos/paypal.png'
import bank from '@/public/images/logos/bank.jpg'
import bitcoin from '@/public/images/logos/bitcoin.png'
import ethereum from '@/public/images/logos/ethereum.png'
import tron from '@/public/images/logos/tron.png'
import usdt from '@/public/images/logos/tether.png'

const Footer = () => {
  const { t } = useTranslation();

  const footerHighlights = [
    {
      id: 1,
      imageSrc: history,
      imageAlt: 'Excellence Badge',
      textKey: 'footer.excellence',
      defaultText: '25 years of excellence',
    },
    {
      id: 2,
      imageSrc: trophy,
      imageAlt: 'Regulated Badge',
      textKey: 'footer.regulated',
      defaultText: 'Globally Regulated Broker',
    },
    {
      id: 3,
      imageSrc: phone,
      imageAlt: 'Support Badge',
      textKey: 'footer.support',
      defaultText: '24/7 Multilingual Support',
    },
  ];

  const socialLinks = [
    { id: 'facebook', icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { id: 'instagram', icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { id: 'twitter', icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

  const emailAddress = 'Example@email.com';

  // Image sources for the highlights section
  const historyImageSrc = history; // Path to the history image
  const trophyImageSrc = trophy; // Path to the trophy image
  const phoneEnabledImageSrc = phone; // Path to the phone-enabled image

  const markets = [
    { id: 1, name: 'Forex'},
    { id: 2, name: 'Commodities'},
    { id: 3, name: 'Indices'},
    { id: 4, name: 'Cryptocurrencies'},
  ];

  const accountTypes = [
    { id: 1, name: 'Standard Account'},
    { id: 2, name: 'Premium Account'},
    { id: 3, name: 'VIP Account'},
  ];

  const imageSources = [
    { id: 1, src: visa, alt: 'Visa' },
    { id: 2, src: mastercard, alt: 'MasterCard' },
    { id: 3, src: paypal, alt: 'PayPal' },
    { id: 4, src: bank, alt: 'Bank Transfer' },
    { id: 5, src: bitcoin, alt: 'Bitcoin' },
    { id: 6, src: ethereum, alt: 'Ethereum' },
    { id: 7, src: tron, alt: 'Tron' },
    { id: 8, src: usdt, alt: 'USDT' },
  ];

  const paymentMethods = [
    { id: 1, name: 'Visa', src: `${visa.src}` },
    { id: 2, name: 'MasterCard', src: `${mastercard.src}` },
    { id: 3, name: 'PayPal', src: `${paypal.src}` },
    { id: 4, name: 'Bank Transfer', src: `${bank.src}` },
    { id: 5, name: 'Bitcoin', src: `${bitcoin.src}` },
    { id: 6, name: 'Ethereum', src: `${ethereum.src}` },
    { id: 7, name: 'Tron', src: `${tron.src}` },
    { id: 8, name: 'USDT', src: `${usdt.src}` },
  ];

  return (
    <footer className="w-full bg-gray-800 text-white py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        
        {/* HIGHLIGHTS SECTION */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-12 w-full">
          {footerHighlights.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-gray-700/50 px-4 py-2.5 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-colors w-full sm:w-auto justify-center"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
              />
              <span className="text-xs sm:text-sm font-medium tracking-wide font-mono">
                {t(item.textKey, item.defaultText)}
              </span>
            </div>
          ))}
        </div>

        <hr className="w-full border-gray-700 my-2" />

        {/* CONTACT INFO & SOCIALS */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-2xl px-2">
          {/* Social Icons rendered correctly as JSX components */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-red-600 text-white transition-colors border border-gray-600"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </div>

          {/* Email Address */}
          <p className="text-sm text-gray-300 font-mono">
            {t('footer.email_prefix', 'Email:')}{' '}
            <a
              href={`mailto:${emailAddress}`}
              className="text-red-400 hover:underline"
            >
              {emailAddress}
            </a>
          </p>
        </div>

        {/* MARKETS & ACCOUNT TYPES */}
       <div className="w-full max-w-2xl px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 text-center sm:text-left">
        
        {/* Markets Column */}
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <h3 className="text-lg font-bold text-white tracking-wide border-b border-gray-700 pb-1.5 w-full sm:w-auto">
            Markets
          </h3>
          <ul className="flex flex-col gap-2.5 w-full">
            {markets.map((market) => (
              <li key={market.id}>
                <Link
                  href="#"
                  className="text-sm text-gray-300 hover:text-red-400 transition-colors block py-0.5"
                >
                  {market.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account Types Column */}
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <h3 className="text-lg font-bold text-white tracking-wide border-b border-gray-700 pb-1.5 w-full sm:w-auto">
            Account Types
          </h3>
          <ul className="flex flex-col gap-2.5 w-full">
            {accountTypes.map((accountType) => (
              <li key={accountType.id}>
                <Link
                  href={`/accounts/${accountType.id}`}
                  className="text-sm text-gray-300 hover:text-red-400 transition-colors block py-0.5"
                >
                  {accountType.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Methods Column */}
        <div className="flex flex-col gap-3 items-center sm:items-start w-full">
        {/* Header */}
        <h3 className="text-lg font-bold text-white tracking-wide border-b border-gray-700 pb-1.5 w-full sm:w-auto text-center sm:text-left">
          Payment Methods
        </h3>

        {/* Payment Icons Grid / Wrap */}
        <ul className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full pt-1">
          {paymentMethods.map((method) => (
            <li
              key={method.id}
              className="flex flex-col items-center gap-1.5 bg-gray-800/60 p-2.5 rounded-lg border border-gray-700/50 hover:border-red-500/50 transition-colors min-w-[70px] text-center"
            >
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src={method.src}
                  alt={method.name}
                  width={40}
                  height={40}
                  className="w-auto h-auto max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-xs font-mono text-gray-300 tracking-tight">
                {method.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
            <div>
              <p className="text-xs text-gray-400 font-mono text-center sm:text-left">
                *Availability may vary depending on the country
              </p>
            </div>
      </div>
    </div>

        {/* COPYRIGHT */}
        <p className="font-mono text-xs sm:text-sm text-gray-400 text-center pt-2">
          {t('footer.copyright', '© 2020 Your Company. All rights reserved.')}
        </p>

      </div>
    </footer>
  );
};

export default Footer;