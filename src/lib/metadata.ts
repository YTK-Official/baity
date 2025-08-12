import type { Metadata } from 'next';

export const mainMetadata: Metadata = {
  title: {
    default: 'Baity - Homemade Food Delivery',
    template: '%s | Baity',
  },
  description: 'Order delicious homemade food from local chefs delivered to your doorstep',
  keywords: ['food delivery', 'homemade food', 'local chefs', 'meal delivery', 'food marketplace'],
  authors: [{ name: 'Baity Team' }],
  creator: 'Baity',
  publisher: 'Baity',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL('https://baity-nextjs.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Baity - Homemade Food Delivery',
    description: 'Order delicious homemade food from local chefs delivered to your doorstep',
    url: 'https://baity.vercel.app',
    siteName: 'Baity',
    images: [
      {
        url: 'https://baity.vercel.app/logo.png',
        width: 1200,
        height: 630,
        alt: 'Baity - Homemade Food Delivery',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baity - Homemade Food Delivery',
    description: 'Order delicious homemade food from local chefs delivered to your doorstep',
    images: ['https://baity.vercel.app/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/logo.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/logo.png',
      },
      {
        rel: 'mask-icon',
        url: '/logo.png',
        color: '#5bbad5',
      },
    ],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'food delivery',
};
