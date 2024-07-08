import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/skeletons/LoadingSpinner'

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/getme");
      const data = await res.json();

      if (data.error) return null;
      return data;
    },
    retry: false
  })

  if(isLoading){
    return (
      <div className='h-screen w-full flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={!authUser ? <Signin /> : <Navigate to={"/"} />} />
        <Route path='/sign-up' element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
