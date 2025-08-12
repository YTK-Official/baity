'use client';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type ProductsCarouselProps<T> = {
  Item: React.FC<T>;
  data: T[];
};

export const ProductsCarousel = <T extends { id?: string | number }>({
  data,
  Item,
}: ProductsCarouselProps<T>) => {
  return (
    <div className='container select-none'>
      <Swiper
        className='pt-3 pb-7'
        navigation
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={10}
        slidesPerView={2}
        breakpoints={{
          390: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          550: {
            slidesPerView: 2.4,
            spaceBetween: 10,
          },
          650: {
            slidesPerView: 2.4,
            spaceBetween: 10,
          },
          680: {
            slidesPerView: 2.68,
            spaceBetween: 10,
          },
          750: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          800: {
            slidesPerView: 3.2,
            spaceBetween: 10,
          },
          900: {
            slidesPerView: 3.4,
            spaceBetween: 10,
          },
          975: {
            slidesPerView: 3.68,
            spaceBetween: 10,
          },
          1030: {
            slidesPerView: 4.2,
            spaceBetween: 10,
          },
          1150: {
            slidesPerView: 4.68,
            spaceBetween: 10,
          },
          1280: {
            slidesPerView: 5.3,
            spaceBetween: 10,
          },
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={item?.id ?? index.toString()}>
            <Item {...item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
