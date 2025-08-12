'use client';

import { Button, Card, CardBody, Image } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import type { Product } from '@/types/product';
import Link from 'next/link';
import type { FC } from 'react';
import { CardPrice } from '../../components/ProductCard/CardPrise';
import { Spotlight } from '../../components/motion/spotlight';

interface ProductCardProps {
  product: Product;
  onView?: (id: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onView }) => {
  const t = useTranslations('cards');
  return (
    <div className='relative overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex aspect-[2/3] h-full flex-col gap-4 p-2'>
          <figure className='relative h-full w-full overflow-hidden'>
            <Link href={`/products/${product.id}`}>
              <Image
                className='size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={product.images?.[0] ?? ''}
                alt={product.name}
                loading='lazy'
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <Link href={`/products/${product.id}`}>
                <h4 className='line-clamp-1 font-semibold text-sm duration-250 hover:opacity-60'>
                  {product.name}
                </h4>
              </Link>
              <p className='line-clamp-2 font-semibold text-sm duration-250 hover:opacity-60'>
                {product.description}
              </p>
              <CardPrice total={product.price} />
            </figcaption>
          </figure>

          <Button
            className='bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/products/${product.id}`}
          >
            {t('view')}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductCard;
