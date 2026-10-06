import React from 'react'
import Link from 'next/link'

const TradingPlan = () => {
  return (
    <div>
        <div className='flex flex-col gap-2.5 bg-white-950 text-black p-8'>
            <span className='font-mono'>Trade with confidence</span>
            <h1 className='text-bold text-xl font-mono'>Complete Package for Every Trader</h1>
        <div/>
            <div>
                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                    <div className='flex flex-col gap-2.5 bg-gray-950 text-white rounded-lg p-4'>
                        <h1 className='font-mono'>Basic Plan $500</h1>
                        <p className='font-mono text-sm'>Benefit from industry-leading entry prices</p>
                    </div>
                    <ol className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm p-4'>
                        <li>min. possible deposit: $500</li>
                        <li>min. expected profit: $1000</li>
                        <li>max. expected profit: %45</li>
                        <li>Highly-regarded trader education*</li>
                        <li>Advanced risk management</li>
                        <li>Tax-free spread betting profits</li>
                        <li>Low minimum deposit</li>
                    </ol>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6'>
                        <Link 
                        href='/users/register' 
                        className="text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900">Get Started</Link>
                    </div>
                </div>
            <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded'>
                    <h1 className='font-mono'>Advanced Plan $1500</h1>
                    <p className='font-mono text-sm'>Benefit from industry-leading entry prices</p>
                </div>
                <ol className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm bg-gray-950 text-white p-4 mb-4'>
                    <li>min. possible deposit: $1500</li>
                    <li>min. expected profit: $10,000</li>
                        <li>max. expected profit: %45</li>
                        <li>Highly-regarded trader education*</li>
                        <li>Advanced risk management</li>   
                        <li>Tax-free spread betting profits</li>
                        <li>Low minimum deposit</li>
                    </ol>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6'>
                        <Link 
                        href='/users/register' 
                        className="text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900">Get Started</Link>
                    </div>
                </div>
                </div>

            <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                        <h1 className='font-mono'   >Luxury Plan $15,000</h1>
                        <p className='font-mono text-sm'>Benefit from industry-leading entry prices</p>
                </div>
                    <ol className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm bg-gray-950 text-white p-4 rounded-lg mb-4'>
                        <li>min. possible deposit: $15,000</li>
                        <li>min. expected profit: $50,000</li>
                        <li>max. expected profit: %45</li>
                        <li>Highly-regarded trader education*</li>
                        <li>Advanced risk management</li>
                        <li>Tax-free spread betting profits</li>
                        <li>Low minimum deposit</li>
                    </ol>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6'>
                        <Link 
                        href='/users/register' 
                        className="text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900">Get Started</Link>
                    </div>
            </div>

            <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded'>
                    <h1 className='font-mono'>Legendary Plan $50,000</h1>
                    <p className='font-mono text-sm'>Benefit from industry-leading entry prices</p>
                </div>
                <ol className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm bg-gray-950 text-white p-4 mb-4'>
                    <li>min. possible deposit: $50,000</li>
                    <li>min. expected profit: $100,000</li>
                        <li>max. expected profit: %45</li>
                        <li>Highly-regarded trader education*</li>
                        <li>Advanced risk management</li>   
                        <li>Tax-free spread betting profits</li>
                        <li>Low minimum deposit</li>
                    </ol>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6'>
                        <Link 
                        href='/users/register' 
                        className="text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900">Get Started</Link>
                    </div>
                </div>
                </div>

                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded-lg mb-4'>
                <div className='flex flex-col gap-2.5 bg-gray-950 text-white p-4 rounded'>
                    <h1 className='font-mono'>FOREX SIGNALS</h1>
                    <p className='font-mono text-sm'>Receive even tighter spreads and commissions</p>
                </div>
                <ol className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm bg-gray-950 text-white p-4 mb-4'>
                    <li>Professional Forex Signals</li>
                    <li>Up to 10 Signals/day</li>
                    <li>95% Success Rate</li>
                    <li>Support 24/7</li>
                    <li>Advanced trading tools</li>   
                    <li>Pay using Cryptocurrency</li>
                    <li>Use any broker</li>
                    </ol>

                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6'>
                        <Link 
                        href='/users/register' 
                        className="text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900">Open an Account</Link>
                    </div>
                </div>
                
    </div>
  )
}

export default TradingPlan