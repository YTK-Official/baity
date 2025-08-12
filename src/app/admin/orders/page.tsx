'use client';

import { Spinner, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getAdminOrders, updateOrderStatusAction } from '@/services/admin';
import type { Order } from '@/types/order';
import { tryCatch } from '@/utils/tryCatch';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';
import { startTransition } from 'react';
import OrdersPagination from './components/OrdersPagination';
import OrdersSearchInput from './components/OrdersSearchInput';
import OrdersTable from './components/OrdersTable';

export default function AdminOrdersPage() {
  const t = useTranslations('admin');

  const statusOptions = [
    { label: t('orders.status.pending'), value: 'pending' },
    { label: t('orders.status.paid'), value: 'paid' },
    { label: t('orders.status.approved'), value: 'approved' },
    { label: t('orders.status.shipped'), value: 'shipped' },
    { label: t('orders.status.cancelled'), value: 'cancelled' },
  ];

  const { loading, data: orders = [], refresh } = useRequest(getAdminOrders);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;

    return orders.filter(
      (order) =>
        order.user.name.toLowerCase().includes(search.toLowerCase()) ||
        order.product.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orders, search]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredOrders.length / rowsPerPage);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page]);

  const handleStatusChange = async (orderId: Order['id'], newStatus: Order['status']) => {
    const [err] = await tryCatch(updateOrderStatusAction({ orderId, status: newStatus }));

    if (err) {
      addToast({ title: err.message || t('common.failed-to-update'), color: 'danger' });
      return;
    }

    startTransition(() => {
      refresh();
    });

    addToast({ title: t('products.status.updated'), color: 'success' });
  };

  const onChangeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className='py-10 text-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <h1 className='mb-8 font-bold text-3xl'>{t('orders.title')}</h1>
      <div className='mb-4 flex items-center gap-4'>
        <OrdersSearchInput value={search} onChange={onChangeSearch} />
      </div>
      <OrdersTable
        orders={paginatedOrders}
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
      <OrdersPagination page={page} total={pages} onChange={setPage} />
    </div>
  );
}
