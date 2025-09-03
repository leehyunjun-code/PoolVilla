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
      <div className="pt-28 bg-gray-50">
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
            

            {/* 하단 정보 바 */}
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(245, 230, 211, 0.6)' }}>
              <div className="container mx-auto px-8">
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-8">
                    <Link href="/room/pool" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
                      풀빌라옵션
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/room/a" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      A동
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/room/b" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      B동
                    </Link>
					<span className="text-black">|</span>  
					<Link href="/room/c" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      C동
                    </Link>
					<span className="text-black">|</span>  
					<Link href="/room/d" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      D동
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
                 Pool Villa<br />
                 Overview
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
                 나에게 맞는 풀빌라, 바로 여기 CUBE 45 에서
               </h3>
               <p className="text-base text-gray-700 leading-relaxed">
                 프라이빗한 휴식부터 단체로 함께 즐기는 공간까지, <br />
                 CUBE 45 모든 객실의 상세 정보를 한눈에 확인하고 특별<br />
                 한 경험을 선택하세요
               </p>
             </div>
           </div>
         </div>
        </div>
      </div>
		  
      {/* 풀빌라 이미지 */}
     <div className="py-16 flex justify-center bg-gray-50">
       <div className="w-1/3">
         <Image 
           src="/images/room/pool.jpg"
           alt="Pool Villa"
           width={640}
           height={360}
           className="w-full h-auto object-cover"
         />
       </div>
     </div>
     
     <Footer />
   </div>
 )
}