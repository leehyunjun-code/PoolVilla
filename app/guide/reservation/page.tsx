'use client'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import OffersSection from '@/components/OffersSection'

export default function ReservationGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 메인 콘텐츠 */}
      <div className="pt-60">
        {/* OFFERS 섹션 - 컴포넌트로 대체 */}
        <OffersSection />
      </div>
      
      <Footer />
    </div>
  )
}