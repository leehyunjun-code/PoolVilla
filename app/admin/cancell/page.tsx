'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

interface Reservation {
  id: string
  reservation_number: string
  room_id: string
  room_name: string
  check_in_date: string
  check_out_date: string
  nights: number
  booker_name: string
  booker_email: string
  booker_phone: string
  guest_name?: string
  guest_email?: string
  guest_phone?: string
  is_different_guest: boolean
  adult_count: number
  student_count: number
  child_count: number
  infant_count: number
  total_amount: number
  status: string
  created_at: string
  cancelled_at?: string
  cancelled_by?: string
  customer_request?: string	
}

export default function AdminCancell() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 30 // 페이지당 30개 고정
  
  // 검색 조건 상태들
  const [searchConditions, setSearchConditions] = useState({
    dateType: 'cancelled_at',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    keyword: '',
    sortOrder: 'desc'
  })

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  // 예약 데이터 조회
  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async (page = 1) => {
    setLoading(true)
    try {
      let query = supabase
        .from('cube45_reservations')
        .select('*', { count: 'exact' })
        .eq('status', 'cancelled') // 취소된 예약만 조회
      
      // 날짜 필터 적용
      if (searchConditions.startDate && searchConditions.endDate) {
        if (searchConditions.dateType === 'cancelled_at') {
          query = query
            .gte('cancelled_at', `${searchConditions.startDate}T00:00:00`)
            .lte('cancelled_at', `${searchConditions.endDate}T23:59:59`)
        } else if (searchConditions.dateType === 'created_at') {
          query = query
            .gte('created_at', `${searchConditions.startDate}T00:00:00`)
            .lte('created_at', `${searchConditions.endDate}T23:59:59`)
        } else if (searchConditions.dateType === 'check_in_date') {
          query = query
            .gte('check_in_date', searchConditions.startDate)
            .lte('check_in_date', searchConditions.endDate)
        } else if (searchConditions.dateType === 'check_out_date') {
          query = query
            .gte('check_out_date', searchConditions.startDate)
            .lte('check_out_date', searchConditions.endDate)
        }
      }
      
      // 통합 키워드 검색
      if (searchConditions.keyword) {
        query = query.or(`booker_name.ilike.%${searchConditions.keyword}%,guest_name.ilike.%${searchConditions.keyword}%,booker_phone.ilike.%${searchConditions.keyword}%,guest_phone.ilike.%${searchConditions.keyword}%,booker_email.ilike.%${searchConditions.keyword}%,guest_email.ilike.%${searchConditions.keyword}%,reservation_number.ilike.%${searchConditions.keyword}%`)
      }
      
      // 페이지네이션 적용
      const from = (page - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      
      // 정렬 및 페이지네이션
      query = query
        .order(searchConditions.dateType === 'cancelled_at' ? 'cancelled_at' : searchConditions.dateType, 
               { ascending: searchConditions.sortOrder === 'asc' })
        .range(from, to)
      
      const { data, error, count } = await query
      
      if (error) {
        console.error('Supabase 에러:', error)
        throw error
      }
      
      console.log('조회된 취소 예약 데이터:', data)
      setReservations(data || [])
      setTotalCount(count || 0)
      setCurrentPage(page)
      
    } catch (error) {
      console.error('취소 예약 데이터 조회 실패:', error)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (field: string, value: string | number) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    fetchReservations(1) // 검색 시 1페이지로 리셋
  }

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string; class: string }> = {
      'confirmed': { text: '예약완료', class: 'text-blue-600 bg-blue-100' },
      'cancelled': { text: '취소', class: 'text-red-600 bg-red-100' },
      'pending': { text: '예약접수', class: 'text-yellow-600 bg-yellow-100' }
    }
    return statusMap[status] || { text: '알수없음', class: 'text-gray-600 bg-gray-100' }
  }

  const getCancelledByDisplay = (cancelledBy?: string) => {
    if (!cancelledBy) return { text: '알수없음', class: 'text-gray-600 bg-gray-100' }
    
    const displayMap: Record<string, { text: string; class: string }> = {
      '관리자': { text: '관리자 취소', class: 'text-purple-600 bg-purple-100' },
      '사용자': { text: '사용자 취소', class: 'text-orange-600 bg-orange-100' }
    }
    
    return displayMap[cancelledBy] || { text: cancelledBy, class: 'text-gray-600 bg-gray-100' }
  }

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

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  
  // 엑셀 다운로드용 데이터 포맷팅
  const formatDataForExcel = (data: Reservation[]) => {
    return data.map((reservation, index) => ({
      'No': data.length - index,
      '예약상태': '취소',
      '예약일자': formatDateTime(reservation.created_at),
      '취소일자': formatDateTime(reservation.cancelled_at),
      '예약번호': reservation.reservation_number,
      '예약자명': reservation.booker_name,
      '예약자전화': reservation.booker_phone,
      '예약자이메일': reservation.booker_email,
      '투숙자명': reservation.is_different_guest ? reservation.guest_name : reservation.booker_name,
      '투숙자전화': reservation.is_different_guest ? reservation.guest_phone : reservation.booker_phone,
      '투숙자이메일': reservation.is_different_guest ? reservation.guest_email : reservation.booker_email,
      '입실일': reservation.check_in_date,
      '퇴실일': reservation.check_out_date,
      '박수': reservation.nights,
      '객실': reservation.room_name || reservation.room_id,
      '성인': reservation.adult_count || 0,
      '학생': reservation.student_count || 0,
      '아동': reservation.child_count || 0,
      '유아': reservation.infant_count || 0,
      '총인원': (reservation.adult_count || 0) + (reservation.student_count || 0) + (reservation.child_count || 0) + (reservation.infant_count || 0),
      '금액': reservation.total_amount,
      '취소구분': reservation.cancelled_by === '관리자' ? '관리자 취소' : 
                 reservation.cancelled_by === '사용자' ? '사용자 취소' : '알수없음'
    }))
  }

  // 현재 페이지 엑셀 다운로드
  const downloadCurrentPageExcel = () => {
    const excelData = formatDataForExcel(reservations)
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '취소목록')
    
    // 파일명 생성
    const today = new Date().toISOString().split('T')[0]
    const fileName = `취소관리_${today}.xlsx`
    
    XLSX.writeFile(wb, fileName)
    
    alert(`현재 페이지 ${reservations.length}건의 데이터를 다운로드했습니다.`)
  }

  // 전체 데이터 엑셀 다운로드
  const downloadAllDataExcel = async () => {
    try {
      // 전체 데이터 조회 (limit 없이)
      let query = supabase
        .from('cube45_reservations')
        .select('*')
        .eq('status', 'cancelled') // 취소된 것만
      
      // 현재 적용된 필터 그대로 적용
      if (searchConditions.startDate && searchConditions.endDate) {
        if (searchConditions.dateType === 'cancelled_at') {
          query = query
            .gte('cancelled_at', `${searchConditions.startDate}T00:00:00`)
            .lte('cancelled_at', `${searchConditions.endDate}T23:59:59`)
        } else if (searchConditions.dateType === 'created_at') {
          query = query
            .gte('created_at', `${searchConditions.startDate}T00:00:00`)
            .lte('created_at', `${searchConditions.endDate}T23:59:59`)
        } else if (searchConditions.dateType === 'check_in_date') {
          query = query
            .gte('check_in_date', searchConditions.startDate)
            .lte('check_in_date', searchConditions.endDate)
        } else if (searchConditions.dateType === 'check_out_date') {
          query = query
            .gte('check_out_date', searchConditions.startDate)
            .lte('check_out_date', searchConditions.endDate)
        }
      }
      
      if (searchConditions.keyword) {
        query = query.or(`booker_name.ilike.%${searchConditions.keyword}%,guest_name.ilike.%${searchConditions.keyword}%,booker_phone.ilike.%${searchConditions.keyword}%,guest_phone.ilike.%${searchConditions.keyword}%,booker_email.ilike.%${searchConditions.keyword}%,guest_email.ilike.%${searchConditions.keyword}%,reservation_number.ilike.%${searchConditions.keyword}%`)
      }
      
      query = query.order(searchConditions.dateType === 'cancelled_at' ? 'cancelled_at' : searchConditions.dateType, 
                          { ascending: searchConditions.sortOrder === 'asc' })
      
      const { data, error } = await query
      
      if (error) throw error
      
      const excelData = formatDataForExcel(data || [])
      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, '취소목록')
      
      // 파일명 생성
      const today = new Date().toISOString().split('T')[0]
      const fileName = `취소관리_${today}_전체.xlsx`
      
      XLSX.writeFile(wb, fileName)
      
      alert(`전체 ${data?.length || 0}건의 데이터를 다운로드했습니다.`)
      
    } catch (error) {
      console.error('전체 데이터 다운로드 실패:', error)
      alert('다운로드에 실패했습니다.')
    }
  }

  const formatDateOnly = (dateString: string | null | undefined) => {
    if (!dateString) return '-'
    return dateString
  }

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const maxPageButtons = 10
    const currentGroup = Math.floor((currentPage - 1) / maxPageButtons)
    const startPage = currentGroup * maxPageButtons + 1
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages)

    return (
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          onClick={() => fetchReservations(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          처음
        </button>
        <button
          onClick={() => fetchReservations(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          이전
        </button>
        
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
          <button
            key={page}
            onClick={() => fetchReservations(page)}
            className={`px-3 py-1 border rounded text-sm ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => fetchReservations(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          다음
        </button>
        <button
          onClick={() => fetchReservations(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          마지막
        </button>
        
        <span className="text-sm text-gray-600 ml-4">
          총 {totalCount}건 | {currentPage} / {totalPages} 페이지
        </span>
      </div>
    )
  }

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
              <a href="/admin/reservation" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                예약관리
              </a>
            </li>
            <li>
              <a href="/admin/cancell" className="flex items-center p-3 text-blue-600 bg-blue-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                취소관리
              </a>
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

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="max-w-8xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              취소관리
            </h1>
          </div>

          {/* 검색 폼 */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            {/* 첫 번째 줄 - 날짜 검색 */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* 날짜 조건 */}
              <div className="col-span-5">
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-3 min-h-[40px] border border-gray-300 rounded text-sm"
                    value={searchConditions.dateType}
                    onChange={(e) => handleSearchChange('dateType', e.target.value)}
                  >
                    <option value="cancelled_at">취소일</option>
                    <option value="created_at">예약일</option>
                    <option value="check_in_date">입실일</option>
                    <option value="check_out_date">퇴실일</option>
                  </select>
                  <input 
                    type="date" 
                    className="px-3 py-3 min-h-[40px] border border-gray-300 rounded text-sm"
                    value={searchConditions.startDate}
                    onChange={(e) => handleSearchChange('startDate', e.target.value)}
                  />
                  <span className="flex items-center text-gray-500">~</span>
                  <input 
                    type="date" 
                    className="px-3 py-3 min-h-[40px] border border-gray-300 rounded text-sm"
                    value={searchConditions.endDate}
                    onChange={(e) => handleSearchChange('endDate', e.target.value)}
                  />
                  <select 
                    className="px-3 py-3 min-h-[40px] border border-gray-300 rounded text-sm"
                    value={searchConditions.sortOrder}
                    onChange={(e) => handleSearchChange('sortOrder', e.target.value)}
                  >
                    <option value="desc">최신순</option>
                    <option value="asc">오래된순</option>
                  </select>
                </div>
              </div>
              
              {/* 키워드 검색 + 검색 버튼 + 엑셀 다운로드 */}
              <div className="col-span-5">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-3 min-h-[40px] border border-gray-300 rounded text-sm placeholder-gray-500"
                    placeholder="통합검색(이름,전화번호,이메일,예약번호)"
                    value={searchConditions.keyword}
                    onChange={(e) => handleSearchChange('keyword', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-6 py-3 min-h-[40px] bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    검색
                  </button>
                  <div className="relative group">
                    <button className="px-4 py-3 min-h-[40px] bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      엑셀다운로드
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button 
                        onClick={downloadCurrentPageExcel}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 whitespace-nowrap"
                      >
                        현재 페이지 다운로드
                      </button>
                      <button 
                        onClick={downloadAllDataExcel}
                        className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 whitespace-nowrap"
                      >
                        전체 데이터 다운로드
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 빈 공간 */}
              <div className="col-span-2"></div>
            </div>
          </div>

          {/* 취소 목록 테이블 */}
          <div className="bg-white border border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">No</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약상태</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약일자</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">취소일자</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약번호</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약자 정보</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">투숙자 정보</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium break-keep">입실일, 퇴실일, 박수</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">객실</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">인원</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">금액</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">취소구분</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-xs">로딩 중...</span>
                      </div>
                    </td>
                  </tr>
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="border border-gray-300 px-4 py-8 text-center text-gray-500 text-xs">
                      조회된 취소 예약이 없습니다.
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation, index) => {
                    const statusInfo = getStatusDisplay(reservation.status)
                    const cancelInfo = getCancelledByDisplay(reservation.cancelled_by)
                    const totalGuests = (reservation.adult_count || 0) + (reservation.student_count || 0) + 
                                       (reservation.child_count || 0) + (reservation.infant_count || 0)
                    
                    // 투숙자 정보 결정
                    const guestInfo = reservation.is_different_guest ? {
                      name: reservation.guest_name || '-',
                      phone: reservation.guest_phone || '-',
                      email: reservation.guest_email || '-'
                    } : {
                      name: reservation.booker_name || '-',
                      phone: reservation.booker_phone || '-', 
                      email: reservation.booker_email || '-'
                    }
                    
                    return (
                      <tr key={reservation.id}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{reservations.length - index}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">
                          <span className={`font-bold px-3 py-2 rounded ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{formatDateTime(reservation.created_at)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{formatDateTime(reservation.cancelled_at)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">{reservation.reservation_number}</td>
                        <td className="border border-gray-300 px-2 py-3 text-center text-xs">
                          <div className="space-y-1">
                            <div>{reservation.booker_name || '-'}</div>
                            <div>{reservation.booker_phone || '-'}</div>
                            <div>{reservation.booker_email || '-'}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-center text-xs">
                          <div className="space-y-1">
                            <div>{guestInfo.name}</div>
                            <div>{guestInfo.phone}</div>
                            <div>{guestInfo.email}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">
                          <div className="space-y-1">
                            <div>{formatDateOnly(reservation.check_in_date)} ~ {formatDateOnly(reservation.check_out_date)}</div>
                            <div className="text-gray-600">{reservation.nights}박</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{reservation.room_name || reservation.room_id || '-'}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{totalGuests}명</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{reservation.total_amount?.toLocaleString() || 0}원</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">
                          <span className={`font-bold px-3 py-2 rounded ${cancelInfo.class}`}>
                            {cancelInfo.text}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {!loading && totalCount > 0 && <Pagination />}

          {/* 하단 정보 */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              취소 안내
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">취소 구분</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs mr-2">관리자 취소</span>
                    관리자가 직접 취소한 예약입니다.
                  </li>
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs mr-2">사용자 취소</span>
                    고객이 직접 취소한 예약입니다.
                  </li>
                  <li className="text-xs text-gray-600">
                    * 취소 구분이 없는 경우 '알수없음'으로 표시됩니다.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">검색 조건</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="font-semibold text-xs mr-2">취소일:</span>
                    예약이 취소된 날짜로 검색
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-xs mr-2">예약일:</span>
                    최초 예약 접수 날짜로 검색
                  </li>
                  <li className="flex items-center">
                    <span className="font-semibold text-xs mr-2">입/퇴실일:</span>
                    예정되었던 숙박 날짜로 검색
                  </li>
                  <li className="text-xs text-gray-600">
                    * 통합검색으로 예약자 정보를 검색할 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}