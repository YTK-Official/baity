import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { ProductsCarousel } from './ProductsCarousel';

type CardsContainerProps<T> = {
  title: string;
  data: T[];
  Item: React.FC<T>;
  viewAllLink?: string;
};

export const CardsContainer = async <T extends { id?: string | number }>({
  title,
  data,
  Item,
  viewAllLink,
}: CardsContainerProps<T>) => {
  const t = await getTranslations('common');
  return (
    <section className='space-y-4'>
      <div className='container flex items-center justify-between'>
        <h3 className='font-bold text-3xl capitalize'>{title}</h3>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className='font-medium text-base text-primary underline transition-opacity duration-200 hover:opacity-80'
          >
            {t('links.view-all')}
          </Link>
        )}
      </div>
      <ProductsCarousel data={data} Item={Item} />
    </section>
  );
};
