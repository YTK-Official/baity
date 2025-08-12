'use client';

import { Button, Image, Link } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getAuth } from '@/services/user';
import { useRequest } from 'ahooks';
import type React from 'react';
import { useLocale } from 'next-intl';
import { IoLanguageSharp } from 'react-icons/io5';
import { setLocale } from '@/services/locale';

const Header: React.FC = () => {
  const { data: auth } = useRequest(getAuth);
  const t = useTranslations('admin');
  const locale = useLocale();

  return (
    <header className='bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <h1 className='font-bold text-2xl text-gray-900'>{t('dashboard.title')}</h1>
          <div className='flex items-center'>
            <Button
              variant='faded'
              color='primary'
              size='md'
              className='me-4'
              onPress={async () => {
                // 'use server';
                await setLocale(locale === 'en' ? 'ar' : 'en');
              }}
            >
              <IoLanguageSharp size={19} />
              <p className='uppercase font-semibold'>{locale}</p>
            </Button>
            <span className='inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-medium text-green-800 text-sm'>
              <span className='mr-1 h-2 w-2 rounded-full bg-green-400' />
              {t('products.status.online')}
            </span>
            <Link href='/profile' className=' flex items-center'>
              <Image
                className='h-8 w-8 rounded-full'
                src={auth?.image ?? '/default-avatar.png'}
                alt='Admin'
                draggable='false'
              />
              <span className='ml-2 font-medium text-gray-700 text-sm'>
                {auth?.name ?? 'Admin'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
