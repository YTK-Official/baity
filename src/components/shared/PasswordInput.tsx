'use client';

import { Input } from '@/components/heroui';
import { type ComponentProps, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type PasswordInputProps = ComponentProps<typeof Input>;

export const PasswordInput = ({ label = 'Password', ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      type={isVisible ? 'text' : 'password'}
      name='password'
      size='sm'
      label={label}
      endContent={
        <button
          className='focus:outline-none'
          type='button'
          onClick={toggleVisibility}
          aria-label='toggle password visibility'
        >
          {isVisible ? (
            <FaEye className='pointer-events-none text-2xl text-default-400' />
          ) : (
            <FaEyeSlash className='pointer-events-none text-2xl text-default-400' />
          )}
        </button>
      }
      {...props}
    />
  );
};
