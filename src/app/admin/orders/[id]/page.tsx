'use client';

import { Button, Card, CardBody, Divider, Image, Spinner } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getOrderById } from '@/services/order';
import type { Order } from '@/types/order';
import { calcPriceWithoutTax, calculateTax } from '@/utils/calcTax';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiPackage, FiUser } from 'react-icons/fi';

export default function OrderDetailsPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { loading, data: order } = useRequest(getOrderById, {
    defaultParams: [id],
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!order) {
    return (
      <div className='container mx-auto px-4 py-8 text-center'>
        <p className='text-2xl text-muted-foreground'>{t('orders.status.order-not-found')}</p>
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8'>
      <Button
        variant='light'
        startContent={<FiArrowLeft />}
        onPress={() => router.back()}
        className='mb-6'
      >
        {t('orders.details.back-to-orders')}
      </Button>

      <div className='mb-8 flex flex-col items-start justify-between md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 font-bold text-3xl'>{t('orders.details.title', { id })}</h1>
          <p className='text-gray-500'>
            {t('orders.details.placedOn')} {order.createdAt.toLocaleDateString()}{' '}
            {t('orders.details.at')} {order.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <span
          className={`mt-4 rounded-full px-4 py-2 text-sm md:mt-0 ${getStatusColor(order.status)}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <Card className='mb-6'>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiPackage className='mr-2' /> {t('orders.details.order-details')}
              </h2>

              <div className='flex flex-col overflow-hidden rounded-lg border sm:flex-row'>
                <div className='h-32 w-full sm:w-32'>
                  <Image
                    src={order.product.images?.[0]}
                    alt={order.product.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                </div>
                <div className='flex-1 p-4'>
                  <h3 className='font-medium text-lg'>{order.product.name}</h3>
                  <p className='mb-2 text-gray-500'>
                    {t('orders.details.quantity')}: {order.quantity}
                  </p>
                  <p className='font-medium'>
                    {getCurrency(order.product.price)} {t('orders.details.each')}
                  </p>
                </div>
              </div>

              <Divider className='my-6' />

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>{t('orders.details.subtotal')}</span>
                  <span>
                    {getCurrency(calcPriceWithoutTax(order.product.price * order.quantity))}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>{t('orders.details.tax')}</span>
                  <span>{getCurrency(calculateTax(order.product.price * order.quantity))}</span>
                </div>
                <Divider className='my-2' />
                <div className='flex justify-between font-bold text-lg'>
                  <span>{t('orders.details.total')}</span>
                  <span>{getCurrency(order.product.price * order.quantity)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card className='mb-6'>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiUser className='mr-2' /> {t('orders.details.customer-info')}
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-gray-500 text-sm'>{t('orders.details.customer.name')}</h3>
                  <p>{order.user.name}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>{t('orders.details.customer.email')}</h3>
                  <p>{order.user.email}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>{t('orders.details.customer.phone')}</h3>
                  <p>{order.user.phone}</p>
                </div>
                <div>
                  <h3 className='text-gray-500 text-sm'>
                    {t('orders.details.customer.shipping-address')}
                  </h3>
                  <p>{order.address}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
