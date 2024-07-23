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
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

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
        <Route path='/search' element={<Search />} />
        <Route path='/sign-in' element={!authUser ? <Signin /> : <Navigate to={"/"} />} />
        <Route path='/sign-up' element={!authUser ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/about' element={<About />} />
        <Route path='/listing/:id' element={<Listing />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to={"/sign-in"} />} />
        <Route path='/create-listing' element={authUser ? <CreateListing /> : <Navigate to={"/sign-in"} />} />
        <Route path='/update-listing/:id' element={authUser ? <UpdateListing /> : <Navigate to={"/sign-in"} />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
