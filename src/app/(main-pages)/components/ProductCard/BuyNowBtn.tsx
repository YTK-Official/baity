import { Button } from '@/components/heroui';

type Props = {
  isFullWidth?: boolean;
};

export const BuyNowBtn = ({ isFullWidth }: Props) => {
  return (
    <Button
      className={
        'w-full min-w-28 bg-gradient-to-tr from-customBlue to-customLightBlue text-white shadow-sm max-sm:min-w-20'
      }
      size={isFullWidth ? 'md' : 'sm'}
    >
      Buy Now
    </Button>
  );
};
