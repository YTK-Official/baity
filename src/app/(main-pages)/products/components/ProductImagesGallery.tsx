'use client';

import { Image } from '@/components/heroui';
import classNames from 'classnames';
import Link from 'next/link';
import { useState } from 'react';

interface ProductImagesGalleryProps {
  images: string[];
  name: string;
}

const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({ images, name }) => {
  const [mainImage, setMainImage] = useState(images[0] || '/2.jpg');

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-2'>
        {images.map((src, i) => (
          <button
            key={src}
            type='button'
            className={classNames(
              'relative size-16 overflow-hidden rounded-lg border-2 transition-all',
              mainImage === src ? 'border-primary' : 'border-gray-200',
            )}
            onClick={() => setMainImage(src)}
            aria-label={`Show image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${name} thumb ${i + 1}`}
              className='object-cover'
              loading='lazy'
            />
          </button>
        ))}
      </div>
      <Link
        href={mainImage}
        target='_blank'
        rel='noopener noreferrer'
        aria-label={`Show main image of ${name}`}
        className='relative size-80 flex-shrink-0 overflow-hidden rounded-xl shadow'
      >
        <Image src={mainImage} alt={`${name} main image`} className='object-cover' loading='lazy' />
      </Link>
    </div>
  );
};

export default ProductImagesGallery;
