import React from 'react'
import Link from 'next/link'

function page() {
  return (
    <div className='size-fit'>
        <header className='w-full flex flex-col items-center justify-center'>
          <nav className=' 
            w-[105vh]
            flex
            justify-between
            border-2
            border-solid
            border-[#ddd]
            p-5
            gap-96'>
        <div>
            <h2 className='
            text-black
            text-2xl 
            font-mono 
            font-bold'>
            Broker</h2>
        </div>
        <ul className='
            w-full 
            flex 
            gap-18'
          >
              <li className='
              flex
              items-center
              justify-center
              w-29
              h-12.5
              text-black 
              border-[3px]
              border-solid
              border-black
              bg-white
              hover:not-focus:bg-black
              hover:not-focus:text-white
              '>
              <Link href="">About us</Link>
              </li>
              <li className='
              text-black
              font-mono
              flex
              items-center
              justify-center
              w-29
              h-12.5
              border-[3px]
              border-solid
              border-black
              bg-white
              hover:not-focus:bg-black
              hover:not-focus:text-white
              '>
              <Link href="">Contact us</Link></li>
              <li className='
              text-black
              font-mono
              flex
              items-center
              justify-center
              w-22
              h-12.5
              border-[3px]
              border-solid
              border-black
              bg-white
              hover:not-focus:bg-black
              hover:not-focus:text-white
              '>
                <Link href="/users/register">Register</Link></li>
              <li className='
              text-black
              font-mono
              flex
              items-center
              justify-center
              w-20
              h-12.5
              border-[3px]
              border-solid
              border-black
              bg-white
              hover:not-focus:bg-black
              hover:not-focus:text-white
              '>
                <Link href="/users/login">Login</Link></li>
          </ul>
          </nav>
        </header>
    </div>
  )
}

export default page