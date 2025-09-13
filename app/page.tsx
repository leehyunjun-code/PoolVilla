'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation as SwiperNavigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { useState, useEffect, useRef } from 'react'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import OffersSection from '@/components/OffersSection'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// 타입 정의
interface ZoneSummary {
  zone: string
  minArea: number
  maxArea: number
  minCapacity: number
  maxCapacity: number
}

interface SlideData {
  id: number
  image_url: string
  title?: string
  subtitle?: string
}

interface Cube45Data {
  topText: string
  mainTitle: string
  bottomText: string
  imageUrl: string
}

export default function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [nights, setNights] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const cube45Ref = useRef(null)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  // Supabase에서 가져올 데이터 상태
  const [zoneSummaries, setZoneSummaries] = useState<Record<string, ZoneSummary>>({})
  const [sliderData, setSliderData] = useState<SlideData[]>([])
  const [cube45Data, setCube45Data] = useState<Cube45Data>({
    topText: 'Exclusive Cube of Joy',
    mainTitle: 'CUBE 45',
    bottomText: '큐브45에서만 누릴 수 있는 즐거움',
    imageUrl: 'https://pds.joongang.co.kr//news/component/htmlphoto_mmdata/201712/29/593e01a7-940d-4de9-9f53-7e74528341ae.jpg'
  })
  const [loading, setLoading] = useState(true)

  // 모든 데이터 가져오기
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. 슬라이더 데이터 가져오기
        const { data: sliderContents, error: sliderError } = await supabase
          .from('cube45_main_contents')
          .select('*')
          .eq('section_type', 'slider')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (sliderError) throw sliderError

        const formattedSlides = sliderContents?.map((slide, index) => ({
          id: slide.id,
          image_url: slide.image_url,
          title: slide.title,
          subtitle: slide.subtitle
        })) || []

        // 슬라이드 복제 (루프 효과)
        const duplicatedSlides = [...formattedSlides, ...formattedSlides.map(slide => ({
          ...slide,
          id: slide.id + 1000
        }))]
        
        setSliderData(duplicatedSlides)

        // 2. CUBE 45 섹션 데이터 가져오기
        const { data: cube45Content, error: cube45Error } = await supabase
          .from('cube45_main_contents')
          .select('*')
          .eq('section_type', 'cube45')
          .eq('is_active', true)
          .single()

        if (!cube45Error && cube45Content) {
          setCube45Data({
            topText: cube45Content.subtitle || '',
            mainTitle: cube45Content.title || '',
            bottomText: cube45Content.description || '',
            imageUrl: cube45Content.image_url || 'https://pds.joongang.co.kr//news/component/htmlphoto_mmdata/201712/29/593e01a7-940d-4de9-9f53-7e74528341ae.jpg'
          })
        }

        // 3. 동별 정보 가져오기
        const { data: rooms, error: roomsError } = await supabase
          .from('cube45_rooms')
          .select('zone, area, standard_capacity, max_capacity')

        if (roomsError) throw roomsError

        // 동별로 그룹화하고 min/max 계산
        const summaries: Record<string, ZoneSummary> = {}
        
        rooms?.forEach(room => {
          const area = parseInt(room.area.replace('평', ''))
          const standardCap = parseInt(room.standard_capacity.replace('명', ''))
          const maxCap = parseInt(room.max_capacity.replace('명', ''))

          if (!summaries[room.zone]) {
            summaries[room.zone] = {
              zone: room.zone,
              minArea: area,
              maxArea: area,
              minCapacity: standardCap,
              maxCapacity: maxCap
            }
          } else {
            summaries[room.zone].minArea = Math.min(summaries[room.zone].minArea, area)
            summaries[room.zone].maxArea = Math.max(summaries[room.zone].maxArea, area)
            summaries[room.zone].minCapacity = Math.min(summaries[room.zone].minCapacity, standardCap)
            summaries[room.zone].maxCapacity = Math.max(summaries[room.zone].maxCapacity, maxCap)
          }
        })

        setZoneSummaries(summaries)
      } catch (error) {
        console.error('데이터 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

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
        console.log('스크롤 감지:', entry.isIntersecting)
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }  // 0.3에서 0.1로 낮춤
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

  // 동별 정보 표시 헬퍼 함수
  const getZoneDisplay = (zone: string) => {
    const summary = zoneSummaries[zone]
    if (!summary) return { area: '로딩중...', capacity: '로딩중...' }
    
    const area = summary.minArea === summary.maxArea 
      ? `${summary.minArea}평` 
      : `${summary.minArea}~${summary.maxArea}평`
    
    const capacity = `${summary.minCapacity}~${summary.maxCapacity}명`
    
    return { area, capacity }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 3분할 메인 슬라이더 */}
      <div style={{ height: '600px', position: 'relative', overflow: 'hidden', marginTop: '50px' }}>
        {sliderData.length > 0 ? (
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
            {sliderData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  <img 
                    src={slide.image_url} 
                    alt={slide.title || `Slide ${slide.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                    {slide.title && <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>}
                    {slide.subtitle && <p className="text-lg">{slide.subtitle}</p>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p>슬라이더 이미지가 없습니다.</p>
          </div>
        )}

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
                  min={new Date().toISOString().split('T')[0]}
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
                  min={checkIn || new Date().toISOString().split('T')[0]}
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
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
                  min="1"
                  className="px-3 py-2 border rounded-md w-16 text-center"
                />
              </div>
              <div className="text-center">
                <label className="block text-sm text-gray-600 mb-1">소인</label>
                <input 
                  type="number" 
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                  min="0"
                  className="px-3 py-2 border rounded-md w-16 text-center"
                />
              </div>
              <button 
                onClick={() => {
                  const params = new URLSearchParams({
                    checkIn: checkIn,
                    checkOut: checkOut,
                    adults: adults.toString(),
                    children: children.toString()
                  })
                  window.location.href = `/reservation?${params.toString()}`
                }}
                className="bg-gray-800 text-white px-6 py-2.5 rounded-md hover:bg-gray-700 transition-colors"
              >
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
        
        {/* 정보 영역 - Supabase 데이터 연동 */}
        <div className="flex">
          {/* A동 정보 */}
          <div className="pt-4 px-4 flex-1">
            <div className="flex items-center">
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">크기</span>
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('A').area}</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('A').capacity}</p>
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
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('B').area}</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('B').capacity}</p>
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
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('C').area}</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('C').capacity}</p>
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
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('D').area}</p>
              </div>
              <div className="flex-1 text-center">
                <span className="inline-block bg-gray-100 px-4 py-2 rounded text-base font-medium text-gray-600 mb-2">인원</span>
                <p className="font-bold text-xl text-gray-800">{getZoneDisplay('D').capacity}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exclusive Cube 섹션 - Supabase 데이터 연동 */}
        <div ref={cube45Ref} className="mt-20 relative" style={{ height: '400px' }}>
          <img 
            src={cube45Data.imageUrl}
            alt="CUBE 45 Pool"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0">
            <div className="h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="text-right text-white" style={{ marginRight: '100px' }}>
                  <p className={`mb-2 ${isVisible ? 'animate-fade-up' : ''}`} style={{ 
                    fontSize: '2rem', 
                    textShadow: '2px 2px 4px rgba(0,0,0,1)',
                    color: 'white',
                  }}>{cube45Data.topText}</p>
                  <h2 className={`font-bold mb-6 ${isVisible ? 'animate-fade-up-delay-1' : ''}`} style={{ 
                    fontSize: '5rem', 
                    textShadow: '2px 2px 3px rgba(0,0,0,0.8)',
                  }}>{cube45Data.mainTitle}</h2>
                  <p className={`${isVisible ? 'animate-fade-up-delay-2' : ''}`} style={{ 
                    fontSize: '2rem', 
                    textShadow: '2px 2px 4px rgba(0,0,0,1)',
                    color: 'white',
                  }}>{cube45Data.bottomText}</p>
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

        {/* OFFERS 섹션 - 컴포넌트로 대체 */}
        <OffersSection />

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
                <Link href="/reservation">
                  <button className="border border-gray-800 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    예약하기
                  </button>
                </Link>
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
      
      {/* 예약문의/현장문의 섹션 */}
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