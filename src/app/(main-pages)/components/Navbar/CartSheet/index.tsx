'use client';

import { Button } from '@/components/heroui';
import Link from 'next/link';
import { PiShoppingCartSimple } from 'react-icons/pi';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getCurrency } from '@/utils/price';

import { CartEmpty } from './CartEmpty';
import { ProductCard } from './ProductCard';

type AddToCartSheetProps = {
  data: unknown[];
};

export const CartSheet = ({ data }: AddToCartSheetProps) => {
  return (
    // modal={false}
    <Sheet>
      <SheetTrigger asChild>
        <button type='button'>
          <PiShoppingCartSimple size={24} className='max-sm:hidden' />
        </button>
      </SheetTrigger>

      <SheetContent className='min-h-screen bg-white px-0' aria-describedby='cart-description'>
        <SheetHeader>
          <SheetTitle className='px-5 font-bold text-2xl'>SHOPPING CART</SheetTitle>

          <div className='h-[1px] w-full bg-gray-200' />
        </SheetHeader>

        <div className='h-[88%] overflow-y-scroll'>
          {data?.length > 0 ? (
            data.map((_, index) => <ProductCard key={index.toString()} />)
          ) : (
            <CartEmpty />
          )}
        </div>

        <SheetFooter className='absolute bottom-0 my-2 h-[12%] w-full pt-4 sm:flex-col'>
          {data.length < 3 && <div className='h-[1px] w-full bg-gray-200' />}

          <div className='space-y-3 bg-white pt-2 pr-4 pl-2'>
            <div className='flex w-full flex-wrap justify-between gap-2'>
              <span className='font-bold text-2xl'>SUBTOTAL:</span>
              <span className='font-semibold text-2xl'>{getCurrency(799)}</span>
            </div>

            <div className='space-y-2'>
              <Button
                size='lg'
                variant='flat'
                className='w-full bg-gray-200 font-semibold text-black'
                as={Link}
                href={'/cart'}
              >
                VIEW CART
              </Button>
              <Button
                size='lg'
                color='primary'
                variant='solid'
                className='w-full font-semibold'
                as={Link}
                href={'/checkout'}
              >
                CHECKOUT
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
