import React from 'react'
import { FaSearch } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center p-3 max-w-6xl mx-auto'>
        <Link to={"/"}>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Prime</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
          <input type="text" placeholder='Seach...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
          <FaSearch className='text-slate-600' />
        </form>

        <ul className='flex gap-4 font-semibold'>
          <Link to={"/"}>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link to={"/about"}>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
          </Link>
          <Link to={"/sign-in"}>
            <li className='text-slate-700 hover:underline'>Sign in</li>
          </Link>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
