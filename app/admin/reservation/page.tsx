'use client'

import { useState, useEffect } from 'react'

export default function AdminReservationPage() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 예약 데이터 로드 로직을 추후 추가
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드 메뉴 */}
      <aside className="w-48 bg-white shadow-lg">
        <div className="p-4">
          <div className="text-lg font-bold text-gray-800 mb-8">관리자</div>
          
          {/* 메뉴 목록 */}
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                대시보드
              </a>
            </li>
            <li>
              <a href="/admin/reservation" className="flex items-center p-3 text-blue-600 bg-blue-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                예약관리
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">예약 관리</h1>
          
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">로딩 중...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">예약 관리 기능을 준비 중입니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}