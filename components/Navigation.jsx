'use client'
import { useState } from 'react'

export default function Navigation() {
  const [hoveredMenu, setHoveredMenu] = useState(null)
  
  const menuItems = {
    'CUBE 45': ['소개', '배치도', '관광정보'],
    '독채객실': ['B동', 'C동', 'D동'],
    '부대시설': ['POOL', 'BBQ', 'CAFE', 'RESTAURANT'],
    '갤러리': [],
    '스페셜 오퍼': [],
    '실시간예약': []
  }

  return (
    <>
      {/* 상단 로고 영역 */}
      <div style={{ backgroundColor: '#f5e6d3', padding: '20px 0' }}>
        <div className="text-center">
          <h1 className="text-2xl font-serif text-gray-800">THE SHILLA</h1>
          <p className="text-sm text-gray-600">SEOUL</p>
        </div>
      </div>
      
      {/* 네비게이션 */}
      <nav style={{ backgroundColor: '#7d6f5d' }} className="text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-14">
            <ul className="flex space-x-16">
              {Object.keys(menuItems).map((menu) => (
                <li 
                  key={menu}
                  className="relative"
                  onMouseEnter={() => setHoveredMenu(menu)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <span className="cursor-pointer hover:text-gray-200 py-5 block text-lg font-medium">
                    {menu}
                  </span>
                  
                  {menuItems[menu].length > 0 && hoveredMenu === menu && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg min-w-[150px] z-50">
                      {menuItems[menu].map((sub) => (
                        <li key={sub}>
                          <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm">
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}