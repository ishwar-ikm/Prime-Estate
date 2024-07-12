import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/skeletons/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const navigate = useNavigate();

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          })
        }
      )
    })
  }


  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(false);
        setUploading(false);
      }).catch(err => {
        setImageUploadError(`Image upload failed (Max size 2 mb per image) ${err}`);
        setUploading(false);
      })
    } else {
      if (files.length == 0) {
        setImageUploadError("Choose some image to upload");
      }
      else {
        setImageUploadError("Can upload only 6 images");
      }
      setUploading(false);
    }
  }

  const handleInputChange = (e) => {
    if (e.target.id === "furnished" || e.target.id === "parking" || e.target.id === "offer") {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async () => {
      if (formData.imageUrls.length < 1) throw new Error("Listing must have atleast 1 image");
      if (formData.offer && +formData.regularPrice < +formData.discountPrice) throw new Error("Discounted price must be less than regular price");
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: authUser._id })
      })
      const data = res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    onSuccess: (data) => {
      toast.success("Listing created");
      setFormData({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
      });
      setFiles([]);
      navigate(`/listing/${data._id}`);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  }

  return (
    <div className='p-3 max-w-4xl mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type="text"
            placeholder='Name'
            className='border p-3 rounded-lg'
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            type="text"
            placeholder='Description'
            className='border p-3 rounded-lg'
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder='Address'
            className='border p-3 rounded-lg'
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type="checkbox"
                name="type"
                value="sale"
                className='w-5'
                checked={formData.type === "sale"}
                onChange={handleInputChange}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type="checkbox"
                name="type"
                value="rent"
                className='w-5'
                checked={formData.type === "rent"}
                onChange={handleInputChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type="checkbox"
                name="parking"
                id="parking"
                className='w-5'
                checked={formData.parking}
                onChange={handleInputChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type="checkbox"
                name="furnished"
                id="furnished"
                className='w-5'
                checked={formData.furnished}
                onChange={handleInputChange}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type="checkbox"
                name="offer"
                id="offer"
                className='w-5'
                checked={formData.offer}
                onChange={handleInputChange}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                name="bedrooms"
                className='p-2 border border-green-300 rounded-lg'
                min={1}
                max={10}
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                name="bathrooms"
                className='p-2 border border-green-300 rounded-lg'
                min={1}
                max={10}
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                name="regularPrice"
                className='p-2 border border-green-300 rounded-lg'
                value={formData.regularPrice}
                onChange={handleInputChange}
                required
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                {formData.type === "rent" &&
                  <p className='text-xs'>(₹/month)</p>
                }
              </div>
            </div>

            {formData.offer &&
              <div className='flex items-center gap-2'>
                <input
                  type="number"
                  name="discountPrice"
                  className='p-2 border border-green-300 rounded-lg'
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  required
                />
                <div className='flex flex-col items-center'>
                  <p>Discount Price</p>
                  {formData.type === "rent" &&
                    <p className='text-xs'>(₹/month)</p>
                  }
                </div>
              </div>
            }
            <p className='text-red-700'>{formData.offer && +formData.regularPrice <= +formData.discountPrice && "Regular price must be less than discounted price"}</p>
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images: <span className='font-normal text-green-600 ml-2'>first image will be the cover {"max 6"}</span></p>

          <div className='flex gap-4'>
            <input onChange={e => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="images" accept='image/*' multiple />
            <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? "Uploading..." : "Upload"}</button>
          </div>

          <p className='text-red-700'>{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, i) => {
              return <div key={url} className='flex justify-between p-3 border items-center'>
                <img src={url} alt="lising image" className='w-20 h-20 contain-content rounded-lg' />
                <button type='button' onClick={() => handleRemoveImage(i)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-95'>Delete</button>
              </div>
            })
          }

          <button disabled={isPending || uploading} type='submit' className='bg-slate-700 uppercase p-2 rounded-md text-lg text-white hover:bg-slate-800 disabled:opacity-80 transition duration-200'>
            {isPending ? <LoadingSpinner /> : "Create List"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateListing
