'use client'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function LocationPage() {
  // 이미지 슬라이더를 위한 상태 관리
  const [currentImage, setCurrentImage] = useState(0)
  const totalImages = 5

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1))
  }

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1))
  }

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
                    <Link href="/room/pool" className="text-xl text-black hover:text-gray-700 cursor-pointer">
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
                    <Link href="/room/d" className="text-xl text-black hover:text-gray-700 cursor-pointer font-bold">
                      D동
                    </Link>  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 슬라이더 섹션 */}
        <div className="py-20">
          <div className="container mx-auto px-8">
            <div className="max-w-5xl mx-auto relative">
              {/* 메인 이미지 */}
              <div className="relative h-[350px] overflow-hidden">
                <Image
                  src="/images/room/aroom.jpg"
                  alt={`D동 이미지 ${currentImage + 1}`}
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

        {/* D동 정보 섹션 */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-12">
                <p className="text-2xl text-black mb-2">CUBE45</p>
                <p className="text-2xl text-black mb-4">URBAN POOL STAY</p>
                <h1 className="text-6xl font-light mb-4">D-Zone</h1>
                {/* 중간이 끊긴 밑줄 */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-400"></div>
                  <div className="px-4"></div>
                  <div className="flex-1 border-t border-gray-400"></div>
                </div>
              </div>

              {/* D Zone Overview와 Information을 좌우로 배치 */}
              <div className="grid grid-cols-2 gap-16 mb-16">
                {/* 왼쪽 전체 영역 - D Zone Overview */}
                <div className="grid grid-cols-2 gap-8">
                  {/* 왼쪽 - 제목 */}
                  <div>
                    <h3 className="text-lg font-medium">D Zone</h3>
                    <h3 className="text-lg font-medium">Overview</h3>  
                  </div>
                  {/* 오른쪽 - 내용 */}
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">객실크기</span><br />
                      <span>• 23평</span>
                    </div>
                    <div>
                      <span className="text-gray-600">기준인원</span><br />
                      <span>• 2명</span>
                    </div>
                    <div>
                      <span className="text-gray-600">최대인원</span><br />
                      <span>• 4명</span>
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
                      <span>• 가능</span>
                    </div>
                    <div>
                      <span className="text-gray-600">수영장</span><br />
                      <span>• 실내수영장</span>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D1호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D2호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D3호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D4호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D5호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D6호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D7호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D8호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D9호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D10호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D11호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D12호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D13호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D14호</td>
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
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-center text-sm">D15호</td>
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
                  </tbody>
                </table>
              </div>

              {/* 객실 선택 버튼들 - 5줄 x 3개 배치 */}
              <div className="flex justify-center">
                <div className="inline-flex flex-col items-center gap-8">
                  {/* 첫 번째 줄 - 3개 버튼 */}
                  <div className="flex gap-12">
                    <a href="/room/d/d1" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D1호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d2" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D2호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d3" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D3호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                  </div>
                  
                  {/* 두 번째 줄 - 3개 버튼 */}
                  <div className="flex gap-12">
                    <a href="/room/d/d4" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D4호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d5" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D5호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d6" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D6호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                  </div>
              
                  {/* 세 번째 줄 - 3개 버튼 */}
                  <div className="flex gap-12">
                    <a href="/room/d/d7" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D7호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d8" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D8호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d9" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D9호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                  </div>
              
                  {/* 네 번째 줄 - 3개 버튼 */}
                  <div className="flex gap-12">
                    <a href="/room/d/d10" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D10호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d11" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D11호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d12" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D12호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                  </div>
              
                  {/* 다섯 번째 줄 - 3개 버튼 */}
                  <div className="flex gap-12">
                    <a href="/room/d/d13" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D13호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d14" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D14호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
                    <a href="/room/d/d15" className="block">
                      <button 
                        className="px-16 py-6 rounded-full text-gray-800 hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#f5e6d3' }}
                      >
                        D15호<br />
                        <span className="text-sm">풀빌라 독채</span>
                      </button>
                    </a>
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