'use client';

import { Pagination } from '@/components/heroui';
import { useRouter } from 'next/navigation';

interface ChefsPaginationProps {
  totalPages: number;
  currentPage: number;
}

export const ChefsPagination = ({ totalPages, currentPage }: ChefsPaginationProps) => {
  const router = useRouter();

  return (
    <div className='mt-8 flex justify-center'>
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        showControls
        onChange={(page) => {
          router.push(`?page=${page}`);
        }}
      />
    </div>
  );
};
