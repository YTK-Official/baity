import { Card, CardBody } from '@/components/heroui';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className='shadow-md'>
      <CardBody className='p-6'>
        <div className='flex items-center'>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${color}`}>
            {icon}
          </div>
          <div className='ml-4'>
            <h3 className='font-medium text-gray-500 text-sm'>{title}</h3>
            <p className='font-bold text-2xl'>{value}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
