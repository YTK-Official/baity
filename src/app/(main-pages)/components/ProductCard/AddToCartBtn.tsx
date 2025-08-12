import { Button } from '@/components/heroui';
import { PiShoppingCartSimpleBold } from 'react-icons/pi';

type Props = {
  isFullWidth?: boolean;
};

export const AddToCartBtn = ({ isFullWidth }: Props) => {
  return (
    <Button
      color='primary'
      className={`min-w-${isFullWidth ? 12 : 9} bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm`}
      size={isFullWidth ? 'md' : 'sm'}
      isIconOnly
      fullWidth
    >
      <PiShoppingCartSimpleBold className='text-lg' />
    </Button>
  );
};
