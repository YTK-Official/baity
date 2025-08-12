'use client';

import { Button, Card, CardBody, Spinner } from '@/components/heroui';
import { Image } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getProductById } from '@/services/product';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import { useParams, useRouter } from 'next/navigation';

export default function ChefProductDetailPage() {
  const t = useTranslations('chefs-profile');
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { loading, data: product } = useRequest(getProductById, {
    ready: !!id,
    defaultParams: [id],
  });

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!product) {
    return (
      <div className='py-12 text-center'>
        <p className='mb-4 text-gray-500'>{t('Products-page.product-not-found')}</p>
        <Button onPress={() => router.back()}>{t('Products-page.back-button')}</Button>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <Button variant='flat' onPress={() => router.back()} className='mb-6'>
        {t('Products-page.back-button')}
      </Button>
      <Card className='mx-auto max-w-3xl'>
        <CardBody className='p-6'>
          <div className='flex flex-col gap-8 md:flex-row'>
            <div className='w-full flex-shrink-0 md:w-64'>
              <Image
                src={product.images?.[0] || ''}
                alt={product.name}
                className='h-64 w-full rounded object-cover'
              />
            </div>
            <div className='flex-1'>
              <h1 className='mb-2 font-bold text-2xl'>{product.name}</h1>
              <span
                className={`mb-4 inline-block rounded-full px-3 py-1 text-xs capitalize ${
                  product.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : product.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : product.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {product.status}
              </span>
              <p className='mb-4 text-gray-700'>{product.description}</p>
              <div className='mb-4'>
                <span className='font-semibold'>{t('price')}: </span>
                <span>{getCurrency(product.price)}</span>
              </div>
              <div className='mb-4'>
                <span className='font-semibold'>{t('orders')}: </span>
                <span>{product.orders?.length || 0}</span>
              </div>
              <div className='mb-4'>
                <span className='font-semibold'>{t('Products-page.created-on')}: </span>
                <span>
                  {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className='mt-6 flex gap-2'>
                <Button
                  as='a'
                  href={`/chef/products/edit/${product.id}`}
                  variant='flat'
                  color='primary'
                >
                  {t('Products-page.edit-button')}
                </Button>
              </div>
            </div>
          </div>
          {(product.images?.length ?? 0) > 1 && (
            <div className='mt-8'>
              <h2 className='mb-2 font-semibold'>{t('Products-page.more-images')}</h2>
              <div className='flex flex-wrap gap-2'>
                {product.images?.slice(1).map((img, idx) => (
                  <Image
                    key={img}
                    src={img}
                    alt={`Product image ${idx + 2}`}
                    className='h-24 w-24 rounded object-cover'
                    loading='lazy'
                  />
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </main>
  );
}
