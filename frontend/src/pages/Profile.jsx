import { useQuery } from '@tanstack/react-query'
import React from 'react'

const Profile = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4'>
        <img className='rounded-full h-24 w-24 object-cover self-center mt-2' src={authUser.avatar} alt="" />

        <input
          type="text"
          placeholder='username'
          name="username"
          className='border p-3 rounded-lg mt-2'
        />

        <input
          type="email"
          placeholder='email'
          name="username"
          className='border p-3 rounded-lg'
        />

        <input
          type="password"
          placeholder='password'
          name="username"
          className='border p-3 rounded-lg'
        />

        <button type='submit' className='bg-slate-700 p-2 rounded-md text-lg text-white capitalize hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
          Update
        </button>
      </form>

      <div className='flex justify-between mt-5 font-semibold'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
