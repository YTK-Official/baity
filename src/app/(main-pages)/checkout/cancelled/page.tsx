import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/translates';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CheckoutCancelled = async () => {
  const t = await getTranslations('checkout');

  return (
    <div className='flex min-h-[60vh] items-center justify-center'>
      <div className='mx-auto max-w-md space-y-6 p-6 text-center'>
        <div className='flex justify-center'>
          <XCircle className='h-24 w-24 text-red-500' />
        </div>

        <h1 className='font-bold text-3xl text-gray-900'>{t('cancelled.title')}</h1>

        <p className='text-gray-600'>{t('cancelled.description')}</p>

        <div className='flex justify-center pt-4'>
          <Link href='/'>
            <Button variant='default' className='flex items-center gap-2'>
              {t('common.continue-shopping-button')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelled;
