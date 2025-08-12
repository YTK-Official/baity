'use client';

import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  addToast,
} from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import {
  approveOrder,
  cancelOrder,
  getDashboardOrders,
} from '@/services/order';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiCheck, FiEye, FiFilter, FiX } from 'react-icons/fi';

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'approved':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ChefOrdersPage() {
  const t = useTranslations('chefs-profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const { page: pageParam = '1' } = useParams() as { page: string };
  const page = Number.parseInt(pageParam, 10);

  const limit = 10;
  const {
    loading,
    data: orders = [],
    refreshAsync: refreshOrderAsync,
  } = useRequest(() => getDashboardOrders({ page, limit }));
  const { loading: acceptLoading, runAsync: runAsyncAcceptOrder } = useRequest(
    approveOrder,
    {
      manual: true,
    }
  );
  const { loading: cancelLoading, runAsync: runAsyncCancelOrder } = useRequest(
    cancelOrder,
    {
      manual: true,
    }
  );
  const hasNextPage = orders.length === limit;
  const isLoading = loading || acceptLoading || cancelLoading;

  const handleApproveOrder = async (orderId: string) => {
    await runAsyncAcceptOrder(orderId);
    addToast({
      title: t('messages.order-approved'),
      description: t('messages.order-approved-description'),
      color: 'success',
    });
    await refreshOrderAsync();
  };

  const handleCancelOrder = async (orderId: string) => {
    await runAsyncCancelOrder(orderId);
    addToast({
      title: t('messages.order-cancelled'),
      description: t('messages.order-cancelled-description'),
      color: 'danger',
    });
    await refreshOrderAsync();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (
      searchQuery &&
      !order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !order.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl">{t('orders-page.title')}</h1>

      <Card className="mb-8">
        <CardBody className="p-4">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Input
              placeholder={t('orders-page.search-placeholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              startContent={<span className="text-gray-400">🔍</span>}
              className="flex-1"
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" startContent={<FiFilter />}>
                  {statusFilter === 'all'
                    ? t('dropdown.all-status')
                    : statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Status filter"
                onAction={key => setStatusFilter(key as string)}
              >
                <DropdownItem key="all">
                  {t('dropdown.all-status')}
                </DropdownItem>
                <DropdownItem key="approved">
                  {t('dropdown.approved')}
                </DropdownItem>
                <DropdownItem key="paid">{t('dropdown.paid')}</DropdownItem>
                <DropdownItem key="pending">
                  {t('dropdown.pending')}
                </DropdownItem>
                <DropdownItem key="cancelled">
                  {t('dropdown.cancelled')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">
                {t('orders-page.no-orders-found')}
              </p>
            </div>
          ) : (
            <Card>
              <CardBody>
                <Table aria-label="Orders table">
                  <TableHeader>
                    <TableColumn className="uppercase">
                      {' '}
                      {t('dashboard.order-id')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.customer')}CUSTOMER
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.product')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.quantity')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.total')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.status')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.date')}
                    </TableColumn>
                    <TableColumn className="uppercase">
                      {t('dashboard.actions')}
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{order.user.name}</TableCell>
                        <TableCell>{order.product.name}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          {getCurrency(order.product.price * order.quantity)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs capitalize ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {order.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              as={Link}
                              href={`/chef/orders/${order.id}`}
                              isIconOnly
                              variant="light"
                              aria-label="View order details"
                            >
                              <FiEye />
                            </Button>
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  isIconOnly
                                  color="success"
                                  variant="flat"
                                  aria-label="Approve order"
                                  onPress={async () =>
                                    await handleApproveOrder(order.id)
                                  }
                                  isDisabled={isLoading}
                                  isLoading={isLoading}
                                >
                                  <FiCheck />
                                </Button>
                                <Button
                                  isIconOnly
                                  color="danger"
                                  variant="flat"
                                  aria-label="Cancel order"
                                  onPress={async () =>
                                    await handleCancelOrder(order.id)
                                  }
                                  isDisabled={isLoading}
                                  isLoading={isLoading}
                                >
                                  <FiX />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 flex justify-center">
                  <Pagination
                    total={hasNextPage ? page + 1 : page}
                    initialPage={page}
                    onChange={page => {
                      router.push(`?page=${page}`);
                    }}
                    showControls
                  />
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </main>
  );
}
