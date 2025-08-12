import { Pagination } from '@/components/heroui';

interface UsersPaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function UsersPagination({ page, total, onChange }: UsersPaginationProps) {
  return (
    <div className='mt-4 flex justify-end'>
      <Pagination
        isCompact
        showControls
        showShadow
        color='primary'
        page={page}
        total={total}
        onChange={onChange}
      />
    </div>
  );
}
