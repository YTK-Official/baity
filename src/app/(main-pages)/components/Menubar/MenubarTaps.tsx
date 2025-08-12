import { Divider } from '@/components/heroui';
import { getTranslations } from '@/lib/translates';
import { getAuth } from '@/services/user';
import { tryCatch } from '@/utils/tryCatch';
import Link from 'next/link';

export async function MenubarTaps() {
  const [authError] = await tryCatch(getAuth());
  const t = await getTranslations('common');

  return (
    <div className="flex h-6 items-center space-x-4 text-small">
      <Link
        href="/"
        color="foreground"
        className="cursor-pointer font-semibold text-black uppercase"
      >
        {t('links.home')}
      </Link>
      <Divider orientation="vertical" />
      <Link
        href="/chefs"
        color="foreground"
        className="cursor-pointer font-semibold text-black uppercase"
      >
        {t('links.chefs')}
      </Link>
      <Divider orientation="vertical" />
      <Link
        href="/products/new-arrival"
        className="cursor-pointer font-semibold text-black uppercase"
      >
        {t('links.new-arrivals')}
      </Link>
      <Divider orientation="vertical" />
      <Link
        href="/products"
        className="cursor-pointer font-semibold text-black uppercase"
      >
        {t('links.products')}
      </Link>
      <Divider orientation="vertical" />
      {authError ? (
        <Link
          href="/auth/login"
          className="cursor-pointer font-semibold text-black uppercase"
        >
          {t('links.login')}
        </Link>
      ) : (
        <Link
          href="/orders"
          className="cursor-pointer font-semibold text-black uppercase"
        >
          {t('links.orders')}
        </Link>
      )}
    </div>
  );
}
