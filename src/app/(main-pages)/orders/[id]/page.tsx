'use client';

import { Button, Card, CardBody, Image, Spinner } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getOrderById } from '@/services/order';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiCheck, FiClock, FiPackage, FiUser } from 'react-icons/fi';

export default function OrderDetailsPage() {
  const t = useTranslations('orders');
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { loading, data: order } = useRequest(getOrderById, {
    ready: !!id,
    defaultParams: [id],
    onError: () => router.back(),
  });

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <p className='font-semibold text-2xl'>{t('statuses.order-not-found')}</p>
      </div>
    );
  }

  const statuses =
    order.status === t('statuses.cancelled')
      ? [t('statuses.cancelled')]
      : [t('statuses.pending'), t('statuses.shipped'), t('statuses.paid'), t('statuses.approved')];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStep = () => {
    switch (order.status) {
      case 'cancelled':
        return -1;
      case 'pending':
        return 0;
      case 'shipped':
        return 1;
      case 'paid':
        return 2;
      case 'approved':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStatusStep();

  return (
    <main className='container mx-auto px-4 py-8'>
      <Button
        variant='light'
        startContent={<FiArrowLeft />}
        onPress={() => router.back()}
        className='mb-6'
      >
        {t('buttons.back-to-orders')}
      </Button>

      <div className='mb-8 flex flex-col items-start justify-between md:flex-row md:items-center'>
        <div>
          <h1 className='mb-2 font-bold text-3xl'>Order #{id}</h1>
          <div className='flex items-center text-gray-500'>
            <FiCalendar className='mr-1' />
            <span>{order.createdAt.toLocaleDateString()}</span>
            <span className='mx-2'>•</span>
            <FiClock className='mr-1' />
            <span>{order.createdAt.toLocaleTimeString()}</span>
          </div>
        </div>
        <span
          className={`mt-4 rounded-full px-4 py-2 text-sm md:mt-0 ${getStatusColor(order.status)}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <Card className='mb-8'>
        <CardBody className='p-6'>
          <h2 className='mb-6 font-semibold text-xl'>{t('order-status')}</h2>

          {/* Custom Timeline Implementation */}
          <div className='relative'>
            {statuses.map((status, index) => {
              const isCompleted = index <= currentStep;
              const isActive = index === currentStep;
              const hasReachedStatus = order.status === status || isCompleted;

              return (
                <div key={status} className='mb-8 flex last:mb-0'>
                  {/* Timeline connector */}
                  {index < statuses.length - 1 && (
                    <div className='absolute top-0 left-4 z-0 h-full w-0.5 bg-gray-200' />
                  )}

                  {/* Status circle */}
                  <div
                    className={`relative z-10 mr-4 flex h-8 w-8 items-center justify-center rounded-full ${
                      hasReachedStatus
                        ? 'bg-gradient-to-r from-customBlue to-customLightBlue text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {hasReachedStatus && <FiCheck className='h-5 w-5' />}
                    {!hasReachedStatus && <span className='h-2 w-2 rounded-full bg-gray-400' />}
                  </div>

                  {/* Status content */}
                  <div
                    className={`flex-1 ${isActive ? 'opacity-100' : hasReachedStatus ? 'opacity-90' : 'opacity-50'}`}
                  >
                    <h3 className='font-medium text-lg'>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </h3>
                    <p className='text-gray-600'>
                      {status === 'pending' && 'Order is being processed'}
                      {status === 'shipped' && 'Order has been shipped'}
                      {status === 'paid' && 'Payment confirmed'}
                      {status === 'approved' && 'Order has been approved'}
                      {status === 'cancelled' && 'Order was cancelled'}
                    </p>
                    {hasReachedStatus && (
                      <p className='mt-1 text-gray-500 text-xs'>
                        {status === 'pending' && (
                          <>
                            {order.createdAt.toLocaleDateString()} at
                            {order.createdAt.toLocaleTimeString()}
                          </>
                        )}
                        {['paid', 'cancelled', 'approved'].includes(status) && (
                          <>
                            {order.updatedAt.toLocaleDateString()} at
                            {order.updatedAt.toLocaleTimeString()}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <Card className='mb-6'>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiPackage className='mr-2' /> {t('order-items')}
              </h2>

              <div className='space-y-6'>
                <div
                  key={order.id}
                  className='flex flex-col overflow-hidden rounded-lg border sm:flex-row'
                >
                  <div className='h-32 w-full sm:w-32'>
                    <Image
                      src={order.product.images?.[0]}
                      alt={order.product.name}
                      className='h-full w-full object-cover'
                    />
                  </div>
                  <div className='flex-1 p-4'>
                    <h3 className='font-medium text-lg'>{order.product.name}</h3>
                    <p className='mb-1 text-gray-500'>By {order.product.user.name}</p>
                    <p className='mb-2 text-gray-500'>
                      {t('quantity')}: {order.quantity}
                    </p>
                    <p className='font-medium'>
                      {getCurrency((order.product.price * order.quantity) / order.quantity)} each
                    </p>
                    <p className='mt-1 font-bold'>
                      Total: {getCurrency(order.product.price * order.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardBody>
              <h2 className='mb-4 flex items-center font-semibold text-xl'>
                <FiUser className='mr-2' /> {t('payment-information')}
              </h2>

              <div>
                <p className='font-medium'>{t('payment-method')}</p>
                <p className='text-gray-600'>{t('on-delivery')}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className='mt-8 flex justify-center'>
        <Button
          as={Link}
          className='bg-gradient-to-r from-customBlue to-customLightBlue text-white'
          href='/'
        >
          {t('buttons.continue-shopping')}
        </Button>
      </div>
    </main>
  );
}
