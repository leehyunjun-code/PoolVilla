'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
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
          </div>
        </div>

        {/* Section 1: Urban Cube Pool */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-45 h-[1px] bg-gray-300 mx-auto mb-6"></div>
              <h2 className="text-4xl font-light mb-4 text-black">Urban Cube Pool</h2>
              <p className="text-lg text-black mb-6 font-bold">
                사계절 내내 즐기는 우리만의 프라이빗 풀
              </p>
              <p className="text-sm text-black max-w-2xl mx-auto leading-relaxed">
                사계절 내내 쾌적하게 이용할 수 있는 미온수 풀은<br />
                더운 여름에는 시원한 수영을, 선선한 계절에는 따뜻한 휴식을 선사합니다.<br />
                계절과 상관없이 언제나 물놀이의 즐거움과 힐링을 경험하실 수 있는 프라이빗 풀은<br />
                CUBE45가 드리는 가장 큰 선물입니다. 
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="All Seasons"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">All Seasons</h3>
                  <p className="text-sm text-black">사계절 미온수계 즐기는 쾌브 풀</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Private"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Private</h3>
                  <p className="text-sm text-black">우리만의 프라이빗 독채 풀</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Healing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Healing</h3>
                  <p className="text-sm text-black">자연속에서 느끼는 활혈의 시간</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Private BBQ, Perfect Stay */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-45 h-[1px] bg-gray-300 mx-auto mb-6"></div>
              <h2 className="text-4xl font-light mb-4 text-black">Private BBQ, Perfect Stay</h2>
              <p className="text-lg text-black mb-6 font-bold">
                프라이빗 BBQ, 특별한 추억을 만들다
              </p>
              <p className="text-sm text-black max-w-2xl mx-auto leading-relaxed">
                CUBE45의 개별 BBQ를 즐겨보세요<br />
                풀빌라 객실별 개별로 마련된 전용 공간에서 가족, 연인, 친구와 함께<br />
                나누며 즐기는 BBQ는 여행의 또 다른 즐거움이 됩니다.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Gourmet Journey"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Gourmet Journey</h3>
                  <p className="text-sm text-black">풀빌라 여행 최고의 재미, 미식</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Hardwood Charcoal"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Hardwood Charcoal</h3>
                  <p className="text-sm text-black">프리미엄 숯으로 즐기는 BBQ</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Together"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Together</h3>
                  <p className="text-sm text-black">함께여서 더 행복한 시간</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Taste the Moment */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-45 h-[1px] bg-gray-300 mx-auto mb-6"></div>
              <h2 className="text-4xl font-light mb-4 text-black">Taste the Moment</h2>
              <p className="text-lg text-black mb-6 font-bold">
                프리미엄 베이커리 카페 LX22에서의 힐링타임
              </p>
              <p className="text-sm text-black max-w-2xl mx-auto leading-relaxed">
                CUBE45에서 소개하는 프리미엄 베이커리 카페 LX22.<br />
                여행의 시작과 끝을 달콤한 여유로 채워드립니다.<br />
                시그니처 베이커리 메뉴와 커피로 완성되는 또 하나의 힐링 스팟.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="French Produce"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">French Produce</h3>
                  <p className="text-sm text-black">프랑스산 식자재로 만든 명장의 빵</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Premium Beans"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Premium Beans</h3>
                  <p className="text-sm text-black">최고급 원두를 사용한 시그니처 음료</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Spacious Space"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Spacious Space</h3>
                  <p className="text-sm text-black">단체 수용가능 넓은 공간</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Fresh, Local, Chinese Taste */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-45 h-[1px] bg-gray-300 mx-auto mb-6"></div>
              <h2 className="text-4xl font-light mb-4 text-black">Fresh, Local, Chinese Taste</h2>
              <p className="text-lg text-black mb-6 font-bold">
                가평 현지인이 추천, 신선한 재료로 완성한 중국 요리
              </p>
              <p className="text-sm text-black max-w-2xl mx-auto leading-relaxed">
                매일 새롭게 준비되는 신선한 식재료.<br />
                가평 현지인들이 찾는 맛집의 자신감, 그리고 전통 중국식 요리의 진수를<br />
                두두 중국음식점 가평 설악점에서 만나 보세요. 
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Fresh"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Fresh</h3>
                  <p className="text-sm text-black">매일 공수한 신선한 식재료</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Local Favorite"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Local Favorite</h3>
                  <p className="text-sm text-black">가평 현지인 추천 중식 맛집</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img 
                    src="/images/facilities/facilities.jpg"
                    alt="Tradition"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 text-black">Tradition</h3>
                  <p className="text-sm text-black">전통 중국식 요리의 진수</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}