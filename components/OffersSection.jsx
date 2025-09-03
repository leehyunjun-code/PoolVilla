// components/OffersSection.jsx
'use client'
import { useState } from 'react'

// OFFERS 데이터를 컴포넌트 내부에서 관리
const offersData = [
  {
    id: 1,
    number: '01',
    title: 'CUBE 45 Private Pool Villa',
    subtitle: 'Group Guest Information',
    koreanTitle: '단체고객 예약 안내',
    image: '/images/main/offers.jpg',
    description: '20명 이상 단체 예약 시 특별 할인 혜택을 제공합니다.'
  },
  {
    id: 2,
    number: '02',
    title: 'CUBE 45 Private Pool Villa',
    subtitle: 'Special Package',
    koreanTitle: '스페셜 패키지',
    image: '/images/main/offers.jpg',
    description: '바베큐 세트와 조식이 포함된 특별 패키지입니다.'
  },
  {
    id: 3,
    number: '03',
    title: 'CUBE 45 Private Pool Villa',
    subtitle: 'Long Stay Discount',
    koreanTitle: '장기투숙 할인',
    image: '/images/main/offers.jpg',
    description: '3박 이상 투숙 시 할인 혜택을 제공합니다.'
  },
  {
    id: 4,
    number: '04',
    title: 'CUBE 45 Private Pool Villa',
    subtitle: 'Early Bird Special',
    koreanTitle: '얼리버드 특가',
    image: '/images/main/offers.jpg',
    description: '30일 전 예약 시 특별 할인을 적용해드립니다.'
  },
  {
    id: 5,
    number: '05',
    title: 'CUBE 45 Private Pool Villa',
    subtitle: 'Weekend Package',
    koreanTitle: '주말 패키지',
    image: '/images/main/offers.jpg',
    description: '주말 특별 패키지로 여유로운 휴식을 즐기세요.'
  }
]

export default function OffersSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 이전 슬라이드로 이동
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? offersData.length - 1 : prev - 1))
  }
  
  // 다음 슬라이드로 이동
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === offersData.length - 1 ? 0 : prev + 1))
  }
  
  // 표시할 3개 아이템 가져오기
  const getVisibleOffers = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % offersData.length
      visible.push(offersData[index])
    }
    return visible
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
              <div className="h-64 overflow-hidden">
                <img 
                  src={offer.image}
                  alt={offer.koreanTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* 좌우 화살표 */}
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
      </div>
      
      {/* 페이지 인디케이터 점 */}
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
    </div>
  )
}