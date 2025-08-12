import type React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className='flex items-center rounded-lg bg-white p-6 shadow-md gap-4'>
    <div className={`mr-4 rounded-full p-3 ${color}`}>{icon}</div>
    <div>
      <h3 className='font-medium text-gray-500 text-sm'>{title}</h3>
      <p className='font-bold text-2xl'>{value}</p>
    </div>
  </div>
);

export default StatCard;
