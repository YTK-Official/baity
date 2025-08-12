import { Input } from '@/components/heroui';
import { useTranslations } from '@/lib/translates';

interface UsersSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UsersSearchInput({ value, onChange }: UsersSearchInputProps) {
  const t = useTranslations('admin');

  return (
    <Input
      placeholder={t('users.search.placeholder')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-80'
      aria-label='Search users'
    />
  );
}
