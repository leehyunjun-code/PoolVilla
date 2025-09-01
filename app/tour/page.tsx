'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function TourPage() {
  // 카페 데이터
  const cafes = [
    {
      id: 1,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    },
    {
      id: 2,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    },
    {
      id: 3,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    },
    {
      id: 4,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    },
    {
      id: 5,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    },
    {
      id: 6,
      name: 'LX22 베이커리 카페',
      description: '가평 유일의 대형 베이커리 카페\n명장이 만든 신선한 베이커리와 시그니처 음료를\n즐길 수 있는 마운틴 뷰 베이커리 카페'
    }
  ]

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
                    <Link href="/location" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      배치도
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/tour" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
                      관광정보
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 소개 섹션 */}
        <div className="py-20">
          <div className="container mx-auto px-8">
            <div className="flex items-start gap-16">
              {/* 왼쪽 텍스트 */}
              <div className="w-1/3 relative">
                <h2 className="text-5xl font-light mb-4 leading-tight">
                  Exclusive<br />
                  Cube of Joy
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

        {/* 카페 목록 섹션 */}
        <div className="py-16">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1">
              {cafes.map((cafe, index) => (
                <div key={cafe.id}>
                  <div className="flex bg-white py-8">
                    {/* 왼쪽 이미지 */}
                    <div className="w-1/3">
                      <Image 
                        src="/images/cube45/tour.jpg"
                        alt={cafe.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* 오른쪽 콘텐츠 */}
                    <div className="w-2/3 px-8 flex flex-col justify-between">
                      <div>
                        <div className="mb-6 relative">  {/* mb-4 → mb-6 */}
                          <p className="text-sm text-black mb-3">#Premium Artisan Bakery Café</p>  {/* mb-2 → mb-3 */}
                          <div className="absolute border-b border-black"
                               style={{ 
                                 left: '0',
                                 right: '95%',
                               }}>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-6" style={{ marginTop: '30px' }}>{cafe.name}</h3>  {/* mb-4 → mb-6, marginTop: '20px' → '30px' */}
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {cafe.description}
                        </p>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                          자세히보기
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 카페 사이 구분선 */}
                  {index < cafes.length - 1 && (
                    <div className="border-b border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}