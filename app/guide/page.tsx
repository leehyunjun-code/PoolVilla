'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function GuestInfoPage() {
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
        
        {/* 이용안내 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-12">
                <p className="text-xl text-black mb-2">CUBE45</p>
                <p className="text-xl text-black mb-4">URBAN POOL STAY</p>
                <h1 className="text-5xl font-light mb-8">Guest Information</h1>
                {/* 왼쪽 밑줄만 */}
                <div className="flex items-center">
                  <div className="w-96 border-t border-gray-300"></div>
                  <div className="px-4"></div>
                </div>
              </div>

              {/* 이용안내 */}
              <div className="mb-20">
                <h2 className="text-2xl font-medium mb-8">이용안내</h2>
                
                <div className="space-y-8 text-lg  text-black">
                  {/* 애견입실 */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3">애견입실: 애견동반시 1마리당(1박당) 추가요금 발생</h3>
                    <ul className="space-y-2 text-sm">
                      <li>* 0~8kg 10,000원 | 8.1kg~13kg 15,000원 | 13kg 초과시 입실 불가 | 현장결제 객실당 13kg 이하 | 최대 2마리까지 입실가능</li>
                      <li>* 객실당 배변패드, 애견식기 구비완료</li>
                      <li>* 전체 총 200평 면적의 천연잔디 애견운동장 보유(마킹이 잦은 반려견은 실내 매너벨트 착용필수)</li>
                      <li>* 맹견 및 입질이 있는 반려견 입실 제한</li>
                      <li>* 동반한 애견의 배설물 청소 (장시간 방치로 인한 이염 및 오염 발생 시 배상금 청구될 수 있음)</li>
                    </ul>
                  </div>

                  {/* 수영장 */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3">수영장</h3>
                    <ul className="space-y-2 text-sm">
                      <li>* 사계절 실내수영장 미온수 가능 (이용 시 추가요금 별도)</li>
                    </ul>
                  </div>

                  {/* 추가금 안내사항 */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3">추가금 안내사항</h3>
                    <ul className="space-y-2 text-sm">
                      <li>* 추가인원 요금(1박기준): 성인1인 3만원 / 학생1인 2만원 / 아동1인 1만원 / 24개월 미만 2인 무료</li>
                      <li>* 실내수영장 미온수: 이용 시 추가요금 별도</li>
                      <li className="ml-4">동절기 (11월1일~5월31일) 10만원, 기타계절 (6월1일~10월31일) 5만원</li>
                      <li>* 숙박 전일 전화 예약 필수 (당일 미온수 신청 불가)</li>
                      <li>* 숙박 당일 도착 예정 시간을 미리 알려주시면 최대한 시간에 맞추어 미온수 제공해드립니다.</li>
                      <li>* BBQ숯: 4인용 3만원 / 4인용 이상 5만원</li>
                      <li>* 벽난로: 5만원 (20pcs)</li>
                      <li>* 침구류: 추가인원이 있을 시 추가인원 요금안에 포함됨 2인 1SET 제공 </li>
                      <li className="ml-4">(예:매트리스1장,베개2개,이불1장) 추가인원이 없으나 침구류만 요청 시 비용 2만원</li>
                    </ul>
                  </div>
                </div>
              </div>
				
			  {/* 왼쪽 밑줄만 */}
              <div className="flex items-center mb-20">
                <div className="w-96 border-t border-gray-300"></div>
                <div className="px-4"></div>
              </div>	

              {/* 취소 환불규정 */}
              <div>
                <h2 className="text-2xl font-medium mb-8">취소 환불규정</h2>
                
                <div className="space-y-8 text-black">
                  {/* 고객센터 정보 */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3"> 고객 센터 : 전화 070-5129-1674 (평일 근무시간 내 상담, 예약 취소 및 환불)</h3>
                    <ul className="space-y-2 text-sm">
                      <li>– 예약 취소 및 환불 신청은 홈페이지 문의게시판 (예약 취소 및 문의) 또는 직접취소하여 주시면 안내 드립니다.</li>
                      <li>– 예약 취소 환불 업무시간은 평일 오전 9시 ~ 오후 6시 입니다. 업무시간 종료 후 취소는 다음날로 적용됩니다.</li>
                      <li>– 현금 입금 및 카드 결제 예약 및 취소는 접수 후 영업일 기준 1~5일 소요될 수 있습니다.</li>
                    </ul>
                  </div>

                  {/* 주요 규정 */}
                  <div>
                    <h3 className="text-lg font-medium text-black mb-3">예약 취소 및 환불 주요 규정</h3>
                    <ul className="space-y-2 text-sm">
                      <li>– 올바른 예약문화 정착을 위하여 예약취소시 규정을 위와 같이 운영하고 있으니 꼭 확인 후 예약해 주시기 바랍니다.</li>
                      <li>– 캠핑장 입실 후 단순변심 및 결제건에 대한 환불은 불가합니다. (환불액은 객실전체 요금에서 환불 됩니다)</li>
                      <li>– 환불규정에 따라 환불드리는 금액에 차이가 있으니 반드시 확인하시기 바랍니다.</li>
                      <li>– 환불은 입금자 또는 결제자명으로만 가능하며, 환불 수수료는 제외한 후 입금 또는 취소 됩니다.</li>
                      <li>– 1개월 이상 장기숙박 예약일 경우 환불규정은 상이하오니 확인해 주시기 바랍니다.</li>
                      <li>– 예약 결제 완료 후 2시간 이내 취소요청시 전액환불이 가능하나, 그 외에는 ‘입실일로부터 남은 날짜’에 따라 위의 규정을 따릅니다.</li>
                      <li>(당일 이용 예약 후 취소는 환불이 어렵습니다, 이점 유의하여주시기 바랍니다)</li>
                    </ul>
                  </div>
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