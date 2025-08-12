'use client';

import { Spotlight } from '@/app/(main-pages)/components/motion/spotlight';
import { Button, Card, CardBody, Image } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { cn } from '@/lib/utils';
import type { User } from '@/types/user';
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';

export const ChefCard = ({ id, name, image, emailVerified, online }: User) => {
  const t = useTranslations('chefs');
  return (
    <div className='relative w-full overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group h-full border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex h-full flex-col gap-4 p-2'>
          <figure className='relative h-full w-full overflow-hidden'>
            <p
              className={cn(
                'absolute top-1 right-1 z-20 inline-flex items-center rounded-full px-3 py-1 font-medium text-sm backdrop-blur-xl',
                online ? 'bg-green-100/40 text-green-800' : 'bg-red-100/40 text-red-800',
              )}
            >
              <span
                className={cn('mr-1 h-2 w-2 rounded-full', online ? 'bg-green-400' : 'bg-red-400')}
              />
              {online ? t('card.online') : t('card.offline')}
            </p>
            <Link href={`/chefs/${id}`}>
              <Image
                className='size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={image ?? ''}
                alt={name}
                loading='lazy'
                width={270}
                height={270}
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <Link href={`/chefs/${id}`} className='flex items-center gap-1'>
                <h4 className='line-clamp-2 flex-1 font-semibold text-sm duration-250 hover:opacity-60 sm:text-base'>
                  {name}
                </h4>
                {emailVerified && <MdVerified className='text-blue-600' />}
              </Link>
            </figcaption>
          </figure>

          <Button
            className='mt-auto w-full bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/chefs/${id}`}
          >
            {t('view-profile')}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
