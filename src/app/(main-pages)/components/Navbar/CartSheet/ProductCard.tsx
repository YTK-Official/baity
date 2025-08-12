import { Button, Chip } from '@/components/heroui';

import { getCurrency } from '@/utils/price';

export const ProductCard = () => {
  return (
    <div className='cardContainer'>
      <div className='my-3 flex items-center justify-between gap-2'>
        <img width={100} alt='Product preview' src='razer.jpg' loading='lazy' />
        <div>
          <p className='mb-2 line-clamp-3'>
            Razer DeathAdder Essential (2021) - Wired Gaming Mouse (Optical Sensor, 6400 DPI, 5
            Programmable Buttons, Ergonomic Form Factor) Black
          </p>

          <div>
            <div className='flex flex-wrap items-center justify-between gap-1'>
              <Counter />

              <Button size='sm' variant='solid' color='danger' className='mr-2 font-semibold'>
                REMOVE
              </Button>
            </div>
            <p className='pt-2 pr-4 font-semibold text-sm'>
              <span className='text-gray-300'>1 × </span>
              {getCurrency(799)}
            </p>
          </div>
        </div>
      </div>
      <div className='h-[1px] w-full bg-gray-200' />
    </div>
  );
};

const Counter = () => {
  return (
    <div className='flex items-center'>
      <Button
        size='sm'
        isIconOnly
        variant='bordered'
        className='w-6 min-w-0 gap-0 rounded-none rounded-l-md'
      >
        <span className='text-center text-l'>-</span>
      </Button>
      <Chip variant='bordered' radius='none' className='h-8 border-x-0 px-4'>
        1
      </Chip>
      <Button
        size='sm'
        isIconOnly
        variant='bordered'
        className='w-6 min-w-0 gap-0 rounded-none rounded-r-md'
      >
        <span className='text-center text-l'>+</span>
      </Button>
    </div>
  );
};
