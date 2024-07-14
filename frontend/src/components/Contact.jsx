import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [message, setMessage] = useState("");

  const { data: landlord, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.errro || "Something went wrong");

        console.log(`to=${landlord.email}&subject=Regarding ${listing.name}&body=${message}`);
        return data;
      } catch (error) {
        toast.error(error.message);
      }
    }
  })


  return (
    <div>
      {landlord && (
        <div className='flex flex-col gap-3'>
          <p>Contact <span className='font-semibold text-md md:text-lg'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>

          <textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Enter your message here' name="message" id="message" rows={2} className='w-full border p-3 rounded-lg'>
          </textarea>

          <a
            className='text-center w-full p-2 text-lg rounded-lg bg-slate-700 text-white uppercase hover:bg-slate-800'
            target="_blank" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${landlord.email}&body=${message}&subject=Regarding ${listing.name}`}
          >
            Send Message
          </a>

        </div>
      )}
    </div>
  )
}

export default Contact
