'use client'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface ExtraData {
  parent?: string
  [key: string]: any
}

interface VariousContent {
  id: number
  page_name: string
  section_name: string
  content_type: 'section' | 'card'
  title: string
  subtitle: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
  extra_data: ExtraData | null
}

interface SectionWithCards {
  section: VariousContent
  cards: VariousContent[]
}

export default function GuestInfoPage() {
  const [sectionGroups, setSectionGroups] = useState<SectionWithCards[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('cube45_various_contents')
        .select('*')
        .eq('page_name', 'guide')
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      // 섹션과 카드를 그룹화
      const sections = data?.filter(item => item.content_type === 'section') || []
      const groups = sections.map(section => ({
        section,
        cards: data?.filter(item => 
          item.content_type === 'card' && 
          item.extra_data?.parent === section.section_name
        ).sort((a, b) => a.display_order - b.display_order) || []
      }))
      
      setSectionGroups(groups)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">로딩 중...</span>
        </div>
      </div>
    )
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
        
        {/* 이용안내 콘텐츠 */}
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

              {/* 동적 섹션 렌더링 */}
              {sectionGroups.map((group, index) => (
                <div key={group.section.id}>
                  {/* 섹션 제목 */}
                  <div className={index > 0 ? 'mt-20' : ''}>
                    {index > 0 && (
                      /* 섹션 구분선 */
                      <div className="flex items-center mb-20">
                        <div className="w-96 border-t border-gray-300"></div>
                        <div className="px-4"></div>
                      </div>
                    )}
                    
                    <h2 className="text-2xl font-medium mb-8">{group.section.title}</h2>
                    
                    <div className="space-y-8 text-black">
                      {/* 카드(항목) 렌더링 */}
                      {group.cards.map((card) => (
                        <div key={card.id}>
                          <h3 className="text-lg font-medium text-black mb-3">
                            {card.title}
                          </h3>
                          {card.description && (
                            <div className="text-sm space-y-2">
                              {card.description.split('\n').map((line, idx) => (
                                <div key={idx} className={line.startsWith('  ') ? 'ml-4' : ''}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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