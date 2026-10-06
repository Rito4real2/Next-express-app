import React from 'react'
import Link from 'next/link'

const TradingGuide = () => {
  return (
    <div>
        <div className='flex flex-col gap-2.5 bg-white-950 text-black p-8'>
            <h1 className='text-bold text-xl font-mono'>Trading Guide</h1>
            <p className='font-mono text-sm'>Welcome to our comprehensive trading guide! Whether you're a beginner or an experienced trader, this guide will provide you with valuable insights and strategies to enhance your trading skills.</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-gray-950 text-white p-4 rounded-lg flex flex-col gap-2.5'>
                    <h2 className='text-bold text-lg font-mono'>Learn</h2>
                    <p className='font-mono text-sm text-[#ddd]'>KNOWLEDGE TO GET STARTED</p>
                    <ul className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm'>
                        <li>FREE Demo Account</li>
                        <li>step-by step tutorials & articles</li>
                        <li>Online webinars & local seminars</li>
                        <li>Your own Account Manager</li>
                    </ul>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                    <Link 
                    href='/users/register'
                    className=" font-mono text-white bg-red-600 rounded-md px-4 py-2 text-center hover:bg-red-900"
                    >Get Started</Link>
                </div>

                </div>

                <div className='bg-gray-950 text-white p-4 rounded-lg flex flex-col gap-2.5'>
                    <h2 className='text-bold text-lg font-mono'>Trade</h2>
                    <p className='font-mono text-sm text-[#ddd]'>TAKE YOUR FIRST PROFIT</p>
                    <ul className='flex flex-col gap-2.5 list-disc list-inside font-mono text-sm'>
                        <li>Tight spreads</li>
                        <li>Superfast trade execution</li>
                        <li>Hi-tech forex trading tools</li>
                        <li>Ultimate risk protection & security</li>
                    </ul>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-11">
                    <Link 
                    href='/users/register'
                    className="text-whitew-full sm:w-auto text-center bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-900 font-medium font-mono text-sm transition cursor-pointer shadow-sm hover:shadow"
                    >Get Started</Link>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TradingGuide