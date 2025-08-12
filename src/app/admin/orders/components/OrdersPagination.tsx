'use client';

import { Pagination } from '@/components/heroui';

interface OrdersPaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function OrdersPagination({ page, total, onChange }: OrdersPaginationProps) {
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
