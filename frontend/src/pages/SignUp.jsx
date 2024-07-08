import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast";
import LoadingSpinner from "../components/skeletons/LoadingSpinner";
import OAuth from "../components/OAuth";

const SignUp = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: ""
  });

  const navigate = useNavigate();

  const { mutate: postUser, isPending } = useMutation({
    mutationFn: async () => {

      if(formData.password !== formData.confirmPassword){
        throw new Error("Passwords do not match");
      }

      const res = await fetch("/api/auth/signup", {
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

      console.log(data);

    },
    onSuccess: () => {
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        email: ""
      });
      navigate("/sign-in");
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
    postUser();
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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

        <input type="password"
          className='w-full rounded-md p-2'
          placeholder='Password'
          name="password"
          onChange={handleChange}
          required />

        <input type="password"
          className='w-full rounded-md p-2'
          placeholder='Confirm Password'
          name="confirmPassword"
          onChange={handleChange}
          required />

        <button disabled={isPending} type='submit' className='bg-slate-700 p-2 rounded-md text-lg text-white capitalize hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
          {isPending ? <LoadingSpinner /> : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div>
        <Link to={"/sign-in"}>
          <p className="text-blue-700 mt-4 hover:underline">Have an account?</p>
        </Link>
      </div>
    </div>
  )
}

export default SignUp
