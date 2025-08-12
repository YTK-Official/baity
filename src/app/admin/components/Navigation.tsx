'use client';

import { useTranslations } from '@/lib/translates';
import type { ActiveTap } from '../page';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: ActiveTap) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const t = useTranslations('admin');
  const tabs: ActiveTap[] = ['dashboard', 'products', 'orders', 'users'];

  return (
    <div className='mb-6 border-gray-200 border-b'>
      <nav className='-mb-px flex space-x-8'>
        {tabs.map((tab) => (
          <button
            type='button'
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm capitalize`}
          >
            {t(`navigation.${tab}`)}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
