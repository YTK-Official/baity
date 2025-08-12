import { useState } from 'react';
import { IoMoonOutline } from 'react-icons/io5';
import { MdOutlineLightMode } from 'react-icons/md';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className='flex items-center justify-center'>
      <label
        className='relative flex h-3 w-5 cursor-pointer items-center justify-center rounded-full bg-white'
        htmlFor='switch'
      >
        <input
          id='switch'
          className='hidden'
          type='checkbox'
          checked={isDarkMode}
          onChange={toggleTheme}
        />

        {/* Moon Icon */}
        <div
          className={`absolute transform transition-transform duration-500 ${isDarkMode ? 'rotate-360 scale-0' : ''}`}
        >
          <IoMoonOutline className='text-2xl' />
        </div>

        {/* Sun Icon */}
        <div
          className={`absolute scale-0 transform transition-transform duration-500 ${
            isDarkMode ? 'rotate-360 scale-100' : ''
          }`}
        >
          <MdOutlineLightMode className='text-2xl' />
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
