import { useState } from "react"
import { Link } from "react-router-dom"

const SignUp = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text"
          className='w-full rounded-md p-2'
          placeholder='Username'
          name="username"
          onChange={handleChange}
          required />

        <input type="email"
          className='w-full rounded-md p-2'
          placeholder='Email'
          name="email"
          onChange={handleChange}
          required />

        <input type="text"
          className='w-full rounded-md p-2'
          placeholder='Password'
          name="password"
          onChange={handleChange}
          required />

        <input type="text"
          className='w-full rounded-md p-2'
          placeholder='Confirm Password'
          name="confirmPassword"
          onChange={handleChange}
          required />

        <button type='submit' className='bg-slate-700 p-2 rounded-md text-lg text-white hover:bg-slate-800 disabled:opacity-80 transition duration-200'>Sign Up</button>
      </form>
      <div>
        <Link>
          <p className="text-blue-700 mt-4 hover:underline">Have an account?</p>
        </Link>
      </div>
    </div>
  )
}

export default SignUp
