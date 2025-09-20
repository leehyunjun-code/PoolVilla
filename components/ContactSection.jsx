'use client'
import { useEffect, useRef } from 'react'

export default function ContactSection() {
  const mapRef = useRef(null)
  
  // 카카오맵 API 키
  const KAKAO_MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || 'ecb6f0ad15a6499e8c0e12c06aa3d04a'
  
  // 카카오맵 초기화
  useEffect(() => {
    // 카카오맵 스크립트 동적 로드
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`
    script.async = true
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return
        
        // 지도 옵션
        const options = {
          center: new window.kakao.maps.LatLng(37.597520, 127.537014), // 큐브45 실제 좌표
          level: 3
        }
        
        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, options)
        
        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(37.597520, 127.537014)
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        })
        marker.setMap(map)
        
        // 인포윈도우 생성
        const iwContent = '<div style="padding:10px;">CUBE45<br>경기도 가평군 설악면 국수터길 13-1</div>'
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent
        })
        
        // 마커 클릭시 인포윈도우 표시
        window.kakao.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker)
        })
      })
    }
    
    document.head.appendChild(script)
    
    // 클린업
    return () => {
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])
  
  // 카카오맵 앱으로 이동
  const openKakaoMap = () => {
    window.open('https://map.kakao.com/link/map/CUBE45,37.597520,127.537014', '_blank')
  }
  
  // 네이버맵 앱으로 이동
  const openNaverMap = () => {
    window.open('https://map.naver.com/v5/search/경기도 가평군 설악면 국수터길 13-1', '_blank')
  }
  
  return (
    <div className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center text-black mb-12">CONTACT US</h2>
      
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row px-4 md:px-8 gap-6 md:gap-10">
        {/* 왼쪽 정보 영역 - 이미지와 버튼 */}
        <div className="w-full md:w-[45%] bg-white">
          {/* 이미지 - 원본 크기대로 */}
          <img 
            src="/images/main/contact.jpg"
            alt="CUBE45 x LX22 Contact Information"
            className="w-full object-contain"
          />
          
          {/* 버튼 컨테이너 - 이미지 아래 배치, 간격 추가 */}
          <div className="flex justify-center md:justify-start gap-4 pt-6 pb-4 bg-white">
            <button 
              onClick={openKakaoMap}
              className="bg-[#0084FF] text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold hover:bg-[#0074E4] transition-all hover:shadow-lg rounded-full flex items-center gap-1 md:gap-2"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 384 512">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
              </svg>
              카카오맵 바로가기
            </button>
            <button 
              onClick={openNaverMap}
              className="bg-[#03C75A] text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold hover:bg-[#02B350] transition-all hover:shadow-lg rounded-full flex items-center gap-1 md:gap-2"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 384 512">
                <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
              </svg>
              네이버지도 바로가기
            </button>
          </div>
        </div>
        
        {/* 오른쪽 지도 영역 - 크기 줄이고 간격 추가 */}
        <div className="w-full md:w-[55%] h-[350px] md:h-[500px]">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
      
      {/* 모바일 스타일 */}
      <style jsx>{`
        @media (max-width: 768px) {
          button {
            padding: 10px 18px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}