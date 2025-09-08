'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  const [hoveredMenu, setHoveredMenu] = useState(null)
  
  const menuItems = {
    'CUBE 45': ['CUBE 45', '배치도', '관광정보'],
    '독채객실': ['풀빌라옵션','A동','B동', 'C동', 'D동'],
    '부대시설': [],
    '이용안내': [],
    '스페셜 오퍼': [],
    '실시간예약': [],
    '예약확인': []
  }
  
  // 서브메뉴 링크 매핑
  const subMenuLinks = {
    'CUBE 45': {
      'CUBE 45': '/intro',
      '배치도': '/location',
      '관광정보': '/tour'
    },
    '독채객실': { 
	  '풀빌라옵션': '/room/pool', 	
	  'A동': '/room/a',	
      'B동': '/room/b',
      'C동': '/room/c',
      'D동': '/room/d'
    }
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 상단 로고 영역 */}
      <div style={{ backgroundColor: '#f5e6d3' }}>
        <div className="text-center">
          <Link href="/">
            <div className="cursor-pointer flex justify-center items-center">
              <Image 
                src="/images/main/logo.jpg"
                alt="THE SHILLA SEOUL"
                width={200}
                height={80}
                priority
                className="object-contain"
              />
            </div>
          </Link>
        </div>
      </div>
      
      {/* 네비게이션 */}
      <nav style={{ backgroundColor: '#7d6f5d' }} className="text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-14">
            <ul className="flex items-stretch space-x-12">
              {Object.keys(menuItems).map((menu) => (
                <li 
                  key={menu}
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredMenu(menu)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {menu === '실시간예약' ? (
                    <Link href="/reservation">
                      <span className="cursor-pointer text-white px-6 flex items-center text-lg font-medium h-14" style={{ backgroundColor: '#3E2B2C' }}>
                        {menu}
                      </span>
                    </Link>
                  ) : menu === '예약확인' ? (
                    <Link href="/comfirm">
                      <span className="cursor-pointer hover:text-gray-200 flex items-center text-lg font-medium h-14">
                        {menu}
                      </span>
                    </Link>
                  ) : menu === '부대시설' ? (
                    <Link href="/facilities">
                      <span className="cursor-pointer hover:text-gray-200 flex items-center text-lg font-medium h-14">
                        {menu}
                      </span>
                    </Link>
                  ) : menu === '스페셜 오퍼' ? (
                    <Link href="/special">
                      <span className="cursor-pointer hover:text-gray-200 flex items-center text-lg font-medium h-14">
                        {menu}
                      </span>
                    </Link>
                  ) : menu === '이용안내' ? (
                    <Link href="/guide">
                      <span className="cursor-pointer hover:text-gray-200 flex items-center text-lg font-medium h-14">
                        {menu}
                      </span>
                    </Link>
                  ) : menu === 'CUBE 45' ? (
                    <span className="cursor-default flex items-center text-lg font-medium h-14">
                      {menu}
                    </span>
                  ) : (
                    <span className="cursor-pointer hover:text-gray-200 flex items-center text-lg font-medium h-14">
                      {menu}
                    </span>
                  )}
                  
                  {menuItems[menu].length > 0 && hoveredMenu === menu && (
                    <ul className="absolute top-full left-0 bg-white shadow-lg min-w-[150px] z-50">
                      {menuItems[menu].map((sub) => (
                        <li key={sub}>
                          <Link href={subMenuLinks[menu]?.[sub] || '#'}>
                            <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm">
                              {sub}
                            </span>
                          </Link>
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
    </div>
  )
}