// components/OffersSection.jsx
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

export default function OffersSection() {
  const [offersData, setOffersData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('cube45_various_contents')
        .select('*')
        .eq('page_name', 'special')
        .eq('content_type', 'offer')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      // 데이터 형식 변환 - extra_data 활용
      const formattedOffers = data?.map((item, index) => ({
        id: item.id,
        number: item.extra_data?.number || String(index + 1).padStart(2, '0'),
        title: item.title || 'CUBE 45 Private Pool Villa',
        subtitle: item.subtitle || '',
        koreanTitle: item.extra_data?.koreanTitle || '',
        image: item.image_url || '/images/main/offers.jpg',
        description: item.description || ''
      })) || []

      setOffersData(formattedOffers)
    } catch (error) {
      console.error('오퍼 데이터 로드 실패:', error)
      // 에러 시 기본 데이터 사용
      setOffersData([
        {
          id: 1,
          number: '01',
          title: 'CUBE 45 Private Pool Villa',
          subtitle: 'Group Guest Information',
          koreanTitle: '단체고객 예약 안내',
          image: '/images/main/offers.jpg',
          description: '20명 이상 단체 예약 시 특별 할인 혜택을 제공합니다.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }
  
  // 이전 슬라이드로 이동
  const handlePrev = () => {
    if (offersData.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? offersData.length - 1 : prev - 1))
  }
  
  // 다음 슬라이드로 이동
  const handleNext = () => {
    if (offersData.length === 0) return
    setCurrentIndex((prev) => (prev === offersData.length - 1 ? 0 : prev + 1))
  }
  
  // 표시할 3개 아이템 가져오기
  const getVisibleOffers = () => {
    if (offersData.length === 0) return []
    
    const visible = []
    const itemsToShow = Math.min(3, offersData.length)
    
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % offersData.length
      visible.push(offersData[index])
    }
    return visible
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">OFFERS</h2>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (offersData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">OFFERS</h2>
        <p className="text-center text-gray-500">등록된 오퍼가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">OFFERS</h2>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {getVisibleOffers().map((offer) => (
            <div key={offer.id}>
              <div className="mb-2">
                <p className="text-gray-500 text-sm mb-1">{offer.number}</p>
                <p className="text-xs text-gray-600 mb-2">{offer.title}</p>
                <h3 className="text-xl font-semibold mb-1">{offer.subtitle}</h3>
                <h3 className="text-xl font-semibold">{offer.koreanTitle}</h3>
              </div>
              <div className="h-64 overflow-hidden relative">
                {offer.image.startsWith('http') || offer.image.startsWith('https') ? (
                  <Image
                    src={offer.image}
                    alt={offer.koreanTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img 
                    src={offer.image}
                    alt={offer.koreanTitle}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* 좌우 화살표 - 오퍼가 3개 이상일 때만 표시 */}
        {offersData.length > 3 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* 페이지 인디케이터 점 - 오퍼가 3개 이상일 때만 표시 */}
      {offersData.length > 3 && (
        <div className="flex justify-center mt-8 gap-2">
          {offersData.map((_, index) => {
            // 현재 표시되는 3개 카드 인덱스 확인
            let isActive = false
            for (let i = 0; i < 3; i++) {
              if ((currentIndex + i) % offersData.length === index) {
                isActive = true
                break
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}