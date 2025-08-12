'use client';

import { useTranslations } from '@/lib/translates';
import { getCurrency } from '@/utils/price';

interface ProductsProps {
  productData: Array<{ name: string; count: number; status: string; price: number }>;
}

const Products: React.FC<ProductsProps> = ({ productData }) => {
  const t = useTranslations('admin');

  return (
    <div>
      <div className='overflow-hidden rounded-lg bg-white shadow-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                {t('products.table.name')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                {t('orders.table.count')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                {t('products.table.price')}
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider'
              >
                {t('products.table.status')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {productData.map((product) => (
              <tr key={product.name}>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='font-medium text-gray-900 text-sm'>{product.name}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-gray-500 text-sm'>{product.count}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <div className='text-gray-500 text-sm'>{getCurrency(product.price)}</div>
                </td>
                <td className='whitespace-nowrap px-6 py-4'>
                  <span
                    className={`inline-flex rounded-full px-2 font-semibold text-xs leading-5 ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
