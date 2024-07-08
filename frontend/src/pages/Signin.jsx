import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/skeletons/LoadingSpinner';
import toast from 'react-hot-toast';
import OAuth from '../components/OAuth';

const Signin = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const queryClient = useQueryClient(); 

  const navigate = useNavigate();

  const { mutate: signInUser, isPending } = useMutation({
    mutationFn: async () => {

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

    },
    onSuccess: () => {
      setFormData({
        username: "",
        password: ""
      });
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signInUser();
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text"
          className='w-full rounded-md p-2'
          placeholder='Username'
          name="username"
          onChange={handleChange}
          required />

        <input type="password"
          className='w-full rounded-md p-2'
          placeholder='Password'
          name="password"
          onChange={handleChange}
          required />

        <button disabled={isPending} type='submit' className='bg-slate-700 p-2 rounded-md text-lg text-white capitalize hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
          {isPending ? <LoadingSpinner /> : "Sign in"}
        </button>

        <OAuth />

      </form>
      <div>
        <Link to={"/sign-up"}>
          <p className="text-blue-700 mt-4 hover:underline">Dont have an account?</p>
        </Link>
      </div>
    </div>
  )
}

export default Signin
