'use client';

import { useTranslations } from '@/lib/translates';
import type { User } from '@/types/user';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface UsersProps {
  users: User[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Users: React.FC<UsersProps> = ({ users }) => {
  const t = useTranslations('admin');
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const newUsers = users.filter((user) => new Date(user.createdAt).getTime() > now - THIRTY_DAYS);
  const returningUsers = users.filter(
    (user) => new Date(user.createdAt).getTime() <= now - THIRTY_DAYS && !user.banned,
  );
  const inactiveUsers = users.filter((user) => user.banned);

  const userTypeData = [
    { name: t('users.new-users'), value: newUsers.length },
    { name: t('users.returning-users'), value: returningUsers.length },
    { name: t('users.inactive-users'), value: inactiveUsers.length },
  ];

  const total = users.length || 1; // avoid division by zero

  // Sort recent users by createdAt descending
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h2 className='mb-6 font-semibold text-gray-800 text-xl'>{t('users.title')}</h2>

      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-2 font-medium text-gray-500 text-sm'>{t('users.total-users')}</h3>
          <p className='font-bold text-3xl'>{users.length}</p>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-2 font-medium text-gray-500 text-sm'>{t('users.active-users')}</h3>
          <p className='font-bold text-3xl'>{users.filter((user) => !user.banned).length}</p>
          <p className='mt-2 text-gray-500 text-sm'>
            {((users.filter((user) => !user.banned).length / total) * 100).toFixed(1)}%{' '}
            {t('users.of-total-users')}
          </p>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-2 font-medium text-gray-500 text-sm'>{t('users.new-users-month')}</h3>
          <p className='font-bold text-3xl'>{newUsers.length}</p>
          <p className='mt-2 text-gray-500 text-sm'>
            {((newUsers.length / total) * 100).toFixed(1)}% {t('users.of-total-users')}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-4 font-medium text-gray-900 text-lg'>{t('users.distribution')}</h3>
          <div className='h-80'>
            {users.length === 0 ? (
              <div className='flex h-full items-center justify-center text-gray-400'>
                {t('common.no-data-found')}
              </div>
            ) : (
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h3 className='mb-4 font-medium text-gray-900 text-lg'>{t('users.recent-users')}</h3>
          <div className='max-h-80 overflow-y-auto'>
            {recentUsers.length === 0 ? (
              <div className='text-gray-400'>{t('common.no-data-found')}</div>
            ) : (
              <ul className='divide-y divide-gray-200'>
                {recentUsers.map((user) => (
                  <li key={user.id} className='flex py-4'>
                    <img
                      className='h-10 w-10 rounded-full'
                      src={user.image ?? '/default-avatar.png'}
                      alt={user.name}
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                    <div className='ml-3'>
                      <p className='font-medium text-gray-900 text-sm'>{user.name}</p>
                      <p className='text-gray-500 text-sm'>{user.email}</p>
                    </div>
                    <div className='ml-auto flex items-center'>
                      <span
                        className={`inline-flex rounded-full px-2 font-semibold text-xs leading-5 ${
                          user.banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.banned ? t('users.status.inactive') : t('users.status.active')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
