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
import type { Product } from '@/types/product';
import { getCurrency } from '@/utils/price';

interface ProductsTableProps {
  products: Product[];
  statusOptions: { label: string; value: string }[];
  onStatusChange: (productId: Product['id'], newStatus: Product['status']) => void;
  loading: boolean;
}

export default function ProductsTable({
  products,
  statusOptions,
  onStatusChange,
  loading,
}: ProductsTableProps) {
  const t = useTranslations('admin');
  const columns = [
    { name: 'products.table.product-id', uid: 'id' },
    { name: 'products.table.name', uid: 'name' },
    { name: 'products.table.price', uid: 'price' },
    { name: 'products.table.status', uid: 'status' },
  ];

  return (
    <Table aria-label='Products Table' isStriped className='rounded-xl shadow'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {t(column.name as any)}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={t('products.table.no-products')}
        items={products}
        isLoading={loading}
      >
        {(product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{getCurrency(product.price)}</TableCell>
            <TableCell>
              <Select
                placeholder='Select status'
                selectedKeys={new Set([product.status])}
                value={product.status}
                onChange={(e) => onStatusChange(product.id, e.target.value as Product['status'])}
                className='min-w-[120px]'
                aria-label='Product status'
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
