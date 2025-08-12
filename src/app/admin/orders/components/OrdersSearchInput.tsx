import { Input } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';

interface OrdersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OrdersSearchInput({ value, onChange }: OrdersSearchInputProps) {
  const t = useTranslations('admin');
  return (
    <Input
      placeholder={t('orders.search.placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search orders'
    />
  );
}
