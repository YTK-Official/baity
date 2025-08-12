'use client';

import { Image } from '@/components/heroui';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Hero = () => {
  return (
    <section className='container select-none pt-0 text-slate-50 sm:pt-2 md:pt-4 lg:pt-6'>
      <Swiper
        className='h-[457px] overflow-hidden rounded-3xl'
        pagination={{ dynamicBullets: true, clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SwiperSlide key={`hero-${i + 1}`}>
            <Image
              className='h-fit w-full object-cover'
              src={`/hero (${i + 1}).jpg`}
              alt={`Hero ${i + 1}`}
              loading='lazy'
              fetchPriority='high'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
