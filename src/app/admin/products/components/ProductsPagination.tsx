import { Pagination } from '@/components/heroui';

interface ProductsPaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function ProductsPagination({ page, total, onChange }: ProductsPaginationProps) {
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
