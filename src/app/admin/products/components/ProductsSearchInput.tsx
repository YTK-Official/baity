import { Input } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';

interface ProductsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductsSearchInput({ value, onChange }: ProductsSearchInputProps) {
  const t = useTranslations('admin');
  return (
    <Input
      placeholder={t('products.search.placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search products'
    />
  );
}
