'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface RoomContent {
  id: number
  page_type: string
  room_id: string | null
  section_name: string
  content: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export default function RoomDetailPage() {
  const pathname = usePathname()
  
  // URL에서 직접 roomId 추출 (/room/a/a3 → A3)
  const pathParts = pathname?.split('/') || []
  const roomId = pathParts[pathParts.length - 1]?.toUpperCase() || ''
  
  console.log('pathname:', pathname)
  console.log('roomId:', roomId)
  
  // 상태 관리
  const [currentImage, setCurrentImage] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [contents, setContents] = useState<RoomContent[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // 콘텐츠 가져오기 헬퍼 함수
  const getContent = (sectionName: string): RoomContent | undefined => {
    return contents.find(c => c.section_name === sectionName)
  }

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  // 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      console.log('=== fetchData 시작 ===');
      console.log('1. roomId:', roomId);
      
      if (!roomId) {
        console.log('  → roomId가 없어서 종료');
        return;
      }

      try {
        const upperRoomId = roomId.toUpperCase();
        const zone = upperRoomId[0].toLowerCase();
        
        console.log('2. 변환된 값들:');
        console.log('  - upperRoomId:', upperRoomId);
        console.log('  - zone:', zone);

        // 1. 개별 객실 데이터 조회
        console.log('3. 개별 객실 데이터 조회 시작');
        const { data: roomData, error: roomError } = await supabase
          .from('cube45_room_contents')
          .select('*')
          .eq('page_type', 'room')
          .eq('room_id', upperRoomId)
          .order('display_order')
        
        console.log('  - roomData 개수:', roomData?.length || 0);
        console.log('  - roomData:', roomData);
        if (roomError) console.log('  - roomError:', roomError);

        // 2. zone_default 데이터 조회
        console.log('4. zone_default 데이터 조회 시작');
        const { data: defaultData, error: defaultError } = await supabase
          .from('cube45_room_contents')
          .select('*')
          .eq('page_type', `zone_default_${zone}`)
          .order('display_order')
        
        console.log('  - defaultData 개수:', defaultData?.length || 0);
        console.log('  - defaultData:', defaultData);
        if (defaultError) console.log('  - defaultError:', defaultError);

        // 3. 데이터 병합
        console.log('5. 데이터 병합 시작');
        const mergedData: RoomContent[] = [];
        const addedSections = new Set();
        
        // 1. 먼저 모든 개별 객실 데이터를 추가
        roomData?.forEach(item => {
          mergedData.push(item);
          addedSections.add(item.section_name);
        });
        
        // 2. zone_default 데이터 중 개별 데이터에 없는 것만 추가
        defaultData?.forEach(item => {
          if (!addedSections.has(item.section_name)) {
            mergedData.push(item);
            addedSections.add(item.section_name);
          }
        });
        
        // display_order로 정렬
        mergedData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        
        console.log('  - 병합된 데이터 개수:', mergedData.length);
        console.log('  - mergedData:', mergedData);
        
        setContents(mergedData);

        // 갤러리 이미지 설정
        console.log('6. 갤러리 이미지 설정');
        const galleryImgs = [];
        for (let i = 1; i <= 5; i++) {
          const galleryContent = mergedData.find(c => c.section_name === `gallery_${i}`);
          if (galleryContent?.image_url) {
            galleryImgs.push(galleryContent.image_url);
          }
        }
        console.log('  - 갤러리 이미지 개수:', galleryImgs.length);
        setGalleryImages(galleryImgs.length > 0 ? galleryImgs : ['/images/room/aroom.jpg']);

      } catch (error) {
        console.error('=== fetchData 에러 발생 ===');
        console.error(error);
      } finally {
        console.log('=== 로딩 완료 ===');
        setLoading(false);
      }
    }

    fetchData();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  const upperRoomId = roomId?.toUpperCase()
  const zone = upperRoomId?.[0]

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
              src={getContent('banner')?.image_url || "/images/cube45/background2.jpg"}
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
        
        {/* Zone 텍스트 */}
        <div className="flex items-center py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="text-black max-w-2xl ml-64">
              <h1 className="text-7xl mb-4 whitespace-pre-line">{getContent('zone_text')?.content || `${zone}-Zone`}</h1>	
              <p className="text-3xl whitespace-pre-line">{getContent('hashtag')?.content || '#독채풀빌라 #실내or야외수영장 #애견동반불가'}</p>
            </div>
          </div>
        </div>
		  
        {/* 객실명 텍스트 */}
        <div className="flex items-center bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="text-black max-w-2xl ml-64">
              <h1 className="text-7xl whitespace-pre-line">{getContent('room_name')?.content || `${upperRoomId}호`}</h1>	
            </div>
          </div>
        </div> 
        
        {/* 이미지 슬라이더 섹션 */}
        <div className="py-10 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto relative">
              <div className="relative h-[450px] overflow-hidden">
                <Image
                  src={galleryImages[currentImage] || "/images/room/aroom.jpg"}
                  alt={`객실 이미지 ${currentImage + 1}`}
                  fill
                  quality={100}
                  className="object-cover"
                  sizes="100vw"
                />
                
                {/* 왼쪽 화살표 버튼 */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all"
                  aria-label="이전 이미지"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* 오른쪽 화살표 버튼 */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 transition-all"
                  aria-label="다음 이미지"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* 하단 인디케이터 (점) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                      aria-label={`이미지 ${index + 1}로 이동`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto">
              {/* 연결된 줄 */}
              <div className="mb-12">
                <div className="border-t border-gray-400"></div>
              </div>
        
              {/* 기본정보 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">기본정보</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="whitespace-pre-line">객실타입 : {getContent('basic_type')?.content || '독채 풀빌라 (마운틴뷰)'}</div>
                  <div className="whitespace-pre-line">객실구성 : {getContent('basic_room')?.content || '침대룸 2개 (더블사이즈 배드 2개), 화장실 2개'}</div>
                  <div className="whitespace-pre-line">객실크기 : {getContent('basic_size')?.content || '45평'}</div>
                  <div className="whitespace-pre-line">기준 / 최대인원 : {getContent('basic_capacity')?.content || '4명 / 8명 (기준인원 초과시 추가금 발생)'}</div>
                  <div className="whitespace-pre-line">수영장 : {getContent('basic_pool')?.content || '실내수영장 (가로 6M, 세로 4M, 수심 1.2M)'}</div>
                </div>
              </div>
        
              {/* 구분선 */}
              <div className="mb-12">
                <div className="border-t border-gray-400"></div>
              </div>
        
              {/* 어메니티 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">어메니티</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="whitespace-pre-line">{getContent('amenity_1')?.content || '침대, 취사시설, 냉장고, 전자레인지, 벽난로, 에어컨, 식탁, TV'}</div>
                  <div className="whitespace-pre-line">{getContent('amenity_2')?.content || '커피포트, 개별 바비큐, 실내 수영장, 헤어드라이어, 조리도구'}</div>
                </div>
              </div>
        
              {/* 이용안내 */}
              <div className="grid grid-cols-4 gap-4 mb-16">
                <div>
                  <h3 className="text-lg font-medium">이용안내</h3>
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="whitespace-pre-line">{getContent('guide_pet')?.content || '애견동반 : 불가능'}</div>
                  <div className="whitespace-pre-line">{getContent('guide_fireplace')?.content || '벽난로 이용가능기간: 12월~3월'}</div>
                  <div className="whitespace-pre-line">
                    {getContent('guide_additional')?.content || ''}
                  </div>
                </div>
              </div>		
        
              {/* 동별 바로가기 버튼들 */}
              <div className="flex flex-col items-center gap-8">
                {/* 첫째줄 - 해당 동 바로가기 (가운데) */}
                <div className="flex justify-center">
                  <a href={`/room/${zone?.toLowerCase()}`} className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      {zone}동 바로가기
                    </button>
                  </a>
                </div>
                
                {/* 둘째줄 - 나머지 동 바로가기 */}
                <div className="grid grid-cols-3 gap-12">
                  {['A', 'B', 'C', 'D']
                    .filter(z => z !== zone)
                    .map(z => (
                      <a key={z} href={`/room/${z.toLowerCase()}`} className="block">
                        <button 
                          className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#f5e6d3' }}
                        >
                          {z}동 바로가기
                        </button>
                      </a>
                    ))}
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