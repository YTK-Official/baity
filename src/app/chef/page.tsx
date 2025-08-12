'use client';

import { type ButtonProps, Card, CardBody, Spinner } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getDashboardOrders } from '@/services/order';
import { getDashboardProducts } from '@/services/product';
import type { Order } from '@/types/order';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { FiBox, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatCard from './components/StatCard';

// Mock data for demonstration - in a real app, this would come from API
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ChefDashboardPage() {
  const t = useTranslations('chefs-profile');
  const { loading: productsLoading, data: products } = useRequest(getDashboardProducts);
  const { loading: ordersLoading, data: orders } = useRequest(getDashboardOrders);

  if (productsLoading || ordersLoading || !orders || !products) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  // Filter orders for this chef (in a real app, this would be done on the server)

  // Calculate metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = Math.round(
    orders.reduce((total, order) => total + order.total * order.quantity, 0) || 0,
  );

  // Group orders by date for chart
  const ordersGroupedByDate = orders
    ? Object.groupBy(orders, (order) => {
        const date = order.createdAt;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })
    : {};

  const ordersData = Object.entries(ordersGroupedByDate).map(([date, orders]) => ({
    date,
    orders: orders?.length || 0,
  }));

  // Group products by status for chart
  const productsGroupedByStatus = products
    ? Object.groupBy(products, (product) => product.status)
    : {};

  const productData = Object.entries(productsGroupedByStatus).map(([status, products]) => ({
    name: status,
    count: products?.length || 0,
  }));

  return (
    <div className='container mx-auto'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='font-bold text-3xl'>{t('dashboard.title')}</h1>
        <Button
          as={Link}
          href='/chef/subscribe'
          color='primary'
          className='flex items-center gap-2'
        >
          <FiCreditCard className='h-4 w-4' />
          {t('manage-subscription')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <StatCard
          title={t('dashboard.total-products')}
          value={totalProducts}
          icon={<FiBox className='h-6 w-6 text-white' />}
          color='bg-blue-500'
        />

        <StatCard
          title={t('dashboard.total-orders')}
          value={totalOrders}
          icon={<FiShoppingBag className='h-6 w-6 text-white' />}
          color='bg-green-500'
        />

        <StatCard
          title={t('dashboard.revenue')}
          value={getCurrency(totalRevenue)}
          icon={
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='currentColor'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
          color='bg-yellow-500'
        />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <Card className='shadow-md'>
          <CardBody className='p-6'>
            <h3 className='mb-4 font-medium text-gray-900 text-lg'>
              {t('dashboard.recent-orders')}
            </h3>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={ordersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='orders' fill='#3B82F6' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card className='shadow-md'>
          <CardBody className='p-6'>
            <h3 className='mb-4 font-medium text-gray-900 text-lg'>
              {t('dashboard.product-status')}
            </h3>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={productData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='count'
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className='mt-8 shadow-md'>
        <CardBody className='p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='font-medium text-gray-900 text-lg'>{t('dashboard.recent-orders')}</h3>
            <Button as={Link} href='/chef/orders' variant='flat' color='primary'>
              {t('dashboard.view-all')}
            </Button>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2 text-left'>{t('dashboard.order-id')}</th>
                  <th className='py-2 text-left'>{t('dashboard.customer')}</th>
                  <th className='py-2 text-left'>{t('dashboard.product')}</th>
                  <th className='py-2 text-left'>{t('dashboard.total')}</th>
                  <th className='py-2 text-left'>{t('dashboard.status')}</th>
                  <th className='py-2 text-left'>{t('dashboard.date')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className='border-b hover:bg-gray-50'>
                    <td className='py-2'>#{order.id}</td>
                    <td className='py-2'>{order.user.name}</td>
                    <td className='py-2'>{order.product.name}</td>
                    <td className='py-2'>{getCurrency(order.product.price * order.quantity)}</td>
                    <td className='py-2'>
                      <span
                        className={`rounded-full px-2 py-1 text-xs capitalize ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className='py-2'>{order.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

const Button = ({
  children,
  as,
  href,
  variant,
  color,
  className = '',
  ...props
}: ButtonProps & { className?: string }) => {
  const Component = as || 'button';
  const baseClassName = `px-4 py-2 rounded text-sm font-medium ${
    variant === 'flat'
      ? 'bg-transparent hover:bg-gray-100'
      : 'bg-blue-500 text-white hover:bg-blue-600'
  } ${color === 'primary' ? (variant === 'flat' ? 'text-blue-500' : '') : ''}`;

  return (
    <Component href={href} className={`${baseClassName} ${className}`} {...props}>
      {children}
    </Component>
  );
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
