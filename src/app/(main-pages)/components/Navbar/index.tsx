import { Button, Image } from '@/components/heroui';
import { getTranslations } from '@/lib/translates';
import { getLocale, setLocale } from '@/services/locale';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';
import { IoLanguageSharp } from 'react-icons/io5';
import { MdOutlineShoppingBag } from 'react-icons/md';
import MainPagesMobileSheet from './MainPagesMobileSheet';

export const Navbar = async () => {
  const [authError, user] = await tryCatch(getAuth());
  const locale = await getLocale();
  const t = await getTranslations('layout');

  return (
    <nav className='container flex items-center justify-between gap-8 pt-3'>
      <Link href='/' className='w-36'>
        <Image alt='baity logo' src='/logo.png' fetchPriority='high' width={60} height={60} />
      </Link>

      <div className='flex items-center gap-4'>
        <div className='sm:hidden'>
          <MainPagesMobileSheet isLoggedIn={!authError} />
        </div>

        <Button
          variant='faded'
          color='primary'
          size='md'
          onPress={async () => {
            'use server';
            await setLocale(locale === 'en' ? 'ar' : 'en');
          }}
        >
          <IoLanguageSharp size={19} />
          <p className='uppercase font-semibold'>{locale}</p>
        </Button>

        <Button variant='faded' color='primary' as={Link} href='/contact'>
          <p className='uppsercase font-semibold'> {t('contact-us')}</p>
        </Button>

        {authError || !user ? (
          <Link href='/auth/login' className='max-sm:hidden'>
            <Button
              variant='flat'
              className='bg-gradient-to-tr from-customBlue to-customLightBlue w-28 font-semibold text-white shadow-lg'
            >
              {t('login')}
            </Button>
          </Link>
        ) : (
          <>
            <Link href='/orders' className='max-sm:hidden'>
              <MdOutlineShoppingBag size={24} />
            </Link>
            <Link href='/profile' className='max-sm:hidden'>
              <Image
                src={user.image || '/default-avatar.png'}
                alt={user.name || 'User'}
                width={40}
                height={40}
                fetchPriority='high'
                className='h-10 max-h-10 min-h-10 w-10 min-w-10 max-w-10 rounded-full border-2 border-primary object-cover shadow'
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
