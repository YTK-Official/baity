'use client';

import { Spinner } from '@/components/heroui';
import { authClient } from '@/lib/auth/client';
import { useTranslations } from '@/lib/translates';
import { toggleBanUser } from '@/services/admin';
import { getUsers } from '@/services/user';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';
import UsersPagination from './components/UsersPagination';
import UsersSearchInput from './components/UsersSearchInput';
import UsersTable from './components/UsersTable';

export default function AdminUsersPage() {
  const t = useTranslations('admin');
  const { loading, data, refresh } = useRequest(getUsers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const users = data || [];

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase().trim()) ||
        user.email.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [users, search]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredUsers.length / rowsPerPage);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, page]);

  const onChangeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onBanToggle = async (userId: string) => {
    await toggleBanUser({ userId });

    refresh();
  };

  const onRoleChange = async (userId: string, role: string) => {
    // @ts-ignore
    await authClient.admin.setRole({ userId, role });
    refresh();
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
      <h1 className='mb-8 font-bold text-3xl'>{t('users.title')}</h1>
      <div className='mb-4 flex items-center gap-4'>
        <UsersSearchInput value={search} onChange={onChangeSearch} />
      </div>
      <UsersTable
        users={paginatedUsers}
        loading={loading}
        onBanToggle={onBanToggle}
        onRoleChange={onRoleChange}
      />
      <UsersPagination page={page} total={pages} onChange={setPage} />
    </div>
  );
}
