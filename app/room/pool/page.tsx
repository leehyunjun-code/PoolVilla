'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function PoolVillaPage() {
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
           <div className="flex items-start gap-16">
             {/* 왼쪽 텍스트 */}
             <div className="w-1/3 relative">
               <h2 className="text-5xl font-light mb-4 leading-tight">
                 Pool Villa<br />
                 Overview
               </h2>
               {/* 구분선 */}
               <div className="absolute border-t border-gray-300" 
                    style={{ 
                      left: '-350px',
                      right: '0',
                      bottom: '-50px'
                    }}></div>
             </div>
             <div className="w-2/3 mt-16">
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

        {/* 전체 객실 정보표 */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-light mb-8 text-center">전체 객실 정보</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실명</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실타입</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실면적</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">기준인원</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">최대인원</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">룸</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">화장실</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">벽난로</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">수영장</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">애견동반</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* A동 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">A3호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">45평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">4명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">A4호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">68평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">6명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">10명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">3개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">A5호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">60평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">6명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">10명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">3개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">야외</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">A6호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">60평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">6명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">10명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">3개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">야외</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">A7호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">64평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">6명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">10명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>

                    {/* B동 */}
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">B9호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">64평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">12명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">4개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">야외</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">B10호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">72평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">12명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">4개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">B11호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">72평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">12명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">3개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">B12호</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">70평</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">12명</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">4개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">O</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">없음</td>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">불가</td>
                    </tr>

                    {/* C동 */}
                    {[13, 14, 15, 16, 17].map((num) => (
                      <tr key={`c${num}`}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">C{num}호</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">35평</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">4명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">X</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">가능</td>
                      </tr>
                    ))}
                    {[18, 19, 20, 21].map((num) => (
                      <tr key={`c${num}`}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">C{num}호</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">35평</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">X</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">가능</td>
                      </tr>
                    ))}
                    {[22, 23, 24, 25].map((num) => (
                      <tr key={`c${num}`}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">C{num}호</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">35평</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">4명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">8명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">X</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">가능</td>
                      </tr>
                    ))}

                    {/* D동 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                      <tr key={`d${num}`}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">D{num}호</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">독채</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">23평</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">4명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">1개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">2개</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">X</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">실내</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">가능</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
		  
      <Footer />
    </div>
  )
}