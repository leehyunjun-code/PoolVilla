'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function LocationPage() {
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
                    <Link href="/intro" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      CUBE 45
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/location" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
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

        {/* 배치도 섹션 */}
        <div className="py-20">
         <div className="container mx-auto px-8">
           <div className="flex items-start gap-16">  {/* items-center를 items-start로 변경 */}
             {/* 왼쪽 텍스트 */}
             <div className="w-1/3 relative">
               <h2 className="text-5xl font-light mb-4 leading-tight">
                 CUBE 45<br />
                 LAYOUT
               </h2>
               {/* 구분선 - LAYOUT 텍스트 바로 아래, 왼쪽으로 더 연장 */}
               <div className="absolute border-t border-gray-300" 
                    style={{ 
                      left: '-350px',
                      right: '0',
                      bottom: '-50px'
                    }}></div>
             </div>
             <div className="w-2/3 mt-16">  {/* mt-16으로 오른쪽만 아래로 */}
               <h3 className="text-xl font-bold mb-6">
                 고요한 자연 속에서 당신만을 위한 프라이빗 쉼터
               </h3>
               <p className="text-base text-gray-700 leading-relaxed">
                 LX22의 특별한 공간들을 한눈에 만나보세요.<br />
                 자연과 하나 되는 LX22 풀빌라는 편리함과 휴식을 동시에<br />
                 제공하는 다채로운 부대시설을 자랑합니다.<br />
                 여유로운 시간을 위한 모든 것이 준비되어 있습니다.
               </p>
             </div>
           </div>
         </div>
        </div>
      </div>
		  
	  {/* 배치도 이미지 */}
	  <div className="w-full py-16">
	   <Image 
	     src="/images/cube45/location.jpg"
	     alt="CUBE 45 배치도"
	     width={1920}
	     height={1080}
	     className="w-full h-auto object-cover"
	   />
	  </div>
      
      <Footer />
    </div>
  )
}