'use client';

import { useTranslations } from '@/lib/translates';
import { getCurrency } from '@/utils/price';
import type React from 'react';
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
import StatCard from './StatCard';

interface DashboardProps {
  productData: Array<{ name: string; count: number }>;
  orderData: Array<{ month: string; orders: number }>;
  userData: {
    total: number;
    active: number;
    new: number;
    returning: number;
  };
  totalRevenue: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({
  productData,
  orderData,
  userData,
  totalRevenue,
}) => {
  const t = useTranslations('admin');

  return (
    <div>
      <h2 className='mb-6 font-semibold text-gray-800 text-xl'>{t('dashboard.overview')}</h2>

      {/* Stats Cards */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title={t('dashboard.total-products')}
          value={productData.reduce((sum, item) => sum + item.count, 0)}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              role='img'
              aria-label='Total Products Icon'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10'
              />
            </svg>
          }
          color='bg-blue-500'
        />

        <StatCard
          title={t('dashboard.total-orders')}
          value={orderData.reduce((sum, item) => sum + item.orders, 0)}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              role='img'
              aria-label='Total Orders Icon'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>
          }
          color='bg-green-500'
        />

        <StatCard
          title={t('dashboard.total-users')}
          value={userData.total}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              role='img'
              aria-label='Total Users Icon'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 1110 0 4 4 0 01-10 0z'
              />
            </svg>
          }
          color='bg-purple-500'
        />

        <StatCard
          title={t('dashboard.revenue')}
          value={getCurrency(totalRevenue)}
          icon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              role='img'
              aria-label='Revenue Icon'
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
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-4 font-medium text-gray-900 text-lg'>
            {t('dashboard.charts.monthly-orders')}
          </h3>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={orderData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='orders' fill='#3B82F6' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-4 font-medium text-gray-900 text-lg'>
            {t('dashboard.charts.product-status')}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
