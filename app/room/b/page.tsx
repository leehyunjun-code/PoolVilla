'use client'
import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

// 인터페이스를 컴포넌트 외부로 이동
interface Room {
  id: string
  name: string
  zone: string
  type: string
  pool: string
  rooms: string | number
  bathrooms: string | number
  standard_capacity: string | number
  max_capacity: string | number
  area: string | number
  pet_friendly: string
  current_price: number
}

interface Summary {
  zone: string
  areaRange: string | number
  standardCapacityRange: string | number
  maxCapacityRange: string | number
  roomCount: number
}

export default function BZonePage() {
  // 이미지 슬라이더를 위한 상태 관리
  const [currentImage, setCurrentImage] = useState(0)
  const totalImages = 5
  // Supabase에서 B동 데이터 가져오기
  const [bRooms, setBRooms] = useState<Room[]>([])
  const [bSummary, setBSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }
  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

  // B동 데이터 조회
  useEffect(() => {
    const fetchBZoneData = async () => {
      try {
        const { data: rooms, error } = await supabase
          .from('cube45_rooms')
          .select('*')
          .eq('zone', 'B')

        if (error) throw error

        // 숫자 기준으로 정렬 (B9, B10, B11, B12 순서)
        const sortedRooms = rooms?.sort((a, b) => {
          const numA = parseInt(a.id.replace('B', ''))
          const numB = parseInt(b.id.replace('B', ''))
          return numA - numB
        }) || []

        setBRooms(sortedRooms)

        // 요약 정보 계산
        if (rooms && rooms.length > 0) {
          const areas = [...new Set(rooms.map(room => room.area))].sort()
          
          // 숫자 기준으로 정렬
          const standardCapacities = [...new Set(rooms.map(room => room.standard_capacity))]
            .sort((a, b) => parseInt(a) - parseInt(b))
          const maxCapacities = [...new Set(rooms.map(room => room.max_capacity))]
            .sort((a, b) => parseInt(a) - parseInt(b))

          setBSummary({
            zone: 'B',
            areaRange: areas.length === 1 ? areas[0] : `${areas[0]} ~ ${areas[areas.length - 1]}`,
            standardCapacityRange: standardCapacities.length === 1 ? standardCapacities[0] : `${standardCapacities[0]} ~ ${standardCapacities[standardCapacities.length - 1]}`,
            maxCapacityRange: maxCapacities.length === 1 ? maxCapacities[0] : `${maxCapacities[0]} ~ ${maxCapacities[maxCapacities.length - 1]}`,
            roomCount: rooms.length
          })
        }
      } catch (error) {
        console.error('B동 데이터 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBZoneData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
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
            
            {/* 하단 정보 바 */}
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(245, 230, 211, 0.6)' }}>
              <div className="container mx-auto px-8">
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-8">
                    <Link href="/room/pool" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      풀빌라옵션
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/room/a" className="text-xl text-black hover:text-gray-700 cursor-pointer">
                      A동
                    </Link>
                    <span className="text-black">|</span>
                    <Link href="/room/b" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
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

        {/* 이미지 슬라이더 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto relative">
              {/* 메인 이미지 - 크기 축소 */}
              <div className="relative h-[450px] overflow-hidden">
                <Image
                  src="/images/room/aroom.jpg"
                  alt={`B동 이미지 ${currentImage + 1}`}
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
                  {[...Array(totalImages)].map((_, index) => (
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

        {/* B동 정보 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-12">
                <p className="text-2xl text-black mb-2">CUBE45</p>
                <p className="text-2xl text-black mb-4">URBAN POOL STAY</p>
                <h1 className="text-6xl font-light mb-4">B-Zone</h1>
                {/* 중간이 끊긴 밑줄 */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-400"></div>
                  <div className="px-4"></div>
                  <div className="flex-1 border-t border-gray-400"></div>
                </div>
              </div>

              {/* B Zone Overview와 Information을 좌우로 배치 */}
              <div className="grid grid-cols-2 gap-16 mb-16">
                {/* 왼쪽 전체 영역 - B Zone Overview */}
                <div className="grid grid-cols-2 gap-8">
                  {/* 왼쪽 - 제목 */}
                  <div>
                    <h3 className="text-lg font-medium">B Zone</h3>
					<h3 className="text-lg font-medium">Overview</h3>  
                  </div>
                  {/* 오른쪽 - 내용 */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">객실크기</span><br />
                      <span>• {bSummary?.areaRange || '로딩중...'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">기준인원</span><br />
                      <span>• {bSummary?.standardCapacityRange || '로딩중...'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">최대인원</span><br />
                      <span>• {bSummary?.maxCapacityRange || '로딩중...'}</span>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 전체 영역 - Information */}
                <div className="grid grid-cols-2 gap-8">
                  {/* 왼쪽 - 제목 */}
                  <div>
                    <h3 className="text-lg font-medium">Information</h3>
                  </div>
                  {/* 오른쪽 - 내용 */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">체크인/체크아웃</span><br />
                      <span>• 체크인 15시/체크아웃 11시</span>
                    </div>
                    <div>
                      <span className="text-gray-600">애견동반</span><br />
                      <span>• {bRooms[0]?.pet_friendly === '불가' ? '불가능' : '가능'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">수영장</span><br />
                      <span>• 실내, 야외 수영장, 혹은 없음</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 객실 정보 표 */}
              <div className="mb-12 overflow-x-auto">
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
                    {bRooms.map((room) => (
                      <tr key={room.id}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.type}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.area}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.standard_capacity}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.max_capacity}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.rooms}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.bathrooms}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.fireplace}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.pool}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">{room.pet_friendly}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 객실 선택 버튼들 - 한 줄로 */}
              <div className="flex justify-center gap-12">
                {bRooms.map((room) => (
                  <a key={room.id} href={`/room/b/${room.id.toLowerCase()}`} className="block">
                    <button 
                      className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#f5e6d3' }}
                    >
                      {room.name}<br />
                      <span className="text-sm">풀빌라 독채</span>
                    </button>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}