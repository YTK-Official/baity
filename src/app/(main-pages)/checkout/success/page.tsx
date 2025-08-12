'use client';

import { addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { createOrder } from '@/services/order';
import type { NewOrder } from '@/types/order';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

const CheckoutSuccess = () => {
  const router = useRouter();
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const orderData = Object.fromEntries(searchParams.entries()) as unknown as NewOrder;

  useRequest(createOrder, {
    defaultParams: [orderData],
    ready: Object.keys(orderData).length > 0,
    onSuccess: () => {
      addToast({ title: 'Order created successfully', color: 'success' });
      setTimeout(() => {
        router.push('/');
      }, 3000);
    },
    onError: () => {
      addToast({ title: 'Something went wrong, please try again', color: 'danger' });
    },
  });

  return (
    <div className='mx-auto mt-32 w-fit bg-gray-50'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg'>
        <div className='mb-8'>
          <FaCheckCircle className='mx-auto text-6xl text-green-500' />
        </div>
        <h1 className='mb-4 font-bold text-3xl text-gray-900'> {t('success.title')}</h1>
        <p className='mb-8 text-gray-600'>{t('success.description')}</p>
        <div className='space-y-4'>
          <Link
            href='/orders'
            className='block w-full rounded-md bg-green-500 px-4 py-3 text-white transition-colors hover:bg-green-600'
          >
            {t('success.view-orders-button')}
          </Link>
          <Link
            href='/'
            className='block w-full rounded-md bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200'
          >
            {t('common.continue-shopping-button')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
