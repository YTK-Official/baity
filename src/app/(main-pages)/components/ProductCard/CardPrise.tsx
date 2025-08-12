import { getCurrency } from '@/utils/price';

type CardPriceProps = {
  total: number;
};

export const CardPrice = ({ total }: CardPriceProps) => {
  return (
    <article>
      <span className='font-semibold text-customBlue text-sm'>{getCurrency(total)}</span>
    </article>
  );
};
