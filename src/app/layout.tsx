import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Providers } from '@/providers';
import '../styles/globals.css';
import { mainMetadata } from '@/lib/metadata';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale}>
          <Providers>
            <div className='min-h-screen overflow-y-auto'>{children}</div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export const metadata = mainMetadata;
export default RootLayout;
