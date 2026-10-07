'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const Testimonials = () => {
  const { t } = useTranslation()

  const testimonials = [
    {
      id: 1,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 1',
      testimonialTextKey: 'testimonials.testimonial1',
      defaultTestimonialText: `I'm Hunter Hamilton from North Carolina, Currently living in Arizona with my Family, i came across (your company name), while browsing through facebook, I accessed the site and contact them via whatsapp and i started investing with $5000 and am making $51,560.00 Weekly.💵💵`,
      name: 'Hunter Hamilton',
      country: 'UNITED STATES',
    },
    {
      id: 2,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 2',
      testimonialTextKey: 'testimonials.testimonial2',
      defaultTestimonialText: `Hello everyone I'm Charlotte from South Africa 🇿🇦 It is very easy to make investments on this platform. They have different payment methods that are secured and easy to use. I have also earned more from my account upgrade with amazing new features added to it thank you all so much ❤️.`,
      name: 'Charlotte Lesoto',
      country: 'SOUTH AFRICA',
    },
    {
      id: 3,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 3',
      testimonialTextKey: 'testimonials.testimonial3',
      defaultTestimonialText: `Blessings be unto you ma'am Violante Valeria and your company (your company name), you're such a big comfort and a big help to me regarding bitcoin investment ma'am , God bless you for using your skills of trading to bless us the Philippines🇵🇭 because we normally have a low economy 💖 thanks ma'am Violante Valeria once again and i will do tell my friends to join the winning team.`,
      name: 'Michael Chen',
      country: 'CANADA',
    },
    {
      id: 4,
      imageSrc: '/logo.png',
      imageAlt: 'Testimonial 4',
      testimonialTextKey: 'testimonials.testimonial4',
      defaultTestimonialText: `Hi Your company Name . I'm just writing to say thank you!! Your company Name is in my blood now. I finally found my life! I want to say a big thank you to (your company name) , Just got my profit of $7500 in my Bank account. This is indeed a trust worthy platform to invest.`,
      name: 'Emily Rodriguez',
      country: 'UNITED STATES',
    },
  ]

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">


      {/* 2-COLUMN GRID (1 Column on Mobile, 2 Columns on Medium Screens & Up) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex flex-col justify-between bg-gray-800 text-white p-6 rounded-xl border border-gray-700 shadow-md transition-all hover:border-gray-600"
          >
            {/* Testimonial Quote */}
            <p className="text-gray-200 text-base leading-relaxed mb-6 italic">
              "{t(testimonial.testimonialTextKey, { defaultValue: testimonial.defaultTestimonialText })}"
            </p>

            {/* Author Profile Footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-full bg-gray-700">
                <Image
                  src={testimonial.imageSrc}
                  alt={testimonial.imageAlt}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-white">
                  {testimonial.name}
                </span>
                <span className="font-mono text-xs text-red-400 font-semibold tracking-wider">
                  {testimonial.country}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials