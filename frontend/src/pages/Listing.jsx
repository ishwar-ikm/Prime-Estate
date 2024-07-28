import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/skeletons/LoadingSpinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed, FaChair, FaParking } from 'react-icons/fa';
import { BsFillSignNoParkingFill } from 'react-icons/bs';
import Contact from '../components/Contact';

const Listings = () => {
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [contact, setContact] = useState(false);

  SwiperCore.use([Navigation]);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading, isRefetching } = useQuery({
    queryKey: ['listing'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/listing/list/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        return data;
      } catch (error) {
        navigate(-1);
      }
    },
  });

  if (isLoading || isRefetching) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <LoadingSpinner size={'lg'} />
      </div>
    );
  }

  return (
    <main>
      <>
        <Swiper navigation>
          {listing.imageUrls.map((url) => {
            return (
              <SwiperSlide key={url}>
                <div
                  className='h-[300px] md:h-[500px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>

      <div className='my-5 max-w-5xl mx-auto p-3 flex flex-col gap-6'>
        <h1 className='text-2xl md:text-4xl font-semibold'>
          <span className='capitalize'>{listing.name}</span> -{' '}
          {listing.type === 'rent'
            ? `₹${listing.regularPrice.toLocaleString('en-IN')} per month`
            : `₹${listing.regularPrice.toLocaleString('en-IN')}`}
        </h1>

        <div className='flex flex-col gap-2'>
          <p className='text-md md:text-lg text-slate-500 flex items-center gap-2 font-bold'>
            <MdLocationOn />
            {listing.address}
          </p>
          <div className='flex text-white font-semibold gap-5'>
            <p className='bg-red-700 py-2 w-[40%] md:w-[20%] capitalize rounded-md text-center'>
              For {listing.type}
            </p>
            {listing.offer && (
              <p className='bg-green-700 py-2 w-[40%] md:w-[20%] capitalize rounded-md text-center'>
                ₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} discount
              </p>
            )}
          </div>
        </div>

        <p className='text-md md:text-lg'>
          <span className='font-bold'>Description - </span>
          {listing.description}
        </p>

        <div className='flex flex-wrap gap-3 md:gap-10 text-md md:text-lg text-green-800'>
          <p className='flex items-center gap-2 font-semibold'>
            <FaBed />
            {listing.bedrooms} {listing.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
          </p>
          <p className='flex items-center gap-2 font-semibold'>
            <FaBath />
            {listing.bathrooms} {listing.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}
          </p>
          <p className='flex items-center gap-2 font-semibold'>
            {listing.parking ? <FaParking /> : <BsFillSignNoParkingFill />}
            {listing.parking ? '' : 'No '}Parking
          </p>
          <p className='flex items-center gap-2 font-semibold'>
            <FaChair />
            {listing.furnished ? '' : 'Not '}Furnished
          </p>
        </div>

        {authUser && !contact && authUser._id !== listing.userRef && (
          <button onClick={() => setContact(true)} className='w-full p-2 text-lg rounded-lg bg-slate-700 text-white uppercase hover:bg-slate-800'>
            Contact Landlord
          </button>
        )}

        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
};

export default Listings;
