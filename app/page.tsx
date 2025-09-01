'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect, useRef } from 'react'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [nights, setNights] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const cube45Ref = useRef(null)

  // 슬라이드 데이터 - 루프 개선을 위해 복제
  const originalSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1920',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920',
    }
  ]
  
  // 슬라이드를 복제하여 부드러운 루프 만들기
  const slides = [...originalSlides, ...originalSlides.map(slide => ({...slide, id: slide.id + 4}))]

  // 박수 계산
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays > 0 ? diffDays : 1)
    }
  }, [checkIn, checkOut])

  // CUBE 45 애니메이션 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    if (cube45Ref.current) {
      observer.observe(cube45Ref.current)
    }

    return () => {
      if (cube45Ref.current) {
        observer.unobserve(cube45Ref.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 3분할 메인 슬라이더 */}
      <div style={{ height: '600px', position: 'relative', overflow: 'hidden', marginTop: '50px' }}>
        <Swiper
          modules={[SwiperNavigation, Autoplay]}
          spaceBetween={40}
          slidesPerView={1.7}
          centeredSlides={true}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false 
          }}
          loop={true}
          watchSlidesProgress={true}
          breakpoints={{
            640: {
              slidesPerView: 1.4,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 1.6,
              spaceBetween: 35,
            },
            1024: {
              slidesPerView: 1.8,
              spaceBetween: 45,
            },
            1280: {
              slidesPerView: 2.2,
              spaceBetween: 60,
            },
          }}
          className="h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <img 
                  src={slide.image} 
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 커스텀 네비게이션 버튼 */}
        <button className="swiper-button-prev-custom absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-custom absolute right-10 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 슬라이드 효과 스타일 */}
        <style jsx global>{`
          .swiper-slide {
            opacity: 0.4;
            transform: scale(0.9);
            transition: all 0.3s ease;
          }
          
          .swiper-slide-active {
            opacity: 1;
            transform: scale(1);
          }
          
          .swiper-slide-prev,
          .swiper-slide-next {
            opacity: 0.6;
            transform: scale(0.95);
          }
        `}</style>
      </div>

      {/* 예약 검색 바 */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-center gap-4">
            <div className="flex items-end gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">체크인</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="text-center px-3">
                <div className="text-xl font-bold">{nights}박</div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">체크아웃</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <div className="text-center">
                <label className="block text-sm text-gray-600 mb-1">성인</label>
                <input 
                  type="number" 
                  defaultValue="2"
                  min="1"
                  className="px-3 py-2 border rounded-md w-16 text-center"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm text-gray-600 mb-1">어린이</label>
                <input 
                  type="number" 
                  defaultValue="0"
                  min="0"
                  className="px-3 py-2 border rounded-md w-16 text-center"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm text-gray-600 mb-1">유아</label>
                <input 
                  type="number" 
                  defaultValue="0"
                  min="0"
                  className="px-3 py-2 border rounded-md w-16 text-center"
                />
              </div>
              <button className="bg-gray-800 text-white px-6 py-2.5 rounded-md hover:bg-gray-700 transition-colors">
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POOL VILLA 섹션 */}
      <main className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">POOL VILLA</h2>
        <div className="flex">
          {/* 풀빌라 A동 */}
          <div className="bg-white overflow-hidden cursor-pointer flex-1">
            <div className="h-80 overflow-hidden">
              <img 
                src="/images/main/villa.jpg" 
                alt="풀빌라 A동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">풀빌라 A동</h3>
            </div>
          </div>

          {/* 풀빌라 B동 */}
          <div className="bg-white overflow-hidden cursor-pointer flex-1">
            <div className="h-80 overflow-hidden">
              <img 
                src="/images/main/villa.jpg" 
                alt="풀빌라 B동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">풀빌라 B동</h3>
            </div>
          </div>

          {/* 풀빌라 C동 */}
          <div className="bg-white overflow-hidden cursor-pointer flex-1">
            <div className="h-80 overflow-hidden">
              <img 
                src="/images/main/villa.jpg" 
                alt="풀빌라 C동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">풀빌라 C동</h3>
            </div>
          </div>

          {/* 풀빌라 D동 */}
          <div className="bg-white overflow-hidden cursor-pointer flex-1">
            <div className="h-80 overflow-hidden">
              <img 
                src="/images/main/villa.jpg" 
                alt="풀빌라 D동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-4">풀빌라 D동</h3>
            </div>
          </div>
        </div>
        
        {/* 전체 가로줄 */}
        <div className="border-t border-gray-300"></div>
        
        {/* 정보 영역 */}
        <div className="flex">
          {/* A동 정보 */}
          <div className="pt-4 px-4 flex-1">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">크기</span>
                <p className="font-bold text-xl text-gray-800">22~40평</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">4~10명</p>
              </div>
            </div>
          </div>

          {/* 세로줄 */}
          <div className="border-l border-gray-300 my-4"></div>

          {/* B동 정보 */}
          <div className="pt-4 px-4 flex-1">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">크기</span>
                <p className="font-bold text-xl text-gray-800">22~40평</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">4~10명</p>
              </div>
            </div>
          </div>

			
          {/* 세로줄 */}
          <div className="border-l border-gray-300 my-4"></div>

          {/* C동 정보 */}
          <div className="pt-4 px-4 flex-1">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">크기</span>
                <p className="font-bold text-xl text-gray-800">22~40평</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">4~10명</p>
              </div>
            </div>
          </div>

          {/* 세로줄 */}
          <div className="border-l border-gray-300 my-4"></div>

          {/* D동 정보 */}
          <div className="pt-4 px-4 flex-1">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">크기</span>
                <p className="font-bold text-xl text-gray-800">22~40평</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">4~10명</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exclusive Cube 섹션 */}
        <div ref={cube45Ref} className="mt-20 relative" style={{ height: '400px' }}>
          <img 
            src="https://pds.joongang.co.kr//news/component/htmlphoto_mmdata/201712/29/593e01a7-940d-4de9-9f53-7e74528341ae.jpg"
            alt="CUBE 45 Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0">
            <div className="h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="text-right text-white" style={{ marginRight: '100px' }}>
                  <p className={`mb-2 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} style={{ 
                    fontSize: '2rem', 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}>Exclusive Cube of Joy</p>
                  <h2 className={`font-bold mb-6 ${isVisible ? 'animate-fade-up-delay-1' : 'opacity-0'}`} style={{ 
                    fontSize: '5rem', 
                    textShadow: '2px 2px 3px rgba(0,0,0,0.8)',
                  }}>CUBE 45</h2>
                  <p className={`${isVisible ? 'animate-fade-up-delay-2' : 'opacity-0'}`} style={{ 
                    fontSize: '2rem', 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  }}>큐브45에서만 누릴 수 있는 즐거움</p>
                </div>
              </div>
            </div>
          </div>
          <style jsx global>{`
            @keyframes fadeUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .animate-fade-up {
              animation: fadeUp 0.8s ease-out forwards;
            }
            
            .animate-fade-up-delay-1 {
              animation: fadeUp 0.8s ease-out 0.2s forwards;
            }
            
            .animate-fade-up-delay-2 {
              animation: fadeUp 0.8s ease-out 0.4s forwards;
            }
          `}</style>
        </div>

        {/* OFFERS 섹션 */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">OFFERS</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div>
                <div className="mb-2">
                  <p className="text-gray-500 text-sm mb-1">01</p>
                  <p className="text-xs text-gray-600 mb-2">CUBE 45 Private Pool Villa</p>
                  <h3 className="text-xl font-semibold mb-1">Group Guest Information</h3>
                  <h3 className="text-xl font-semibold">단체고객 예약 안내</h3>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src="/images/main/offers.jpg"
                    alt="단체고객안내"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-2">
                  <p className="text-gray-500 text-sm mb-1">01</p>
                  <p className="text-xs text-gray-600 mb-2">CUBE 45 Private Pool Villa</p>
                  <h3 className="text-xl font-semibold mb-1">Group Guest Information</h3>
                  <h3 className="text-xl font-semibold">단체고객 예약 안내</h3>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src="/images/main/offers.jpg"
                    alt="단체고객안내"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
        
              <div>
                <div className="mb-2">
                  <p className="text-gray-500 text-sm mb-1">01</p>
                  <p className="text-xs text-gray-600 mb-2">CUBE 45 Private Pool Villa</p>
                  <h3 className="text-xl font-semibold mb-1">Group Guest Information</h3>
                  <h3 className="text-xl font-semibold">단체고객 예약 안내</h3>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src="/images/main/offers.jpg"
                    alt="단체고객안내"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* 좌우 화살표 */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* INDOOR POOL 섹션 */}
        <div className="pt-16">
          <h2 className="text-3xl font-bold text-center mb-12">INDOOR POOL</h2>
          <div className="flex">
            <div className="w-1/3 flex items-center justify-center" style={{ backgroundColor: '#f5e6d3' }}>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">Premium Play Villa</h3>
                <ul className="text-gray-600 mb-4">
                  <li>• 실내 수영장</li>
                </ul>
                <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  예약하기
                </button>
              </div>
            </div>
            <div className="w-2/3">
              <img 
                src="https://yaimg.yanolja.com/v5/2025/04/20/13/6804f4aae77766.07230332.jpg"
                alt="Indoor Pool"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* 예약문의/현장문의 섹션 - main 태그 밖 */}
      <div className="flex">
        {/* 예약문의 */}
        <div className="w-1/2 relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/images/main/left.jpg)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 p-12 text-white h-full flex flex-col justify-center">
            <h3 className="text-2xl mb-6 border-b border-white inline-block pb-2">예약문의</h3>
            <p className="text-4xl font-bold mb-4">070-5129-1667</p>
            <p className="text-base">이메일 : thebran@naver.com</p>
            <p className="text-base">상담시간 : 평일/휴일 오전 10시 ~ 오후 18시</p>
          </div>
        </div>
        
        {/* 현장문의 */}
        <div className="w-1/2 relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/images/main/right.jpg)' }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 p-12 text-white h-full flex flex-col justify-center">
            <h3 className="text-2xl mb-6 border-b border-white inline-block pb-2">현장문의</h3>
            <p className="text-4xl font-bold">070-5129-1667</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}