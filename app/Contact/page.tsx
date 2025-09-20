'use client'
import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Navigation from '@/components/Navigation'
import ContactSection from '@/components/ContactSection'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface BannerData {
  id: number
  page_name: string
  section_name: string
  content_type: string
  title: string
  subtitle: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
  extra_data: Record<string, unknown> | null
}

export default function ContactPage() {
  const [bannerData, setBannerData] = useState<BannerData | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchBanner()
  }, [])
  
  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('cube45_various_contents')
        .select('*')
        .eq('page_name', 'contact')
        .eq('content_type', 'banner')
        .eq('is_active', true)
        .limit(1)
      
      if (error) throw error
      
      // 데이터가 있으면 첫 번째 항목 사용
      if (data && data.length > 0) {
        setBannerData(data[0])
      }
    } catch (error) {
      console.error('배너 데이터 로드 실패:', error)
      // 배너가 없어도 페이지는 정상 표시
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 메인 콘텐츠 - 네비게이션과의 간격 추가 */}
      <div className="pt-28 md:pt-36">
        {/* 배너 섹션 - 반응형 높이 */}
        {!loading && bannerData && bannerData.image_url && (
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <Image
              src={bannerData.image_url}
              alt="Contact Banner"
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
            
            {/* 배너 텍스트 (옵션) */}
            {(bannerData.title || bannerData.subtitle) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  {bannerData.title && (
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{bannerData.title}</h1>
                  )}
                  {bannerData.subtitle && (
                    <p className="text-lg md:text-2xl">{bannerData.subtitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* 로딩 중 배너 플레이스홀더 */}
        {loading && (
          <div className="h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 animate-pulse"></div>
        )}
        
        {/* Contact 섹션 - 메인 컨텐츠 */}
        <div className="py-8 md:py-12">
          <ContactSection />
        </div>
      </div>
      
      {/* 푸터 - 위 여백 추가 */}
      <div className="mt-16 md:mt-20">
        <Footer />
      </div>
    </div>
  )
}