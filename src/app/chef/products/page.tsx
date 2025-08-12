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
  Spinner,
} from '@/components/heroui';
import { addToast } from '@/components/heroui';
import { Image } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';
import { getDashboardProducts, updateProductStatus } from '@/services/product';
import { getCurrency } from '@/utils/price';
import { useRequest } from 'ahooks';
import Link from 'next/link';
import { useState } from 'react';
import { FiEdit, FiFilter, FiPlus } from 'react-icons/fi';

export default function ChefProductsPage() {
  const t = useTranslations('chefs-profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { loading, data: products = [], refreshAsync } = useRequest(getDashboardProducts);
  const { loading: updateLoading, runAsync: runAsyncUpdateOrder } = useRequest(
    updateProductStatus,
    {
      manual: true,
      onSuccess: async ({ status }) => {
        addToast({ title: `Product marked as ${status}`, color: 'success' });

        await refreshAsync();
      },
      onError: () => addToast({ title: 'Failed to update status', color: 'danger' }),
    },
  );

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <Spinner size='lg' />
      </div>
    );
  }

  const filteredProducts = products.filter((product) => {
    if (statusFilter !== 'all' && product.status !== statusFilter) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  const handleChangeStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await runAsyncUpdateOrder(id, newStatus);
  };

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='font-bold text-3xl'>{t('Products-page.title')}</h1>

        <Button
          as={Link}
          href='/chef/products/new'
          className='bg-gradient-to-r from-customBlue to-customLightBlue text-white'
          startContent={<FiPlus />}
        >
          {t('Products-page.add-new-product-button')}
        </Button>
      </div>

      <Card className='mb-8'>
        <CardBody className='p-4'>
          <div className='flex flex-col items-center gap-4 sm:flex-row'>
            <Input
              placeholder={t('Products-page.search-placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<span className='text-gray-400'>🔍</span>}
              className='flex-1'
            />

            <Dropdown>
              <DropdownTrigger>
                <Button variant='flat' startContent={<FiFilter />}>
                  {statusFilter === 'all'
                    ? t('dropdown.all-status')
                    : statusFilter === 'active'
                      ? t('dropdown.active')
                      : t('dropdown.inactive')}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label='Status filter'
                onAction={(key) => setStatusFilter(key as string)}
              >
                <DropdownItem key='all'>{t('dropdown.all-status')}</DropdownItem>
                <DropdownItem key='active'>{t('dropdown.active')}</DropdownItem>
                <DropdownItem key='inactive'>{t('dropdown.inactive')}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>

      {updateLoading ? (
        <div className='flex justify-center py-12'>
          <Spinner size='lg' />
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='mb-4 text-gray-500'>{t('Products-page.no-products')}</p>
              <Button
                as={Link}
                href='/chef/products/new'
                className='bg-gradient-to-r from-customBlue to-customLightBlue text-white'
              >
                {t('Products-page.create-your-first-product-button')}
              </Button>
            </div>
          ) : (
            <div className='grid gap-6'>
              {filteredProducts.map((product) => (
                <Card key={product.id} className='overflow-hidden'>
                  <CardBody className='p-0'>
                    <div className='flex flex-col sm:flex-row'>
                      <div className='relative h-48 w-full sm:w-48'>
                        <Image
                          src={product.images?.[0] || ''}
                          alt={product.name}
                          className='aspect-square h-full w-full object-cover'
                        />
                      </div>
                      <div className='flex flex-1 flex-col justify-between p-4'>
                        <div>
                          <div className='flex items-start justify-between'>
                            <h3 className='mb-2 font-semibold text-xl'>{product.name}</h3>
                            <span
                              className={`rounded-full px-2 py-1 text-xs capitalize ${
                                product.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : product.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : product.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                          <p className='mb-2 text-gray-500'>
                            {t('Products-page.created-on')} {product.createdAt.toLocaleDateString()}
                          </p>
                          <p className='font-medium text-lg'>{getCurrency(product.price)}</p>
                          <p className='mt-1 text-gray-500 text-sm'>
                            {product.orders.length} {t('Products-page.orders-received')}
                          </p>
                        </div>
                        <div className='mt-4 flex gap-2'>
                          <Button
                            as={Link}
                            href={`/chef/products/edit/${product.id}`}
                            variant='flat'
                            color='primary'
                            startContent={<FiEdit />}
                          >
                            {t('Products-page.edit-button')}
                          </Button>
                          {product.status !== 'pending' && product.status !== 'rejected' && (
                            <Button
                              variant={product.status === 'active' ? 'flat' : 'solid'}
                              color={product.status === 'active' ? 'warning' : 'success'}
                              startContent={<FiFilter />}
                              onPress={() => handleChangeStatus(product.id, product.status)}
                              isLoading={updateLoading}
                            >
                              {product.status === 'active'
                                ? t('Products-page.set-inactive')
                                : t('Products-page.set-active')}
                            </Button>
                          )}
                          <Button as={Link} href={`/chef/products/${product.id}`} variant='flat'>
                            {t('Products-page.view-button')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
