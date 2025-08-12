import { Button } from '@/components/heroui';
import { BsCartX } from 'react-icons/bs';

import { SheetDescription } from '@/components/ui/sheet';

export const CartEmpty = () => {
  return (
    <div className='flex flex-col items-center gap-4'>
      <BsCartX className='mt-5 text-9xl text-gray-200' />

      <SheetDescription className='text-2xl'>No products in the cart.</SheetDescription>

      <Button color='primary' variant='solid' className='max-w-56 text-center font-semibold'>
        RETURN TO SHOP
      </Button>
    </div>
  );
};
