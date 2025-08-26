'use client'
import Navigation from '@/components/Navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useState, useEffect } from 'react'

export default function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [nights, setNights] = useState(1)

  // 슬라이드 데이터
  const slides = [
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
    }
  ]

  // 박수 계산
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays > 0 ? diffDays : 1)
    }
  }, [checkIn, checkOut])

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 메인 슬라이더 */}
      <div style={{ height: '600px', position: 'relative' }}>
        <Swiper
          modules={[SwiperNavigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ type: 'fraction' }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                <img 
                  src={slide.image} 
                  alt={`Slide ${slide.id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 풀빌라 B동 */}
          <div className="bg-white overflow-hidden cursor-pointer">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://www.haevichi.com/data/2024/6/5/11/20240605110308788813.db" 
                alt="풀빌라 B동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold">풀빌라 B동</h3>
            </div>
          </div>

          {/* 풀빌라 C동 */}
          <div className="bg-white overflow-hidden cursor-pointer">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://www.haevichi.com/data/2024/6/5/11/20240605110308788813.db" 
                alt="풀빌라 C동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold">풀빌라 C동</h3>
            </div>
          </div>

          {/* 풀빌라 D동 */}
          <div className="bg-white overflow-hidden cursor-pointer">
            <div className="h-64 overflow-hidden">
              <img 
                src="https://www.haevichi.com/data/2024/6/5/11/20240605110308788813.db" 
                alt="풀빌라 D동"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold">풀빌라 D동</h3>
            </div>
          </div>
        </div>
        
        {/* Exclusive Cube 섹션 */}
        <div className="mt-20 relative" style={{ height: '400px' }}>
          <img 
            src="https://pds.joongang.co.kr//news/component/htmlphoto_mmdata/201712/29/593e01a7-940d-4de9-9f53-7e74528341ae.jpg"
            alt="CUBE 45 Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0">
            <div className="h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="text-right text-white" style={{ marginRight: '100px' }}>
                  <p className="mb-2" style={{ fontSize: '2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Exclusive Cube of Joy</p>
                  <h2 className="font-bold mb-6" style={{ fontSize: '5rem', textShadow: '2px 2px 3px rgba(0,0,0,0.8)' }}>CUBE 45</h2>
                  <p style={{ fontSize: '2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>큐브45에서만 누릴 수 있는 즐거움</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OFFERS 섹션 */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">OFFERS</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-4">단체고객안내</h3>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400"
                    alt="단체고객안내"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-4">이벤트</h3>
                </div>
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400"
                    alt="이벤트"
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
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">INDOOR POOL</h2>
          <div className="flex">
            <div className="w-1/3 flex items-center justify-center" style={{ backgroundColor: '#f5e6d3' }}>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">Premium Play Villa</h3>
                <ul className="text-gray-600">
                  <li>• 일반 멘트</li>
                </ul>
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
          <div className="container mx-auto px-4 mt-8">
            <div className="max-w-4xl mx-auto bg-gray-100 p-8 border border-black flex">
              <div className="flex-1">
                <div className="inline-block mb-4">
                  <p className="text-sm text-gray-600">예약문의</p>
                  <div className="border-b border-gray-400 w-full mt-1"></div>
                </div>
                <p className="text-3xl font-bold mb-6">070-5129-1674</p>
                
                <div className="inline-block mb-4">
                  <p className="text-sm text-gray-600">전화문의</p>
                  <div className="border-b border-gray-400 w-full mt-1"></div>
                </div>
                <p className="text-3xl font-bold mb-6">070-5129-1674</p>
                
                <p className="text-xs text-gray-600 mt-4">
                  이메일 : thebran@naver.com<br/>
                  <span className="text-red-500">상담시간 : 평일/휴일 오전 10시 ~ 오후 18시</span>
                </p>
              </div>
              <div className="border-l border-gray-400 mx-8 my-2"></div>
              <div className="flex-1">
                {/* 오른쪽 영역 비워둠 */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}