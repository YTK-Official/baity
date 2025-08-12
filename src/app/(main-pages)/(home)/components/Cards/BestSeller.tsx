'use client';

import { Spotlight } from '@/app/(main-pages)/components/motion/spotlight';
import { Button, Card, CardBody, Image } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { cn } from '@/lib/utils';
import type { getBestSellers } from '@/services/user';
import Link from 'next/link';
import { MdVerified } from 'react-icons/md';

type BestSellerProps = Awaited<ReturnType<typeof getBestSellers>>[number];

export const BestSellerCard = ({ id, image, name, emailVerified, online }: BestSellerProps) => {
  const tStatus = useTranslations('status');
  const tCards = useTranslations('cards');

  return (
    <div className='relative overflow-hidden rounded-xl p-px duration-500'>
      <Spotlight className='from-blue-600 via-blue-500 to-blue-400 blur-2xl' size={250} />
      <Card className='group border-none pt-1 pb-2' radius='md'>
        <CardBody className='flex aspect-[2/3] h-full flex-col gap-4 p-2'>
          <figure className='relative h-full w-full overflow-hidden'>
            <Link href={`/chefs/${id}`}>
              <Image
                className='aspect-square size-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105'
                src={image ?? ''}
                alt={name}
                width={200}
                height={200}
                loading='lazy'
              />
            </Link>
            <figcaption className='px-1.5 pt-3'>
              <p
                className={cn(
                  'absolute top-1 right-1 z-10 inline-flex items-center rounded-full px-3 py-1 font-medium text-sm backdrop-blur-xl',
                  online ? 'bg-green-100/40 text-green-800' : 'bg-red-100/40 text-red-800',
                )}
              >
                <span
                  className={cn(
                    'mr-1 h-2 w-2 rounded-full',
                    online ? 'bg-green-400' : 'bg-red-400',
                  )}
                />
                {online ? `${tStatus('online')}` : `${tStatus('offline')}`}
              </p>
              <Link href={`/chefs/${id}`} className='flex items-center gap-1'>
                <h4 className='line-clamp-2 flex-1 font-semibold text-sm duration-250 hover:opacity-60 sm:text-base'>
                  {name}
                </h4>
                {emailVerified && <MdVerified className='text-blue-600' />}
              </Link>
            </figcaption>
          </figure>

          <Button
            className='bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm'
            fullWidth
            as={Link}
            href={`/chefs/${id}`}
          >
            {tCards('view')}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
