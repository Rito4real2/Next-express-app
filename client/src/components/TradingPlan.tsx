'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const tradingPlans = () => {
  const { t } = useTranslation();

  const plans = [
    {
      id: 'basic',
      title: 'Basic Plan $500',
      subtitleKey: 'plans.subtitle_default',
      defaultSubtitle: 'Benefit from industry-leading entry prices',
      ctaKey: 'plans.get_started',
      defaultCta: 'Get Started',
      href: '/users/register',
      features: [
        'min. possible deposit: $500',
        'min. expected profit: $1000',
        'max. expected profit: 45%',
        'Highly-regarded trader education*',
        'Advanced risk management',
        'Tax-free spread betting profits',
        'Low minimum deposit',
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced Plan $1500',
      subtitleKey: 'plans.subtitle_default',
      defaultSubtitle: 'Benefit from industry-leading entry prices',
      ctaKey: 'plans.get_started',
      defaultCta: 'Get Started',
      href: '/users/register',
      features: [
        'min. possible deposit: $1500',
        'min. expected profit: $10,000',
        'max. expected profit: 45%',
        'Highly-regarded trader education*',
        'Advanced risk management',
        'Tax-free spread betting profits',
        'Low minimum deposit',
      ],
    },
    {
      id: 'luxury',
      title: 'Luxury Plan $15,000',
      subtitleKey: 'plans.subtitle_default',
      defaultSubtitle: 'Benefit from industry-leading entry prices',
      ctaKey: 'plans.get_started',
      defaultCta: 'Get Started',
      href: '/users/register',
      features: [
        'min. possible deposit: $15,000',
        'min. expected profit: $50,000',
        'max. expected profit: 45%',
        'Highly-regarded trader education*',
        'Advanced risk management',
        'Tax-free spread betting profits',
        'Low minimum deposit',
      ],
    },
    {
      id: 'legendary',
      title: 'Legendary Plan $50,000',
      subtitleKey: 'plans.subtitle_default',
      defaultSubtitle: 'Benefit from industry-leading entry prices',
      ctaKey: 'plans.get_started',
      defaultCta: 'Get Started',
      href: '/users/register',
      features: [
        'min. possible deposit: $50,000',
        'min. expected profit: $100,000',
        'max. expected profit: 45%',
        'Highly-regarded trader education*',
        'Advanced risk management',
        'Tax-free spread betting profits',
        'Low minimum deposit',
      ],
    },
    {
      id: 'signals',
      title: 'FOREX SIGNALS',
      subtitleKey: 'plans.subtitle_signals',
      defaultSubtitle: 'Receive even tighter spreads and commissions',
      ctaKey: 'plans.open_account',
      defaultCta: 'Open an Account',
      href: '/users/register',
      features: [
        'Professional Forex Signals',
        'Up to 10 Signals/day',
        '95% Success Rate',
        'Support 24/7',
        'Advanced trading tools',
        'Pay using Cryptocurrency',
        'Use any broker',
      ],
    },
  ];


  return (
    <div>
        <div className='flex flex-col gap-2.5 bg-white-950 text-black p-8'>
            <span className='font-mono'>Trade with confidence</span>
            <h1 className='text-bold text-xl font-mono'>Complete Package for Every Trader</h1>
        </div>
        
    <section className="w-full max-w-7xl mx-auto p-4 sm:p-8 lg:p-12">
      {/* 2-COLUMN RESPONSIVE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col justify-between bg-gray-950 text-white p-6 rounded-xl border border-gray-800 shadow-md transition-all hover:border-gray-700"
          >
            <div>
              {/* Header */}
              <div className="border-b border-gray-800 pb-4 mb-4">
                <h2 className="text-xl font-bold font-mono text-red-500">
                  {plan.title}
                </h2>
                <p className="font-mono text-xs text-gray-400 mt-1">
                  {t(plan.subtitleKey, plan.defaultSubtitle)}
                </p>
              </div>

              {/* Feature List */}
              <ul className="flex flex-col gap-2.5 font-mono text-sm text-gray-300 pl-5 list-disc">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* CTA Link */}
            <div className="mt-8 pt-4">
              <Link
                href={plan.href}
                className="block w-full text-center font-mono font-semibold text-white bg-red-600 rounded-md px-4 py-2.5 hover:bg-red-700 transition-colors"
              >
                {t(plan.ctaKey, plan.defaultCta)}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
                
    </div>
  )
}

export default tradingPlans