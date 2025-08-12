import { FaRegListAlt } from 'react-icons/fa';
import { FaBoxOpen } from 'react-icons/fa6';
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineRestaurantMenu } from 'react-icons/md';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getTranslatedItems = (t: any) => [
  {
    Icon: IoHomeOutline,
    text: t('links.home'),
    path: '/',
  },
  {
    Icon: MdOutlineRestaurantMenu,
    text: t('links.chefs'),
    path: '/chefs',
  },
  {
    Icon: FaBoxOpen,
    text: t('links.new-arrivals'),
    path: '/products/new-arrivals',
  },
  {
    Icon: FaBoxOpen,
    text: t('links.products'),
    path: '/products',
  },
  {
    Icon: FaRegListAlt,
    text: t('links.orders'),
    path: '/orders',
  },
];
