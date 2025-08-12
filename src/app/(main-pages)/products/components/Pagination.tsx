'use client';

import { Pagination as HeroPagination } from '@/components/heroui';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  page: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({ page, total }) => {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/products?page=${newPage}`);
  };

  return <HeroPagination page={page} total={total} onChange={handlePageChange} showControls />;
};

export default Pagination;
