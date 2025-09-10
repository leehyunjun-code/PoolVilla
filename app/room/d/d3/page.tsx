'use client'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function LocationPage() {
  // 이미지 슬라이더를 위한 상태 관리
  const [currentImage, setCurrentImage] = useState(0)
  const totalImages = 5

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 메인 콘텐츠 */}
      <div className="pt-28">
        {/* CUBE 45 헤더 섹션 */}
        <div className="relative">
          <div className="h-[500px] relative overflow-hidden">
            <Image 
              src="/images/cube45/background2.jpg"
              alt="CUBE 45" 
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>      
          </div>
        </div>
        
        {/* D-Zone 텍스트 */}
        <div className="flex items-center py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="text-black max-w-2xl ml-64">
              <h1 className="text-7xl mb-4">D-Zone</h1>	
              <p className="text-3xl">#독채풀빌라 #실내수영장 #애견동반</p>
            </div>
          </div>
        </div>
		  
        {/* A3 텍스트 */}
        <div className="flex items-center bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="text-black max-w-2xl ml-64">
              <h1 className="text-7xl">D3호</h1>	
            </div>
          </div>
        </div> 
        
        {/* 이미지 슬라이더 섹션 */}
        <div className="py-10 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto relative">
              {/* 메인 이미지 */}
              <div className="relative h-[450px] overflow-hidden">
                <Image
                  src="/images/room/aroom.jpg"
                  alt={`A동 이미지 ${currentImage + 1}`}
                  fill
                  quality={100}
                  className="object-cover"
                  sizes="100vw"
                />
                
                {/* 왼쪽 화살표 버튼 */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all"
                  aria-label="이전 이미지"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* 오른쪽 화살표 버튼 */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all"
                  aria-label="다음 이미지"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 하단 인디케이터 (점) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {[...Array(totalImages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                      aria-label={`이미지 ${index + 1}로 이동`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto">
              {/* 연결된 줄 */}
              <div className="mb-12">
                <div className="border-t border-gray-400"></div>
              </div>
        
              {/* 기본정보 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">기본정보</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div>객실타입 : 독채 풀빌라 (마운틴뷰)</div>
                  <div>객실구성 : 침대룸 2개 (더블사이즈 배드 2개), 화장실 2개</div>
                  <div>객실크키 : 45평</div>
                  <div>기준 / 최대인원 : 4명 / 8명 (기준인원 초과시 추가금 발생)</div>
                  <div>수영장 : 실내수영장 (가로 6M, 세로 4M, 수심 1.2M)</div>
                </div>
              </div>
        
              {/* 구분선 */}
              <div className="mb-12">
                <div className="border-t border-gray-400"></div>
              </div>
        
              {/* 어메니티 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">어메니티</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div>침대, 취사시설, 냉장고, 전자레인지, 벽난로, 에어컨, 식탁, TV</div>
                  <div>커피포트, 개별 바비큐, 실내 수영장, 헤어드라이어, 조리도구</div>
                </div>
              </div>
        
              {/* 이용안내 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">이용안내</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div>애견동반 : 불가능</div>
                  <div>벽난로 이용가능기간: 12월~3월</div>
                  <div>
                    추가금 안내사항<br />
                    • 추가인원 요금(1박 기준): 성인 1인 3만원 / 학생 1인 2만원 / 아동 1인 1만원 / 24개월 미만 2인 무료<br />
                    • 사계절 실내수영장 미온수 가능 (이용 시 추가요금 별도, 숙박 전일 전화 예약 필수, 당일 이용불가)<br />
                    • 실내수영장 미온수: 이용 시 추가요금 별도<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;동절기 (11월1일~5월31일) 10만원, 기타계절 (6월1일~10월31일) 5만원<br />	
                    • BBQ숯+그릴: 4인용 3만원 / 4인용 이상 5만원<br />
                    • 벽난로: 5만원 (20pcs)<br />
                    • 침구류: 추가인원이 있을 시 추가인원 요금안에 포함됨 2인 1SET 제공<br />
                    (예:매트리스1장,베개2개,이불1장) 추가인원이 없으나 침구류만 요청 시 비용 2만원<br />
                    • 현장 상태에 따라 가구 혹은 비품이 달라질 수 있습니다.
                  </div>
                </div>
              </div>		
        
              {/* 동별 바로가기 버튼들 */}
              <div className="flex flex-col items-center gap-8">
                {/* 첫째줄 - A동 바로가기 (가운데) */}
                <div className="flex justify-center">
                  <a href="/room/d" className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      D동 바로가기
                    </button>
                  </a>
                </div>
                
                {/* 둘째줄 - B,C,D동 바로가기 (3개 그리드) */}
                <div className="grid grid-cols-3 gap-12">
                  
				  <a href="/room/a" className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      A동 바로가기
                    </button>
                  </a>	
                  
			      <a href="/room/b" className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      B동 바로가기
                    </button>
                  </a>		
				  <a href="/room/c" className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      C동 바로가기
                    </button>
                  </a>	
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}