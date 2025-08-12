import { SignOut } from '@/components/shared/SignOut';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/lib/translates';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Header from './components/Header';

export default async function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authError, user] = await tryCatch(getAuth());
  const t = await getTranslations('chefs-profile');
  if (authError || user.role !== 'chef') {
    redirect('/');
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='flex flex-1'>
        {/* chef Sidebar */}
        <aside className='w-64 bg-gray-800 p-4 text-white'>
          <div className='mb-8 font-bold text-xl'>{t('navigation')}</div>
          <nav className='space-y-2'>
            <Link href='/chef' className='block rounded px-4 py-2 hover:bg-gray-700'>
              {t('nav-dashboard')}
            </Link>
            <Link href='/chef/orders' className='block rounded px-4 py-2 hover:bg-gray-700'>
              {t('orders')}
            </Link>
            <Link href='/chef/products' className='block rounded px-4 py-2 hover:bg-gray-700'>
              {t('products')}
            </Link>
            <SignOut />
          </nav>
        </aside>

        {/* Main Content */}
        <div className='flex-1 space-y-16 overflow-auto px-8 pb-8'>
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
