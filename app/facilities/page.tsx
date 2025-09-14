'use client'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface ExtraData {
  parent?: string
  [key: string]: string | undefined
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

export default function FacilitiesPage() {
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
        .eq('page_name', 'facilities')
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
        {/* 헤더 섹션 */}
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

        {/* 동적 섹션 렌더링 */}
        {sectionGroups.map((group, index) => (
          <section key={group.section.id} className="py-20 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-45 h-[1px] bg-gray-300 mx-auto mb-6"></div>
                <h2 className="text-4xl font-light mb-4 text-black whitespace-pre-wrap">
                  {group.section.title}
                </h2>
                {group.section.subtitle && (
                  <p className="text-lg text-black mb-6 font-bold whitespace-pre-wrap">
                    {group.section.subtitle}
                  </p>
                )}
                {group.section.description && (
                  <p className="text-sm text-black max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
                    {group.section.description}
                  </p>
                )}
              </div>

              {/* 카드 렌더링 */}
              {group.cards.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8">
                  {group.cards.map((card) => (
                    <div key={card.id} className="bg-white overflow-hidden shadow-lg">
                      <div className="relative h-48">
                        {card.image_url ? (
                          <Image
                            src={card.image_url}
                            alt={card.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <img 
                            src="/images/facilities/facilities.jpg"
                            alt={card.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="font-semibold text-lg mb-2 text-black whitespace-pre-wrap">
                          {card.title}
                        </h3>
                        {card.subtitle && (
                          <p className="text-sm text-black whitespace-pre-wrap">
                            {card.subtitle}
                          </p>
                        )}
                        {card.description && (
                          <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                            {card.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  )
}