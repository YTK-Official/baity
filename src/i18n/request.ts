import { getLocale } from '@/services/locale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const cookieLocale = await getLocale();

  return {
    locale: cookieLocale,
    messages: (await import(`../../messages/${cookieLocale}.json`)).default,
  };
});
