'use client';

import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';

export const BackButton = () => {
  const router = useRouter();

  const goBack = () => router.back();

  return (
    <button type='button' className='group mb-3 bg-transparent' onClick={goBack}>
      <IoIosArrowBack size={28} className='group-hover:-translate-x-1 duration-200' />
    </button>
  );
};
