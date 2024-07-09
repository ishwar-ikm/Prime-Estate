import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase';
import { toast } from "react-hot-toast"
import LoadingSpinner from '../components/skeletons/LoadingSpinner';

const Profile = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imageUploaded, setImageUploaded] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updated, setUpdated] = useState(false);

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
      try {
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
      } catch (error) {
        toast.error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      setUpdated(true)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser();
  }

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

        <button disabled={isPending} type='submit' className='bg-slate-700 p-2 rounded-md text-lg text-white capitalize hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
          {isPending ? <LoadingSpinner /> : "Update"}
        </button>
      </form>

      <div className='flex justify-between mt-5 font-semibold'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-green-700 mt-3'>{updated && "User is updated successfully" }</p>
    </div>
  )
}

export default Profile
