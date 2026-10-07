import React from 'react'

const SetupSteps = () => {
  const steps = [
    {
      stepNumber: 1,
      title: 'Register',
      description: 'Sign up for a trading account with Profit Inc.',
    },
    {
      stepNumber: 2,
      title: 'Fund',
      description: 'Fund your account using our funding options.',
    },
    {
      stepNumber: 3,
      title: 'Trade',
      description: 'Access 180+ financial instruments across our application.',
    },
  ]

  return (
    <div>
      {/* SECTION WITH TWO-SHADE RED LINEAR GRADIENT */}
      <section className='bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white py-10 px-4'>
        {/* HEADER */}
        <div className='flex flex-col gap-2 items-center text-center max-w-2xl mx-auto mb-8'>
          <span className='text-sm font-mono text-red-200 uppercase tracking-wider'>
            Start Trading with Profit Inc.
          </span>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight font-mono'>
            Fast Account Opening in 3 Simple Steps
          </h1>
        </div>

        {/* RESPONSIVE STEPS CONTAINER */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start justify-items-center'>
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className='flex flex-col gap-3 items-center text-center w-full max-w-[280px] font-mono'
            >
              {/* NUMBER BADGE - FULLY CENTERED */}
              <span className='flex items-center justify-center text-xl font-bold rounded-full bg-red-600 shadow-md w-12 h-12 text-white shrink-0 font-mono'>
                {step.stepNumber}
              </span>

              {/* STEP CONTENT */}
              <h2 className='font-bold text-lg font-mono text-white'>
                {step.title}
              </h2>
              <p className='text-sm text-red-100 leading-relaxed font-mono'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default SetupSteps