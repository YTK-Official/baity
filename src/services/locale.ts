'use server';

import { cookies } from 'next/headers';

export const getLocale = async () => {
  const locale = (await cookies()).get('NEXT_LOCALE')?.value || 'en';

  return locale;
};

export const setLocale = async (locale: string) => {
  (await cookies()).set('NEXT_LOCALE', locale, { path: '/' });
};
