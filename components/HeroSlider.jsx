'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Swiper 스타일
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HeroSlider() {
  // 슬라이드 데이터
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920',
      title: '특별한 제대로 머금은 아키토리, 토리코',
      description: '노릇하게 구운 야키토리에 시원한 맥주 한 잔과 함께'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920',
      title: '일찍 준비할수록 더 좋은 CUBE 45',
      description: 'CUBE 45는 미리 준비할수록 더 좋은 가격으로 예약할 수 있습니다'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
      title: '편안한 휴식의 공간',
      description: '도심 속 특별한 휴양지에서 여유로운 시간을 보내세요'
    }
  ]

  return (
    <div className="hero-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ 
          type: 'fraction',
          formatFractionCurrent: (number) => number,
          formatFractionTotal: (number) => number
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        loop={true}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="slide-container">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx>{`
        .hero-slider {
          width: 100%;
          height: 500px;
        }
        
        :global(.mySwiper) {
          width: 100%;
          height: 100%;
        }
        
        .slide-container {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
        }
        
        .slide-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .slide-content {
          position: absolute;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
          z-index: 10;
        }
        
        .slide-content h2 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .slide-content p {
          font-size: 1.1rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        
        /* Swiper 버튼 스타일 */
        :global(.swiper-button-prev),
        :global(.swiper-button-next) {
          color: white;
        }
        
        :global(.swiper-pagination-fraction) {
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}