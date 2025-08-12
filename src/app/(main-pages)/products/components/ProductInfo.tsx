'use client';

import { Chip } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import type { getProductById } from '@/services/product';
import { getCurrency } from '@/utils/price';
import Link from 'next/link';
import CheckoutButton from './CheckoutButton';

type ProductInfoProps = Awaited<ReturnType<typeof getProductById>> & {
  totalOrders: number;
};

const ProductInfo: React.FC<ProductInfoProps> = ({
  id,
  name,
  price,
  description,
  user,
  totalOrders,
  status,
}) => {
  const t = useTranslations('products');

  return (
    <section className='flex flex-1 flex-col justify-between'>
      <section className='mb-8'>
        <h1 className='mb-2 font-bold text-3xl'>{name}</h1>
        <p className='mb-4 font-bold text-2xl text-primary'>{getCurrency(price)}</p>
        {description && <p className='mb-6 text-gray-600'>{description}</p>}
      </section>
      {user && (
        <section className='mb-8'>
          <h2 className='mb-2 font-semibold text-lg'>{t('seller')}</h2>
          <Link href={`/chefs/${user.id}`} className='font-semibold text-primary underline'>
            {user.name}
          </Link>
          <p className='text-gray-500 text-sm'>
            {t('labels.email')}: <span className='font-semibold'>{user.email}</span>
          </p>
        </section>
      )}
      <section className='mb-8'>
        <h2 className='mb-2 font-semibold text-lg'>{t('sales-info')}</h2>
        <p className='text-gray-500 text-sm'>
          {t('total-orders')}: <span className='font-semibold'>{totalOrders}</span>
        </p>
      </section>

      {status === 'active' ? (
        <>
          <Chip className='mb-3' radius='sm' color='success'>
            Available
          </Chip>

          <CheckoutButton productId={id} />
        </>
      ) : (
        <Chip className='mb-3' color='danger'>
          Not Available
        </Chip>
      )}
    </section>
  );
};

export default ProductInfo;
