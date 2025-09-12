'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminNavigation from '@/components/admin/navigation'

interface DailyData {
  date: string
  guests: number
  revenue: number
  checkIns: number
  checkOuts: number
  occupiedRooms: number
}

export default function DailySalesDetail() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [monthlyData, setMonthlyData] = useState<Record<string, DailyData>>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [detailReservations, setDetailReservations] = useState<any[]>([])
  const [totalRooms, setTotalRooms] = useState(0)

  // 전체 객실 수 조회
  useEffect(() => {
    const fetchTotalRooms = async () => {
      try {
        const { count } = await supabase
          .from('cube45_rooms')
          .select('*', { count: 'exact', head: true })
        
        setTotalRooms(count || 0)
      } catch (error) {
        console.error('전체 객실 수 조회 실패:', error)
      }
    }

    fetchTotalRooms()
  }, [])

  // 월별 데이터 조회
  useEffect(() => {
    if (totalRooms > 0) {
      fetchMonthlyData()
    }
  }, [selectedMonth, totalRooms])

  const fetchMonthlyData = async () => {
    setLoading(true)
    
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth() + 1
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const lastDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
    
    try {
      // 해당 월의 모든 예약 데이터 조회
      const { data: reservations, error } = await supabase
        .from('cube45_reservations')
        .select('*')
        .or(`check_in_date.gte.${firstDay},check_out_date.lte.${lastDate}`)
        .neq('status', 'cancelled')

      if (error) throw error

      // 날짜별 데이터 집계
      const dailyMap: Record<string, DailyData> = {}
      
      // 각 날짜 초기화
      for (let day = 1; day <= lastDay; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        dailyMap[dateStr] = {
          date: dateStr,
          guests: 0,
          revenue: 0,
          checkIns: 0,
          checkOuts: 0,
          occupiedRooms: 0
        }
      }

      // 예약 데이터 처리
      reservations?.forEach(reservation => {
        // 체크인 카운트
        if (reservation.check_in_date >= firstDay && reservation.check_in_date <= lastDate) {
          dailyMap[reservation.check_in_date].checkIns++
        }
        
        // 체크아웃 카운트
        if (reservation.check_out_date >= firstDay && reservation.check_out_date <= lastDate) {
          dailyMap[reservation.check_out_date].checkOuts++
        }

        // 해당 월의 각 날짜에 대해 투숙 인원 및 객실 계산
        for (let day = 1; day <= lastDay; day++) {
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          
          // 해당 날짜에 투숙 중인 경우
          if (reservation.check_in_date <= dateStr && reservation.check_out_date > dateStr) {
            const guestCount = (reservation.adult_count || 0) + 
                              (reservation.student_count || 0) + 
                              (reservation.child_count || 0) + 
                              (reservation.infant_count || 0)
            dailyMap[dateStr].guests += guestCount
          }
          
          // 해당 날짜에 생성된 예약의 매출
          const createdDate = reservation.created_at.split('T')[0]
          if (createdDate === dateStr) {
            dailyMap[dateStr].revenue += reservation.total_amount || 0
          }
        }
      })

      // 각 날짜별 점유 객실 수 계산
      for (let day = 1; day <= lastDay; day++) {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        
        // 해당 날짜에 점유된 객실 조회
        const occupiedRoomIds = new Set<string>()
        reservations?.forEach(reservation => {
          if (reservation.check_in_date <= dateStr && reservation.check_out_date > dateStr) {
            occupiedRoomIds.add(reservation.room_id)
          }
        })
        
        dailyMap[dateStr].occupiedRooms = occupiedRoomIds.size
      }

      setMonthlyData(dailyMap)
    } catch (error) {
      console.error('월별 데이터 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 선택한 날짜의 상세 예약 조회
  const fetchDayDetail = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('cube45_reservations')
        .select('*')
        .lte('check_in_date', date)
        .gt('check_out_date', date)
        .neq('status', 'cancelled')
        .order('room_name')

      if (error) throw error
      setDetailReservations(data || [])
    } catch (error) {
      console.error('상세 데이터 조회 실패:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateClick = (day: number) => {
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    
    setSelectedDate(date)
    fetchDayDetail(dateStr)
  }

  // 월 합계 계산
  const monthlyTotal = Object.values(monthlyData).reduce((acc, cur) => ({
    guests: acc.guests + cur.guests,
    revenue: acc.revenue + cur.revenue,
    checkIns: acc.checkIns + cur.checkIns,
    checkOuts: acc.checkOuts + cur.checkOuts,
    totalOccupiedRooms: acc.totalOccupiedRooms + cur.occupiedRooms
  }), { guests: 0, revenue: 0, checkIns: 0, checkOuts: 0, totalOccupiedRooms: 0 })

  // 월 평균 배정 계산
  const daysInMonth = getDaysInMonth(selectedMonth)
  const monthlyAverageOccupancy = daysInMonth > 0 ? (monthlyTotal.totalOccupiedRooms / daysInMonth).toFixed(1) : '0'
  const monthlyAverageOccupancyRate = totalRooms > 0 ? Math.round((parseFloat(monthlyAverageOccupancy) / totalRooms) * 100) : 0
  const totalMonthlyRoomNights = totalRooms * daysInMonth

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">데이터 로딩중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">일일 매출현황 상세</h1>
          </div>

          {/* 월 네비게이션 */}
          <div className="bg-white rounded shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold">
                  {selectedMonth.getFullYear()}년 {selectedMonth.getMonth() + 1}월
                </h2>
                <button
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* 월 합계 */}
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="text-gray-600">월 총 투숙:</span>
                  <span className="ml-2 font-semibold">{monthlyTotal.guests.toLocaleString()}명</span>
                </div>
                <div>
                  <span className="text-gray-600">월 총 매출:</span>
                  <span className="ml-2 font-semibold">{monthlyTotal.revenue.toLocaleString()}원</span>
                </div>
                <div>
                  <span className="text-gray-600">월 평균 배정:</span>
                  <span className="ml-2 font-semibold">
                    {monthlyAverageOccupancyRate}% ({monthlyAverageOccupancy}/{totalRooms})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">월 배정 합계:</span>
                  <span className="ml-2 font-semibold">
                    ({monthlyTotal.totalOccupiedRooms}/{totalMonthlyRoomNights})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 달력 */}
          <div className="bg-white rounded shadow-sm p-6 mb-6">
            <div className="grid grid-cols-7 gap-1">
              {/* 요일 헤더 */}
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} className="text-center py-2 text-sm font-semibold text-gray-700 border-b">
                  {day}
                </div>
              ))}
              
              {/* 빈 칸 */}
              {Array.from({ length: getFirstDayOfMonth(selectedMonth) }).map((_, index) => (
                <div key={`empty-${index}`} className="h-28" />
              ))}
              
              {/* 날짜 칸 */}
              {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, index) => {
                const day = index + 1
                const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
                const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
                const dayData = monthlyData[dateStr]
                const dayOfWeek = date.getDay()
                const isSelected = selectedDate?.getDate() === day && 
                                 selectedDate?.getMonth() === selectedMonth.getMonth()
                const occupancyRate = totalRooms > 0 ? Math.round((dayData?.occupiedRooms / totalRooms) * 100) : 0
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      h-28 p-2 border rounded text-xs hover:bg-gray-50 transition-colors
                      ${dayOfWeek === 0 ? 'bg-red-50' : ''}
                      ${dayOfWeek === 6 ? 'bg-blue-50' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                    `}
                  >
                    <div className={`font-semibold text-sm mb-1 ${
                      dayOfWeek === 0 ? 'text-red-600' : 
                      dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-0.5 text-left text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">투숙:</span>
                        <span className="font-medium">{dayData?.guests || 0}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">매출:</span>
                        <span className="font-medium">
                          {dayData?.revenue ? dayData.revenue.toLocaleString() : '0'}원
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">배정:</span>
                        <span className="font-medium">
                          {occupancyRate}% ({dayData?.occupiedRooms || 0}/{totalRooms})
                        </span>
                      </div>
                      {(dayData?.checkIns > 0 || dayData?.checkOuts > 0) && (
                        <div className="flex justify-between text-xs mt-0.5 pt-0.5 border-t">
                          {dayData.checkIns > 0 && (
                            <span className="text-green-600">체크인:{dayData.checkIns}</span>
                          )}
                          {dayData.checkOuts > 0 && (
                            <span className="text-red-600">체크아웃:{dayData.checkOuts}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 선택한 날짜 상세 정보 */}
          {selectedDate && (
            <div className="bg-white rounded shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate.toLocaleDateString()} 상세 내역
              </h3>
              
              {detailReservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2">객실</th>
                        <th className="text-left px-4 py-2">투숙객</th>
                        <th className="text-center px-4 py-2">인원</th>
                        <th className="text-center px-4 py-2">체크인</th>
                        <th className="text-center px-4 py-2">체크아웃</th>
                        <th className="text-right px-4 py-2">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailReservations.map((res, idx) => (
                        <tr key={res.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2">{res.room_name}</td>
                          <td className="px-4 py-2">{res.guest_name || res.booker_name}</td>
                          <td className="text-center px-4 py-2">
                            {(res.adult_count || 0) + (res.student_count || 0) + 
                             (res.child_count || 0) + (res.infant_count || 0)}명
                          </td>
                          <td className="text-center px-4 py-2">{res.check_in_date}</td>
                          <td className="text-center px-4 py-2">{res.check_out_date}</td>
                          <td className="text-right px-4 py-2">{res.total_amount.toLocaleString()}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">해당 날짜에 투숙 중인 예약이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}