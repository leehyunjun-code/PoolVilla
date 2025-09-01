import { Instagram, BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer>
      {/* 상단 섹션 */}
      <div style={{ backgroundColor: '#8B7355' }} className="text-white py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center gap-12">
            {/* 왼쪽 로고 */}
            <h2 className="text-4xl font-bold">CUBE45 logo</h2>
            
            {/* 오른쪽 영역 */}
            <div>
              {/* 메뉴 */}
              <div className="flex gap-10 text-sm mb-3">
                <span className="cursor-pointer hover:text-gray-200">CUBE 45</span>
                <span className="cursor-pointer hover:text-gray-200">Pool Villa</span>
                <span className="cursor-pointer hover:text-gray-200">Facility</span>
                <span className="cursor-pointer hover:text-gray-200">Gallery</span>
                <span className="cursor-pointer hover:text-gray-200">Special Offers</span>
                <span className="cursor-pointer hover:text-gray-200">Reservation</span>
              </div>
              {/* 주소 정보 */}
              <div className="text-xs text-gray-200">
                <p>경기도 가평군 설악면 꽃수터길 13-1</p>
                <p>사업자번호 : 301-37-28829 | 대표자 : 박만</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 섹션 */}
      <div style={{ backgroundColor: '#4A3F36' }} className="text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-center gap-12">
            {/* 왼쪽 BRANDFORUM 이미지 */}
            <img 
              src="/images/main/BRANDFORUM.jpg" 
              alt="BRANDFORUM" 
              className="h-12 w-auto"
            />
            
            {/* 중간 정보 */}
            <div>
              <div className="mb-3"></div>
              <div className="text-xs text-white pl-30">
                <p>온라인위탁사 : 주식회사 브랜드포럼 | 대표번호 : 02-338-1316</p>
                <p>통신판매업신고증 : 2024-서울강서-0865</p>
                <p>COPYRIGHT 2025 BRANDFORUM INC. All Right Reserved</p>
              </div>
            </div>
            
            {/* 오른쪽 SNS 아이콘 박스 */}
            <div 
              className="flex gap-4 p-4"
              style={{ backgroundColor: '#F1EBD6' }}
            >
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram size={22} className="text-gray-700" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <BookOpen size={22} className="text-gray-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}