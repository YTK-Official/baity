'use client';

import { useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';

import { cn } from '@/lib/utils';

export const WishlistHeartBtn = () => {
  const [isLoved, setIsLoved] = useState(false);

  const toggleLove = () => setIsLoved(!isLoved);

  return (
    <button
      type='button'
      className='relative flex h-3 w-5 cursor-pointer items-center justify-center *:absolute *:transform *:transition-transform *:duration-500'
      onClick={toggleLove}
    >
      <GoHeart className={cn({ 'rotate-360 scale-0': isLoved })} color='red' size={20} />

      <GoHeartFill
        className={cn('scale-0', { 'rotate-360 scale-100': isLoved })}
        size={20}
        color='red'
      />
    </button>
  );
};

export const BackButton = () => {
  const [isLoved, setIsLoved] = useState(false);

  const toggleLove = () => setIsLoved(!isLoved);

  return (
    <button
      type='button'
      className='relative flex h-3 w-5 cursor-pointer items-center justify-center *:absolute *:transform *:transition-transform *:duration-500'
      onClick={toggleLove}
    >
      <GoHeart className={cn({ 'rotate-360 scale-0': isLoved })} color='red' size={20} />

      <GoHeartFill
        className={cn('scale-0', { 'rotate-360 scale-100': isLoved })}
        size={20}
        color='red'
      />
    </button>
  );
};
