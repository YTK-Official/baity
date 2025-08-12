import Link from 'next/link';

import { getTranslations } from '@/lib/translates';
import { getTranslatedItems } from './data';

export const NavbarMobile = async () => {
  const t = await getTranslations('common');
  const items = getTranslatedItems(t);

  return (
    <ul className="fixed bottom-0 z-50 flex h-14 w-full items-center justify-between gap-4 bg-background px-4 shadow-large sm:hidden">
      {items.map(({ text, Icon, path }) => (
        <Link href={path} key={text}>
          <li className="flex flex-col items-center">
            <Icon className="text-[22px]" />
            <span className="text-xs">{text}</span>
          </li>
        </Link>
      ))}
    </ul>
  );
};
