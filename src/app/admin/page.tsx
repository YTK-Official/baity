'use client';

import { Spinner } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getAdminOrders, getAdminProducts } from '@/services/admin';
import { getOrders } from '@/services/order';
import { getUsers } from '@/services/user';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import Orders from './components/Orders';
import Products from './components/Products';
import Users from './components/Users';

export type ActiveTap = 'dashboard' | 'products' | 'orders' | 'users';

export default function AdminPage() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState<ActiveTap>('dashboard');
  const { loading: productsLoading, data: products = [] } = useRequest(getAdminProducts);
  const { loading: usersLoading, data: users = [] } = useRequest(getUsers);
  const { loading: ordersLoading, data: orders = [] } = useRequest(getAdminOrders);

  if (productsLoading || usersLoading || ordersLoading || !orders || !products || !users) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Spinner size='lg' />
      </div>
    );
  }

  const productsGroupedByStatus = products
    ? Object.groupBy(products, (product) => product.status)
    : {};

  const productData = Object.entries(productsGroupedByStatus).map(([status, products]) => ({
    name: status,
    count: products?.length || 0,
    status,
    price: products?.reduce((total, product) => total + product.price, 0) || 0,
  }));

  const ordersGroupedByDate = orders
    ? Object.groupBy(orders, (order) => order.createdAt.toISOString().split('T')[0].slice(0, 7))
    : {};

  const ordersData = Object.entries(ordersGroupedByDate).map(([date, orders]) => ({
    month: date,
    orders: orders?.length || 0,
  }));

  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const usersCreatedLastMonth = users?.filter((user) => user.createdAt >= lastMonth).length || 0;
  const totalUsers = users?.length || 0;
  const bannedUsers = users?.filter((user) => user.banned).length || 0;
  const activeUsers = totalUsers - bannedUsers;

  const usersData = {
    total: totalUsers,
    active: activeUsers,
    new: usersCreatedLastMonth,
    returning: totalUsers - usersCreatedLastMonth,
    recentUsers: users.slice(-5) || [],
  };

  const paidOrders = orders.filter((order) => order.status === 'paid');
  const totalRevenue = Math.round(
    paidOrders.reduce((total, order) => total + order.total * order.quantity, 0) || 0,
  );

  const ComponentMap = {
    dashboard: (
      <Dashboard
        productData={productData}
        orderData={ordersData}
        userData={usersData}
        totalRevenue={totalRevenue}
      />
    ),
    products: <Products productData={productData} />,
    orders: <Orders orderData={ordersData} orders={orders || []} />, // Pass full orders array
    users: <Users users={users || []} />,
  };

  const Component = ComponentMap[activeTab];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className='mt-8'>{Component}</div>
      </div>
    </div>
  );
}
