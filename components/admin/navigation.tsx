'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AdminNavigation() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const weekdays = ['일', '월', '화', '수', '목', '금', '토']
    const weekday = weekdays[date.getDay()]
    return `${month}.${day}(${weekday})`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <aside className="w-48 bg-white shadow-lg">
      <div className="p-4">
        <div className="text-lg font-bold text-gray-800 mb-8">관리자</div>
        
        {/* 메뉴 목록 */}
        <ul className="space-y-2">
          <li>
            <a 
              href="/admin/dashboard" 
              className={`flex items-center p-3 rounded ${
                isActive('/admin/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              대시보드
            </a>
            {/* 대시보드 하위 메뉴 - 항상 표시 */}
            <ul className="ml-8 mt-2 space-y-1">
              <li>
                <a 
                  href="/admin/dashboard/price-detail" 
                  className={`flex items-center p-2 text-sm rounded ${
                    pathname === '/admin/dashboard/price-detail'
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">•</span>
                  상세요금관리
                </a>
              </li>
              <li>
                <a 
                  href="/admin/dashboard/daily-sales" 
                  className={`flex items-center p-2 text-sm rounded ${
                    pathname === '/admin/dashboard/daily-sales'
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">•</span>
                  일일매출현황
                </a>
              </li>
              <li>
                <a 
                  href="/admin/dashboard/property-report" 
                  className={`flex items-center p-2 text-sm rounded ${
                    pathname === '/admin/dashboard/property-report'
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">•</span>
                  숙소리포트
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a 
              href="/admin/reservation" 
              className={`flex items-center p-3 rounded ${
                isActive('/admin/reservation') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              예약관리
            </a>
          </li>
          <li>
            <a 
              href="/admin/cancell" 
              className={`flex items-center p-3 rounded ${
                isActive('/admin/cancell') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              취소관리
            </a>
          </li>
          <li>
            <a 
              href="/admin/content-manage" 
              className={`flex items-center p-3 rounded ${
                isActive('/admin/content-manage') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              메인 관리
            </a>
            {/* 메인페이지 관리 하위 메뉴 */}
            <ul className="ml-8 mt-2 space-y-1">
              <li>
                <a 
                  href="/admin/content-manage/intro" 
                  className={`flex items-center p-2 text-sm rounded ${
                    pathname === '/admin/content-manage/intro'
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">•</span>
                  CUBE 45 관리
                </a>
              </li>
              <li>
                <a 
                  href="/admin/content-manage/various" 
                  className={`flex items-center p-2 text-sm rounded ${
                    pathname === '/admin/content-manage/various'
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">•</span>
                  <span>
                    부대시설,<br/>
                    이용안내,<br/>
                    스페셜오퍼 관리
                  </span>
                </a>
              </li>	
            </ul>
          </li>
        </ul>

        {/* 시계 */}
        <div className="mt-auto pt-8">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">{mounted ? formatDate(currentTime) : '--.--(-)' }</p>
            <p className="text-lg font-bold text-gray-800">{mounted ? formatTime(currentTime) : '--:--'}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}