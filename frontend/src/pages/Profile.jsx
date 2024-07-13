import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase';
import { toast } from "react-hot-toast"
import LoadingSpinner from '../components/skeletons/LoadingSpinner';
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageUploaded, setImageUploaded] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updated, setUpdated] = useState(false);
  const [getListing, setGetListing] = useState([]);
  const [loadingGet, setLoadingGet] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploaded(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL => {
          setFormData({ ...formData, avatar: downloadURL })
        }))
      }
    )
  }

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const { mutate: handleSignOut } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      })

      const data = await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setUpdated(true);
    }
  })

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/user/update/${authUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setUpdated(true)
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const { mutate: deleteUser, isPending: deleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/user/delete/${authUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser();
  }

  const handleShowListing = async () => {
    setLoadingGet(true);
    try {
      const res = await fetch(`/api/user/listings/${authUser._id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setGetListing(data);
    } catch (error) {
      toast.error(error.message);
    }
    finally{
      setLoadingGet(false);
    }
  }

  const {mutate:deleteList, isPending: deletingList} = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE"
      })
      const data = await res.json();

      if(!res.ok) throw new Error(data.error || "Something went wrong");
    },
    onSuccess: () => {
      handleShowListing();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} className='hidden' accept='image/*' type="file" ref={fileRef} />

        <img onClick={() => fileRef.current.click()} className='cursor-pointer rounded-full h-24 w-24 object-cover self-center mt-2' src={formData.avatar || authUser.avatar} alt="" />

        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error updating image (image must be less than 2 MB)
            </span>
          ) : imageUploaded > 0 && imageUploaded < 100 ? (
            <span className="text-slate-600">{`Uploading ${imageUploaded}%`}</span>
          ) : imageUploaded === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>


        <input
          type="text"
          placeholder='username'
          name="username"
          className='border p-3 rounded-lg mt-2'
          value={formData.username || authUser.username}
          onChange={handleOnChange}
        />

        <input
          type="email"
          placeholder='email'
          name="email"
          onChange={handleOnChange}
          value={formData.email || authUser.email}
          className='border p-3 rounded-lg'
        />

        <input
          type="password"
          placeholder='password'
          name="password"
          className='border p-3 rounded-lg'
          onChange={handleOnChange}
          value={formData.password || ""}
        />

        <button disabled={isPending} type='submit' className='bg-slate-700 uppercase p-2 rounded-md text-lg text-white hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
          {isPending ? <LoadingSpinner /> : "Update"}
        </button>

        <Link to={"/create-listing"} className='bg-green-700 text-center uppercase p-2 rounded-md text-lg text-white hover:bg-green-800 disabled:opacity-80 transition duration-200'>
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5 font-semibold'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={deleteUser}
        >
          {deleting ? "Deleting Account" : "Delete Account"}
        </span>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-green-700 mt-3'>{updated && "User is updated successfully"}</p>

      <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listings</button>

      {loadingGet && 
        <div className='mt-4 flex justify-center items-center'>
          <LoadingSpinner size='lg' />
        </div>
      }
      {!loadingGet && getListing && getListing.length > 0 &&
        <div className='flex flex-col gap-4'>
          <h1 className='text-center my-7 text-2xl font-semibold'>Your Listing</h1>
          {getListing.map(listing => {
            return <div key={listing._id} className='border rounded-lg p-3 flex gap-4 justify-between items-center'>
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing image" className='h-16 w-16 object-contain' />
              </Link>
              <Link to={`/listing/${listing._id}`} className='flex-1 text-slate-600 font-semibold hover:underline truncate'>
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button onClick={() => deleteList(listing._id)} className='text-red-700'>Delete</button>
                <Link to={`/update-listing/${listing._id}`} className='text-green-700'>Edit</Link>
              </div>
            </div>
          })}
        </div>
      }
    </div>
  )
}

export default Profile
