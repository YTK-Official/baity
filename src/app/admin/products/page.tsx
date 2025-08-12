'use client';

import { Spinner, addToast } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getAdminProducts, updateProductStatusAction } from '@/services/admin';
import type { Product } from '@/types/product';
import { tryCatch } from '@/utils/tryCatch';
import { useRequest } from 'ahooks';
import { startTransition, useMemo, useState } from 'react';
import ProductsPagination from './components/ProductsPagination';
import ProductsSearchInput from './components/ProductsSearchInput';
import ProductsTable from './components/ProductsTable';

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
].map((option) => ({
  ...option,
  label: option.value.charAt(0).toUpperCase() + option.value.slice(1),
}));

export default function AdminProductsPage() {
  const t = useTranslations('admin');
  const { loading, data, refresh } = useRequest(getAdminProducts);
  const [search, setSearch] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const products = data || [];

  const filteredProducts = useMemo(() => {
    if (!search) return products;

    return products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, page]);

  const handleStatusChange = async (productId: Product['id'], newStatus: Product['status']) => {
    const [err] = await tryCatch(updateProductStatusAction({ productId, status: newStatus }));
    if (err) {
      addToast({ title: err.message || t('common.no-data-found'), color: 'danger' });
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
      <h1 className='mb-8 font-bold text-3xl'>{t('products.title')}</h1>
      <div className='mb-4 flex items-center gap-4'>
        <ProductsSearchInput value={search} onChange={onChangeSearch} />
      </div>
      <ProductsTable
        products={paginatedProducts}
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        loading={loading}
      />
      <ProductsPagination page={page} total={pages} onChange={setPage} />
    </div>
  );
}
