'use client';

import {
  Button,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import type { getAdminOrders } from '@/services/admin';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';

interface OrdersTableProps {
  orders: Awaited<ReturnType<typeof getAdminOrders>>;
  statusOptions: { label: string; value: string }[];
  onStatusChange: (orderId: Order['id'], newStatus: Order['status']) => void;
  loading: boolean;
}

export default function OrdersTable({
  orders,
  statusOptions,
  onStatusChange,
  loading,
}: OrdersTableProps) {
  const t = useTranslations('admin');
  const columns = [
    { name: t('orders.table.order-id'), uid: 'id' },
    { name: t('orders.table.user'), uid: 'user' },
    { name: t('orders.table.product'), uid: 'product' },
    { name: t('orders.table.quantity'), uid: 'quantity' },
    { name: t('orders.table.total'), uid: 'total' },
    { name: t('orders.table.status'), uid: 'status' },
    { name: t('common.actions'), uid: 'actions' },
  ];
  return (
    <Table aria-label='Orders Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent='No orders found' items={orders} isLoading={loading}>
        {(order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.user.name}</TableCell>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{getCurrency(order.product.price * order.quantity)}</TableCell>
            <TableCell>
              <Select
                placeholder='Select status'
                selectedKeys={new Set([order.status])}
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                className='min-w-[120px]'
                aria-label='Order status'
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>
              <Button
                as={Link}
                href={`/admin/orders/${order.id}`}
                isIconOnly
                variant='light'
                aria-label='View order details'
              >
                <FiEye />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
