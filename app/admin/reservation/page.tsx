'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminReservation() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkStatus, setCheckStatus] = useState({}) // 체크인/체크아웃 상태 관리
  
  // 검색 조건 상태들
  const [searchConditions, setSearchConditions] = useState({
    dateType: 'created_at', // 기본 예약일
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30일 전
    endDate: new Date().toISOString().split('T')[0], // 오늘
    keyword: '',
    searchField: 'booker_name', // 예약자명
    bookingStatus: '', // 예약상태
    paymentType: '', // 결제구분
    limit: 50
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

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cube45_reservations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(searchConditions.limit)

      if (error) {
        console.error('Supabase 에러:', error)
        throw error
      }
      
      console.log('조회된 예약 데이터:', data)
      setReservations(data || [])
      
      // 기존 체크인/체크아웃 상태 로드
      const initialCheckStatus = {}
      data?.forEach(reservation => {
        initialCheckStatus[`${reservation.id}_checkin`] = reservation.check_in_status || false
        initialCheckStatus[`${reservation.id}_checkout`] = reservation.check_out_status || false
      })
      setCheckStatus(initialCheckStatus)
    } catch (error) {
      console.error('예약 데이터 조회 실패:', error)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (field, value) => {
    setSearchConditions(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    fetchReservations()
  }

  // 체크인/체크아웃 상태 변경 함수
  const toggleCheckStatus = async (reservationId, type) => {
    const currentStatus = checkStatus[`${reservationId}_${type}`]
    const newStatus = !currentStatus
    
    // 상태에 따른 메시지 생성
    const getConfirmMessage = (type, newStatus) => {
      if (type === 'checkin') {
        return newStatus ? '체크인을 입장 상태로 바꾸겠습니까?' : '체크인을 미입장 상태로 바꾸겠습니까?'
      } else {
        return newStatus ? '체크아웃을 퇴실 상태로 바꾸겠습니까?' : '체크아웃을 미퇴실 상태로 바꾸겠습니까?'
      }
    }
    
    const getSuccessMessage = (type, newStatus) => {
      if (type === 'checkin') {
        return newStatus ? '체크인이 입장 상태로 변경되었습니다.' : '체크인이 미입장 상태로 변경되었습니다.'
      } else {
        return newStatus ? '체크아웃이 퇴실 상태로 변경되었습니다.' : '체크아웃이 미퇴실 상태로 변경되었습니다.'
      }
    }

    // 확인 메시지 표시
    const confirmMessage = getConfirmMessage(type, newStatus)
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      // 현재 시간 생성
      const now = new Date()

      // Supabase 업데이트
      const updateData = {}
      if (type === 'checkin') {
        updateData.check_in_status = newStatus
        updateData.check_in_time = newStatus ? now.toISOString() : null
      } else {
        updateData.check_out_status = newStatus
        updateData.check_out_time = newStatus ? now.toISOString() : null
      }

      const { error } = await supabase
        .from('cube45_reservations')
        .update(updateData)
        .eq('id', reservationId)

      if (error) throw error

      // 로컬 상태 업데이트
      setCheckStatus(prev => ({
        ...prev,
        [`${reservationId}_${type}`]: newStatus
      }))

      // 예약 데이터 다시 조회하여 시간 정보 업데이트
      await fetchReservations()

      // 성공 메시지 표시
      const successMessage = getSuccessMessage(type, newStatus)
      alert(successMessage)

    } catch (error) {
      console.error('체크 상태 업데이트 실패:', error)
      alert('상태 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      'confirmed': { text: '예약완료', class: 'text-blue-600 bg-blue-100' },
      'cancelled': { text: '취소완료', class: 'text-red-600 bg-red-100' },
      'pending': { text: '예약접수', class: 'text-yellow-600 bg-yellow-100' }
    }
    return statusMap[status] || { text: '알수없음', class: 'text-gray-600 bg-gray-100' }
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

  const formatDateTime = (dateString) => {
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

  const formatTimeSimple = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${year}.${month}.${day}. ${hours}:${minutes}:${seconds}`
  }

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-'
    return dateString
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
              <a href="/admin/reservation" className="flex items-center p-3 text-blue-600 bg-blue-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                예약관리
              </a>
            </li>
            <li>
              <a href="/admin/reports" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                리포트관리
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
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a1 1 0 00-1 1v4a1 1 0 001 1h3v1a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm0 5V9a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
              통합 예약 목록
            </h1>
          </div>

          {/* 검색 폼 */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            {/* 첫 번째 줄 - 날짜 검색 */}
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* 날짜 조건 */}
              <div className="col-span-4">
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    value={searchConditions.dateType}
                    onChange={(e) => handleSearchChange('dateType', e.target.value)}
                  >
                    <option value="created_at">예약일</option>
                    <option value="check_in_date">입실일</option>
                    <option value="check_out_date">퇴실일</option>
                  </select>
                  <input 
                    type="date" 
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    value={searchConditions.startDate}
                    onChange={(e) => handleSearchChange('startDate', e.target.value)}
                  />
                  <span className="flex items-center text-gray-500">~</span>
                  <input 
                    type="date" 
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    value={searchConditions.endDate}
                    onChange={(e) => handleSearchChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              {/* 키워드 검색 */}
              <div className="col-span-4">
                <div className="flex gap-2">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded text-sm"
                    value={searchConditions.searchField}
                    onChange={(e) => handleSearchChange('searchField', e.target.value)}
                  >
                    <option value="booker_name">예약자명</option>
                    <option value="guest_name">투숙자명</option>
                    <option value="reservation_number">예약번호</option>
                    <option value="booker_phone">연락처</option>
                  </select>
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="검색어 입력"
                    value={searchConditions.keyword}
                    onChange={(e) => handleSearchChange('keyword', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* 검색 버튼 */}
              <div className="col-span-4">
                <button 
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </div>
            </div>

            {/* 두 번째 줄 - 필터 조건 */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  value={searchConditions.bookingStatus}
                  onChange={(e) => handleSearchChange('bookingStatus', e.target.value)}
                >
                  <option value="">예약상태</option>
                  <option value="confirmed">예약완료</option>
                  <option value="cancelled">취소완료</option>
                  <option value="pending">예약접수</option>
                </select>
              </div>
              <div className="col-span-2">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  value={searchConditions.limit}
                  onChange={(e) => handleSearchChange('limit', parseInt(e.target.value))}
                >
                  <option value="10">10개</option>
                  <option value="20">20개</option>
                  <option value="50">50개</option>
                  <option value="100">100개</option>
                </select>
              </div>
              <div className="col-span-8 flex justify-end">
                <button className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  엑셀다운로드
                </button>
              </div>
            </div>
          </div>

          {/* 예약 목록 테이블 */}
          <div className="bg-white border border-gray-300">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">No</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약상태</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약일자</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약번호</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">예약자 정보</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">투숙자 정보</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">입실일, 퇴실일, 박수</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">객실</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">인원</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">금액</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">
                    체크인
                    <div className="text-xs text-gray-500 mt-1">(클릭하여 변경)</div>
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-medium">
                    체크아웃
                    <div className="text-xs text-gray-500 mt-1">(클릭하여 변경)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-xs">로딩 중...</span>
                      </div>
                    </td>
                  </tr>
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="border border-gray-300 px-4 py-8 text-center text-gray-500 text-xs">
                      조회된 예약이 없습니다.
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation, index) => {
                    const statusInfo = getStatusDisplay(reservation.status)
                    const totalGuests = (reservation.adult_count || 0) + (reservation.student_count || 0) + 
                                       (reservation.child_count || 0) + (reservation.infant_count || 0)
                    
                    // 투숙자 정보 결정 (투숙자가 따로 있으면 guest 정보, 없으면 예약자 정보)
                    const guestInfo = reservation.is_different_guest ? {
                      name: reservation.guest_name || '-',
                      phone: reservation.guest_phone || '-',
                      email: reservation.guest_email || '-'
                    } : {
                      name: reservation.booker_name || '-',
                      phone: reservation.booker_phone || '-', 
                      email: reservation.booker_email || '-'
                    }

                    // 체크인/체크아웃 상태 (DB에서 가져온 값 또는 기본값)
                    const checkInStatus = checkStatus[`${reservation.id}_checkin`] ? 'O' : 'X'
                    const checkOutStatus = checkStatus[`${reservation.id}_checkout`] ? 'O' : 'X'
                    
                    return (
                      <tr key={reservation.id}>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{reservations.length - index}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{statusInfo.text}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">{formatDateTime(reservation.created_at)}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs font-medium text-blue-600">{reservation.reservation_number}</td>
                        <td className="border border-gray-300 px-2 py-3 text-left text-xs">
                          <div className="space-y-1">
                            <div>{reservation.booker_name || '-'}</div>
                            <div>{reservation.booker_phone || '-'}</div>
                            <div>{reservation.booker_email || '-'}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-2 py-3 text-left text-xs">
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
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => toggleCheckStatus(reservation.id, 'checkin')}
                              className={`font-bold px-3 py-2 rounded cursor-pointer transition-colors mb-1 ${
                                checkInStatus === 'O' 
                                  ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                                  : 'text-red-600 bg-red-100 hover:bg-red-200'
                              }`}
                              title="클릭하여 체크인 상태 변경"
                            >
                              {checkInStatus}
                            </button>
                            {reservation.check_in_time && (
                              <div className="text-xs text-gray-500">
                                {formatTimeSimple(reservation.check_in_time)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-xs">
                          <div className="flex flex-col items-center">
                            <button 
                              onClick={() => toggleCheckStatus(reservation.id, 'checkout')}
                              className={`font-bold px-3 py-2 rounded cursor-pointer transition-colors mb-1 ${
                                checkOutStatus === 'O' 
                                  ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                                  : 'text-red-600 bg-red-100 hover:bg-red-200'
                              }`}
                              title="클릭하여 체크아웃 상태 변경"
                            >
                              {checkOutStatus}
                            </button>
                            {reservation.check_out_time && (
                              <div className="text-xs text-gray-500">
                                {formatTimeSimple(reservation.check_out_time)}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 하단 정보 */}
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              예약상태 및 체크 안내
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">예약 상태</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs mr-2">예약접수</span>
                    신규 예약을 호텔에 요청한 상태입니다.
                  </li>
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs mr-2">예약완료</span>
                    접수된 예약건이 최종적으로 완료된 상태입니다.
                  </li>
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs mr-2">취소완료</span>
                    취소 신청한 예약 건이 취소가 완료된 상태입니다.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">체크인/아웃 관리</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-2 font-bold">O</span>
                    입장/퇴실 완료 상태
                  </li>
                  <li className="flex items-center">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs mr-2 font-bold">X</span>
                    미입장/미퇴실 상태
                  </li>
                  <li className="text-xs text-gray-600">
                    * 버튼을 클릭하여 상태를 변경할 수 있습니다.
                  </li>
                  <li className="text-xs text-gray-600">
                    * 상태 변경 시 하단에 시간이 표시됩니다.
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