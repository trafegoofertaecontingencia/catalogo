"use client"

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Carousel() {
  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        pagination
        navigation
        loop={true}
        autoplay={{
        delay: 3000, 
        disableOnInteraction: false, 
      }}
        onSlideChange={() => {}}
        onSwiper={() => {}}
      >
          <SwiperSlide><img src="/carousel/banner01.jpg" /></SwiperSlide>
          <SwiperSlide><img src="/carousel/banner02.jpg" /></SwiperSlide>
          <SwiperSlide><img src="/carousel/banner03.jpg" /></SwiperSlide>
      </Swiper>
    </div>
  );
}
