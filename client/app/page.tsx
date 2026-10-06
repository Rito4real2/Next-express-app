import React from 'react'
import image from 'next/image'
import MarketAnalysis from '@/components/MarketAnalysis'
import BackgroundSection from '@/components/BackgroundSection'
import TradingGuide from '@/components/TradingGuide'
import TradingPlan from '@/components/TradingPlan'
import Footer from '@/components/Footer'

const page = () => {
  return (
    <div>
      <BackgroundSection />
      <MarketAnalysis />
      <TradingGuide />
      <TradingPlan />
      <Footer />
    </div>
  )
}
export default page