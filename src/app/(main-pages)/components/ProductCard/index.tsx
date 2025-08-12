'use client';

import { Card, CardBody, Image } from '@/components/heroui';
import Link from 'next/link';

import { Spotlight } from '../motion/spotlight';
import { AddToCartBtn } from './AddToCartBtn';
import { BuyNowBtn } from './BuyNowBtn';
import { CardPrice } from './CardPrise';

type ProductCardProps = {
  id: string;
  name: string;
  total: number;
  description: string;
  images: string[];
};

export const ProductCard = ({ name, total, images }: ProductCardProps) => {
  return (
    <div className='relative min-w-36 max-w-72 overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group border-none pt-1 pb-2' radius='md'>
        <CardBody className='p-2'>
          <figure className='max-w-72 content-center items-center'>
            <Link href='product-details'>
              <Image
                className='rounded-xl object-cover object-top'
                src={images[0]}
                alt={name}
                width={200}
                height={200}
              />
            </Link>
            <figcaption className='px-1.5 pt-1'>
              <Link href='product-details'>
                <h4 className='line-clamp-3 font-semibold text-sm duration-250 hover:opacity-60'>
                  {name}
                </h4>
              </Link>
              <CardPrice total={total} />
            </figcaption>
          </figure>

          <div className='flex w-full items-center justify-center gap-1 px-8 pt-2'>
            <BuyNowBtn />
            <AddToCartBtn />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
