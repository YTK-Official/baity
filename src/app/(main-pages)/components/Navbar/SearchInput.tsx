'use client';

import { Input } from '@/components/heroui';
import { LuSearch } from 'react-icons/lu';

const SearchInput = ({ className }: { className: string }) => {
  return (
    <Input
      classNames={{
        base: 'max-w-full h-10',
        mainWrapper: 'h-full',
        input: 'text-small',
        inputWrapper:
          'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
      }}
      className={className}
      placeholder='Type to search...'
      size='sm'
      startContent={<LuSearch size={22} />}
      type='search'
    />
  );
};

export default SearchInput;
