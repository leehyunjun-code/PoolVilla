'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function IntroPage() {
  // 애니메이션을 위한 ref들
  const leftTextRef = useRef(null)
  const rightImageRef = useRef(null)
  const centerImageRef = useRef(null)
  const leftTitleRef = useRef(null)
  const rightTextRef = useRef(null)
  const reservationBtnRef = useRef(null)

  useEffect(() => {
    // Intersection Observer 설정
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in')
        } else {
          entry.target.classList.remove('animate-slide-in')
        }
      })
    }, observerOptions)

    // 모든 애니메이션 요소들을 관찰
    const elements = [
      leftTextRef.current,
      rightImageRef.current,
      centerImageRef.current,
      leftTitleRef.current,
      rightTextRef.current,
      reservationBtnRef.current
    ]

    elements.forEach(el => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style jsx global>{`
        /* 초기 상태 - 왼쪽 요소들 */
        .slide-from-left {
          transform: translateX(-100px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* 초기 상태 - 오른쪽 요소들 */
        .slide-from-right {
          transform: translateX(100px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* 초기 상태 - 중앙 요소들 */
        .slide-from-bottom {
          transform: translateY(50px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* 애니메이션 실행 */
        .animate-slide-in {
          transform: translate(0, 0) !important;
          opacity: 1 !important;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* 네비게이션 */}
        <Navigation />

        {/* 메인 콘텐츠 */}
        <div className="pt-28">
          {/* CUBE 45 헤더 섹션 */}
          <div className="relative">
            <div className="h-[500px] relative overflow-hidden">
              <Image 
                src="/images/cube45/background.jpg"
                alt="CUBE 45" 
                fill
                priority
                quality={100}
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
              
              {/* 텍스트 오버레이 */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-8">
                  <div className="text-white max-w-2xl">
                    <h1 className="text-7xl font-bold mb-4">CUBE 45</h1>	
                    <p className="text-lg mb-2">즐거움을 담은 단 하나의 큐브</p>
                  </div>
                </div>
              </div>

              {/* 하단 정보 바 */}
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(245, 230, 211, 0.6)' }}>
                <div className="container mx-auto px-8">
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center space-x-8">
                      <Link href="/intro" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
                        CUBE 45
                      </Link>
                      <span className="text-black">|</span>
                      <Link href="/location" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                        배치도
                      </Link>
                      <span className="text-black">|</span>
                      <Link href="/tour" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                        관광정보
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Cube of Joy 섹션 */}
          <div className="py-20">
            <div className="container mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* 왼쪽 텍스트 영역 - 왼쪽에서 슬라이드 인 */}
                <div ref={leftTextRef} className="slide-from-left">
                  <div className="mt-12 mb-8 relative">
                    <h2 className="text-5xl font-light leading-tight">
                      Exclusive<br/>
                      Cube of Joy
                    </h2>
                    <span className="absolute text-gray-500 text-base border-b border-gray-400 pb-1" 
                          style={{ top: '50%', right: '310px', transform: 'translateY(-50%)' }}>
                      in gapyeong
                    </span>
                  </div>
                  
                  {/* 구분선 */}
                  <div className="border-t border-gray-300 my-20 -mr-32"></div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">고요한 휴식 속 프라이빗 빌라</h3>
                      <p className="text-black leading-relaxed text-xl">
                        고요한 자연 속에서 당신만을 위한 프라이빗 쉼터<br/>
                        사계절 내내 이용 가능한 실내 수영장과<br/>
                        고급스러운 편의시설을 갖춘 LX22 풀빌라에서<br/>
                        진정한 힐링을 경험하세요. 자연 속에서 일상의<br/>
                        피로를 씻어내고 마음의 평화를 찾을 수 있는<br/>
                        특별한 공간입니다.
                      </p>
                    </div>
                  </div>

                  <button className="mt-10 px-8 py-2 border border-gray-800 rounded-full text-gray-800 text-sm font-medium hover:bg-gray-100 transition-colors"
                          style={{ marginLeft: '180px' }}>
                    Gallery
                  </button>
                </div>

                {/* 오른쪽 이미지 영역 - 오른쪽에서 슬라이드 인 */}
                <div ref={rightImageRef} className="flex justify-center -mt-28 slide-from-right">
                  <div 
                    className="shadow-2xl overflow-hidden"
                    style={{
                      width: '640px',
                      height: '480px',
                      borderTopLeftRadius: '240px',
                      borderBottomLeftRadius: '240px',
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0'
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800" 
                      alt="CUBE 45 Interior" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* An Exceptional Retreat 섹션 */}
          <div className="py-32 pb-80">
            <div className="container mx-auto px-8">
              <div className="flex items-center justify-center">
                
                {/* 중앙 이미지와 주변 텍스트 컨테이너 */}
                <div className="relative">
                  
                  {/* 중앙 이미지 - 아래에서 슬라이드 인 */}
                  <div ref={centerImageRef} 
                       className="overflow-hidden shadow-lg slide-from-bottom"
                       style={{
                         width: 'calc(16rem * 1.5)',
                         height: 'calc(22rem * 1.5)',
                         borderTopLeftRadius: '190px',
                         borderTopRightRadius: '190px',
                         borderBottomRightRadius: '180px',
                         borderBottomLeftRadius: '40px',
                         marginLeft: '-160px',
						 zIndex: 10	 
                       }}>
                    <img 
                      src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800" 
                      alt="Villa Pool View" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 왼쪽 위 제목 - 왼쪽에서 슬라이드 인 */}
                  <div ref={leftTitleRef} className="absolute slide-from-left" style={{ left: '-600px', top: '-16px' }}>
                    <h2 className="text-4xl font-light leading-tight">
                      An Exceptional<br/>
                      Retreat<br/>
                      in the<br/>
                      Grandest Villa
                    </h2>
                  </div>
                  
                  {/* 구분선 - 사진 뒤로 */}
                  <div className="absolute border-t border-gray-300" 
                       style={{ 
                         left: '-700px', 
                         right: '-800px', 
                         top: '50%', 
                         transform: 'translateY(-50%)',
                         zIndex: 5
                       }}>
                  </div>
                  
                  {/* 오른쪽 텍스트 - 오른쪽에서 슬라이드 인 */}
                  <div ref={rightTextRef} className="absolute left-80 top-102 w-96 whitespace-nowrap slide-from-right">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold mb-3">고요한 휴식 속 프라이빗 빌라</h3>
                        <p className="text-black leading-relaxed text-xl">
                          고요한 자연 속에서 당신만을 위한 프라이빗 쉼터<br/>
                          사계절 내내 이용 가능한 실내 수영장과 고급스러운<br/>
                          편의시설을 갖춘 LX22 풀빌라에서 진정한 힐링을 경험하세요.<br/>
                          자연 속에서 일상의 피로를 씻어내고<br/>
                          마음의 평화를 찾을 수 있는 특별한 공간입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 오른쪽 아래 Reservation 버튼 - 오른쪽에서 슬라이드 인 */}
                  <div ref={reservationBtnRef} className="absolute slide-from-right" style={{ right: '-500px', bottom: '-150px' }}>
                    <button className="px-8 py-2 border border-gray-800 rounded-full text-gray-800 text-sm font-medium hover:bg-gray-100 transition-colors">
                      Reservation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  )
}