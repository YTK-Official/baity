'use client';

import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination,
  Spinner,
  Tab,
  Tabs,
} from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getOrders } from '@/services/order';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';

import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiEye, FiFilter, FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState<string | number | null>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations('orders');

  const limit = 10;

  const { loading, data: orders = [] } = useRequest(() => getOrders({ page: currentPage, limit }), {
    refreshDeps: [currentPage],
  });

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='py-12 text-center'>
        <FiPackage className='mx-auto mb-4 text-5xl text-gray-300' />
        <h2 className='mb-2 font-semibold text-xl'>{t('not-found')}</h2>
        <p className='mb-6 text-gray-500'>
          {searchQuery || statusFilter !== 'all'
            ? 'Try adjusting your filters to see more results'
            : "You haven't placed any orders yet"}
        </p>
        <Button
          as={Link}
          href='/'
          className='bg-gradient-to-r from-customBlue to-customLightBlue text-white'
        >
          Browse Products
        </Button>
      </div>
    );
  }

  const hasNextPage = orders.length === limit;

  // Filter orders based on search, status, and tab
  const filteredOrders = orders.filter((order) => {
    // Filter by tab
    if (selectedTab !== 'all' && order.status !== selectedTab) return false;

    // Filter by status dropdown if it's not set to 'all'
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesOrderId = order.id.toLowerCase().includes(searchLower);
      const matchesProducts = order.product.name.toLowerCase().includes(searchLower);

      if (!matchesOrderId && !matchesProducts) return false;
    }

    return true;
  });

  const getStatusColor = (status: Order['status']) => {
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
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 font-bold text-3xl'>{t('title')}</h1>
        <p className='text-gray-600'>{t('description')}</p>
      </div>

      <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab} className='mb-6'>
        <Tab key='all' title={t('tabs.all-orders')} />
        <Tab key='pending' title={t('tabs.pending')} />
        <Tab key='approved' title={t('tabs.approved')} />
        <Tab key='shipped' title={t('tabs.shipped')} />
        <Tab key='paid' title={t('tabs.paid')} />
        <Tab key='cancelled' title={t('tabs.cancelled')} />
      </Tabs>

      <Card className='mb-8'>
        <CardBody className='p-4'>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Input
              placeholder={t('search-placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<span className='text-gray-400'>🔍</span>}
              className='flex-1'
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant='flat' startContent={<FiFilter />}>
                  {statusFilter === 'all' ? t('tabs.all-status') : getStatusText(statusFilter)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Status filter'
                onAction={(key) => setStatusFilter(key as string)}
              >
                <DropdownItem key='all'>{t('tabs.all-orders')}</DropdownItem>
                <DropdownItem key='pending'>{t('tabs.pending')}</DropdownItem>
                <DropdownItem key='approved'>{t('tabs.approved')}</DropdownItem>
                <DropdownItem key='shipped'>{t('tabs.shipped')}</DropdownItem>
                <DropdownItem key='paid'>{t('tabs.paid')}</DropdownItem>
                <DropdownItem key='cancelled'>{t('tabs.cancelled')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className='py-12 text-center'>
              <FiPackage className='mx-auto mb-4 text-5xl text-gray-300' />
              <h2 className='mb-2 font-semibold text-xl'>No orders found</h2>
              <p className='mb-6 text-gray-500'>
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters to see more results'
                  : "You haven't placed any orders yet"}
              </p>
              <Button
                as={Link}
                href='/'
                className='bg-gradient-to-r from-customBlue to-customLightBlue text-white'
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredOrders.map((order) => (
                <Card key={order.id} className='overflow-hidden transition-shadow hover:shadow-md'>
                  <CardBody className='p-3'>
                    <div className='mb-2 flex items-center justify-between'>
                      <h3 className='font-semibold text-sm'>Order #{order.id}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    <div className='mb-3 flex gap-3'>
                      <Image
                        src={order.product.images?.[0]}
                        alt={order.product.name}
                        className='h-16 w-16 rounded-md object-cover'
                      />
                      <div className='flex-1'>
                        <h4 className='line-clamp-1 font-medium text-sm'>{order.product.name}</h4>
                        <p className='text-gray-500 text-xs'>Qty: {order.quantity}</p>
                        <p className='font-medium text-sm'>
                          {getCurrency(order.product.price * order.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center justify-between text-gray-500 text-xs'>
                      <div className='flex items-center'>
                        <FiCalendar className='mr-1' />
                        <span>{order.createdAt.toLocaleDateString()}</span>
                      </div>
                      <Button
                        as={Link}
                        href={`/orders/${order.id}`}
                        variant='light'
                        size='sm'
                        className='text-xs'
                        startContent={<FiEye className='text-xs' />}
                      >
                        Details
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          <div className='mt-8 flex justify-center'>
            <Pagination
              total={hasNextPage ? currentPage + 1 : currentPage}
              initialPage={currentPage}
              onChange={setCurrentPage}
              showControls
            />
          </div>
        </>
      )}
    </main>
  );
}
