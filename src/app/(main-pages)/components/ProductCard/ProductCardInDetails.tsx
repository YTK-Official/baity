import { Card, CardBody, Image } from '@/components/heroui';

import { AddToCartBtn } from './AddToCartBtn';
import { BuyNowBtn } from './BuyNowBtn';
import { CardChips } from './CardChips';
import { CardDescription } from './CardDescription';
import { CardPrice } from './CardPrise';
import { WishlistHeartBtn } from './Wishlist';

type Props = {
  id: number;
  name: string;
  description: string;
  total: number;
  images: string[];
};

export const ProductCardInDetails = ({ id, name, total, images, description }: Props) => {
  return (
    <Card className='group mx-auto min-w-36 max-w-56 overflow-clip border pt-1 pb-2 shadow-sm duration-500 max-sm:max-w-72 sm:hover:scale-105 sm:hover:shadow-lg'>
      <div className='absolute z-40 flex w-full items-start justify-between p-3'>
        <CardChips realPrise={total} />
        <WishlistHeartBtn />
      </div>
      <CardBody className='p-2'>
        <figure className='flex max-w-52 flex-col content-center items-center max-sm:max-w-72'>
          <Image
            className='rounded-xl object-cover'
            src={images?.[0] ?? ''}
            alt={name}
            width={200}
            height={200}
          />

          <figcaption className='px-1.5 pt-1'>
            <h4 className='line-clamp-3 font-semibold text-sm'>{name}</h4>
            <CardPrice total={total} />
          </figcaption>
        </figure>

        <div className='flex w-full items-center justify-center gap-1 pt-2'>
          <BuyNowBtn />
          <AddToCartBtn />
        </div>
      </CardBody>
      <CardDescription description={description} />
    </Card>
  );
};
