'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [checkInCount, setCheckInCount] = useState(0)
  const [checkOutCount, setCheckOutCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [weather, setWeather] = useState({
    temp: 0,
    description: '',
    maxTemp: 0,
    humidity: 0,
    icon: ''
  })
  const [dailySales, setDailySales] = useState({
    currentGuests: 0,
    todayRevenue: 0,
    occupancyRate: 0
  })
  const [propertyReport, setPropertyReport] = useState({
    today: { adr: 0, occ: 0, rev: 0, bookings: 0, remaining: 34, total: 34 },
    monthly: { adr: 0, occ: 0, rev: 0, bookings: 0, remaining: 0, total: 0 },
    lastMonth: { adr: 0, occ: 0, rev: 0, bookings: 0 }
  })

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  // 체크인/체크아웃 데이터 조회
  useEffect(() => {
    const fetchDashboardData = async () => {
      const today = new Date().toISOString().split('T')[0]
      console.log('오늘 날짜:', today) // 디버깅용
      
      try {
        // 체크인 건수 조회
        const { data: checkInData } = await supabase
          .from('cube45_reservations')
          .select('id')
          .eq('check_in_date', today)
          .neq('status', 'cancelled')

        // 체크아웃 건수 조회  
        const { data: checkOutData } = await supabase
          .from('cube45_reservations')
          .select('id')
          .eq('check_out_date', today)
          .neq('status', 'cancelled')

        setCheckInCount(checkInData?.length || 0)
        setCheckOutCount(checkOutData?.length || 0)
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error)
      }
    }

    fetchDashboardData()
  }, [])
	
  // 날씨 데이터 조회 (WeatherAPI 사용) ← 여기에 추가
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Gapyeong,South Korea&lang=ko`
        )
        const data = await response.json()
        
        setWeather({
          temp: Math.round(data.current.temp_c),
          description: data.current.condition.text,
          maxTemp: Math.round(data.current.temp_c),
          humidity: data.current.humidity,
          icon: data.current.condition.icon
        })
      } catch (error) {
        console.error('날씨 조회 실패:', error)
      }
    }

    fetchWeather()
  }, [])
	
  // 일일 매출현황 데이터 조회
  useEffect(() => {
    const fetchDailySales = async () => {
      const today = new Date().toISOString().split('T')[0]
      
      try {
        // 현재 숙박중인 총 인원수 (체크인 <= 오늘 < 체크아웃)
        const { data: guestData } = await supabase
          .from('cube45_reservations')
          .select('adult_count, student_count, child_count, infant_count')
          .lte('check_in_date', today)
          .gt('check_out_date', today)
          .neq('status', 'cancelled')

        // 오늘 예약한 매출 (created_at이 오늘인 것)
        const { data: revenueData } = await supabase
          .from('cube45_reservations')
          .select('total_amount')
          .gte('created_at', `${today}T00:00:00`)
          .lt('created_at', `${today}T23:59:59`)
          .neq('status', 'cancelled')

        const currentGuests = guestData?.reduce((sum, item) => 
          sum + (item.adult_count || 0) + (item.student_count || 0) + 
          (item.child_count || 0) + (item.infant_count || 0), 0) || 0

        const todayRevenue = revenueData?.reduce((sum, item) => 
          sum + (item.total_amount || 0), 0) || 0

        // 현재 숙박 중인 객실 수 조회 (중복 제거)
        const { data: occupiedRooms } = await supabase
          .from('cube45_reservations')
          .select('room_id')
          .lte('check_in_date', today)
          .gt('check_out_date', today)
          .neq('status', 'cancelled')

        const occupiedRoomCount = new Set(occupiedRooms?.map(item => item.room_id)).size
        const occupancyRate = Math.round((occupiedRoomCount / 34) * 100)

        setDailySales({
          currentGuests,
          todayRevenue,
          occupancyRate
        })

      } catch (error) {
        console.error('일일 매출현황 조회 실패:', error)
      }
    }

    fetchDailySales()
  }, [])

  // 숙소리포트 데이터 조회
  useEffect(() => {
    const fetchPropertyReport = async () => {
      const today = new Date().toISOString().split('T')[0]
      const thisMonth = today.substring(0, 7) // YYYY-MM
      const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().substring(0, 7)
      
      try {
        // 오늘 데이터
        const { data: todayData } = await supabase
          .from('cube45_reservations')
          .select('total_amount, room_id')
          .eq('check_in_date', today)
          .neq('status', 'cancelled')

        // 현재 숙박중인 객실 (오늘 기준 점유율)
        const { data: occupiedToday } = await supabase
          .from('cube45_reservations')
          .select('room_id')
          .lte('check_in_date', today)
          .gt('check_out_date', today)
          .neq('status', 'cancelled')

        // 이번달 데이터 (created_at 기준)
        const thisMonthStart = `${thisMonth}-01T00:00:00`
        const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().substring(0, 10)
        const thisMonthEnd = `${nextMonth}T00:00:00`
        
        const { data: monthlyData } = await supabase
          .from('cube45_reservations')
          .select('total_amount, created_at, room_id, nights')
          .gte('created_at', thisMonthStart)
          .lt('created_at', thisMonthEnd)
          .neq('status', 'cancelled')
        
        // 지난달 데이터 (created_at 기준)
        const lastMonthStart = `${lastMonth}-01T00:00:00`
        const thisMonthStartForEnd = `${thisMonth}-01T00:00:00`
        
        const { data: lastMonthData } = await supabase
          .from('cube45_reservations')
          .select('total_amount, created_at, room_id, nights')
          .gte('created_at', lastMonthStart)
          .lt('created_at', thisMonthStartForEnd)
          .neq('status', 'cancelled')
        
        console.log('이번달 데이터:', monthlyData)
        console.log('지난달 데이터:', lastMonthData)

        // 오늘 계산
        const todayBookings = todayData?.length || 0
        const todayRev = todayData?.reduce((sum, item) => sum + item.total_amount, 0) || 0
        const todayAdr = todayBookings > 0 ? Math.round(todayRev / todayBookings) : 0
        const todayOcc = Math.round((new Set(occupiedToday?.map(item => item.room_id)).size / 34) * 100)
        const todayRemaining = 34 - todayBookings

        // 이번달 계산
        const monthlyBookings = monthlyData?.length || 0
        const monthlyRev = monthlyData?.reduce((sum, item) => sum + item.total_amount, 0) || 0
        const monthlyAdr = monthlyBookings > 0 ? Math.round(monthlyRev / monthlyBookings) : 0
        
        // 월간 점유율 계산 (판매된 총 객실박수 기준)
        const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        const totalRoomNights = 34 * daysInMonth
        const soldRoomNights = monthlyData?.reduce((sum, item) => sum + (item.nights || 1), 0) || 0
        const monthlyOccRaw = (soldRoomNights / totalRoomNights) * 100
        const monthlyOcc = monthlyOccRaw < 1 ? 
          Math.round(monthlyOccRaw * 10) / 10 : 
          Math.round(monthlyOccRaw)


        // 지난달 계산
        const lastMonthBookings = lastMonthData?.length || 0
        const lastMonthRev = lastMonthData?.reduce((sum, item) => sum + item.total_amount, 0) || 0
        const lastMonthAdr = lastMonthBookings > 0 ? Math.round(lastMonthRev / lastMonthBookings) : 0
        const lastMonthDays = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
        const lastMonthTotalRooms = 34 * lastMonthDays
        const lastMonthSoldRoomNights = lastMonthData?.reduce((sum, item) => sum + (item.nights || 1), 0) || 0
        const lastMonthRemaining = lastMonthTotalRooms - lastMonthSoldRoomNights
        const lastMonthOccRaw = (lastMonthSoldRoomNights / lastMonthTotalRooms) * 100
        const lastMonthOcc = lastMonthOccRaw < 1 ? 
          Math.round(lastMonthOccRaw * 10) / 10 : 
          Math.round(lastMonthOccRaw)
        
        setPropertyReport({
          today: { adr: todayAdr, occ: todayOcc, rev: todayRev, bookings: todayBookings, remaining: todayRemaining, total: 34 },
          monthly: { adr: monthlyAdr, occ: monthlyOcc, rev: monthlyRev, bookings: monthlyBookings, remaining: totalRoomNights - soldRoomNights, total: totalRoomNights },
          lastMonth: { adr: lastMonthAdr, occ: lastMonthOcc, rev: lastMonthRev, bookings: lastMonthBookings, remaining: lastMonthRemaining, total: lastMonthTotalRooms }
        })
		  
		console.log('이번달 잔여:', totalRoomNights - soldRoomNights)
        console.log('지난달 잔여:', lastMonthRemaining)
        console.log('차이:', Math.abs((totalRoomNights - soldRoomNights) - lastMonthRemaining))  

      } catch (error) {
        console.error('숙소리포트 조회 실패:', error)
      }
    }

    fetchPropertyReport()
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드 메뉴 */}
      <aside className="w-48 bg-white shadow-lg">
        <div className="p-4">
          <div className="text-lg font-bold text-gray-800 mb-8">관리자</div>
          
          {/* 메뉴 목록 */}
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="flex items-center p-3 text-blue-600 bg-blue-50 rounded">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                대시보드
              </a>
            </li>
            <li>
              <a href="/admin/reservations" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded">
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
            <h1 className="text-2xl font-bold text-gray-800">매출관리실</h1>
          </div>

          {/* 상단 3개 요약 카드 */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">체크인</p>
                  <p className="text-3xl font-bold text-green-600">{checkInCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">체크아웃</p>
                  <p className="text-3xl font-bold text-red-600">{checkOutCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">배정현황</p>
                  <p className="text-3xl font-bold text-purple-600">{dailySales.occupancyRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* 왼쪽 영역 */}
            <div className="col-span-4 space-y-6">
              {/* 일일 매출현황 */}
              <div className="bg-white rounded shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    일일 매출현황
                    <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="bg-white">
                        <td className="py-2 text-gray-600">투숙</td>
                        <td className="py-2 text-right font-medium">{dailySales.currentGuests}<span className="text-gray-500">명</span></td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 text-gray-600">매출</td>
                        <td className="py-2 text-right font-medium">{dailySales.todayRevenue.toLocaleString()}<span className="text-gray-500">원</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 날씨 위젯 */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded shadow-sm text-white">
                <div className="p-4 border-b border-blue-300">
                  <div className="text-sm">{mounted ? formatDate(currentTime) : '--.--(-)' }</div>
                  <div className="text-xs text-blue-100">가평군</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold flex items-center">
                        <span>{weather.temp}°</span>
                        <div className="ml-2 text-3xl">
                          {weather.icon && (
                            <img 
                              src={`https:${weather.icon.replace('64x64', '128x128')}`}
                              alt={weather.description}
                              className="w-16 h-16"
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-sm">{weather.description}</div>
                      <div className="text-xs text-blue-100">습도 {weather.humidity}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 중앙 영역 */}
            <div className="col-span-8 space-y-6">
              {/* 숙소리포트 */}
              <div className="bg-white rounded shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    숙소리포트
                    <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600"></th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">ADR</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">OCC</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">REV</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">
                          BOOK<br/>
                          <span className="text-xs text-gray-400">(예약/잔여/총객실)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-gray-600">오늘</td>
                        <td className="text-center py-3 px-4">{propertyReport.today.adr.toLocaleString()}</td>
                        <td className="text-center py-3 px-4">{propertyReport.today.occ}%</td>
                        <td className="text-center py-3 px-4">{propertyReport.today.rev.toLocaleString()}</td>
                        <td className="text-center py-3 px-4">{propertyReport.today.bookings}/<span className="text-red-500">{propertyReport.today.remaining}</span>/{propertyReport.today.total}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-600">월간</td>
                        <td className="text-center py-3 px-4">{propertyReport.monthly.adr.toLocaleString()}</td>
                        <td className="text-center py-3 px-4">{propertyReport.monthly.occ}%</td>
                        <td className="text-center py-3 px-4">{propertyReport.monthly.rev.toLocaleString()}</td>
                        <td className="text-center py-3 px-4">{propertyReport.monthly.bookings}/<span className="text-red-500">{propertyReport.monthly.remaining}</span>/{propertyReport.monthly.total}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-gray-600">전월대비</td>
                        <td className="text-center py-3 px-4">
                          <span className={propertyReport.monthly.adr >= propertyReport.lastMonth.adr ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.adr >= propertyReport.lastMonth.adr ? '↑' : '↓'} {Math.abs(propertyReport.monthly.adr - propertyReport.lastMonth.adr).toLocaleString()}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={propertyReport.monthly.occ >= propertyReport.lastMonth.occ ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.occ >= propertyReport.lastMonth.occ ? '↑' : '↓'} {Math.abs(propertyReport.monthly.occ - propertyReport.lastMonth.occ)}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={propertyReport.monthly.rev >= propertyReport.lastMonth.rev ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.rev >= propertyReport.lastMonth.rev ? '↑' : '↓'} {Math.abs(propertyReport.monthly.rev - propertyReport.lastMonth.rev).toLocaleString()}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={propertyReport.monthly.bookings >= propertyReport.lastMonth.bookings ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.bookings >= propertyReport.lastMonth.bookings ? '↑' : '↓'} {Math.abs(propertyReport.monthly.bookings - propertyReport.lastMonth.bookings)}
                          </span>
                          /
                          <span className={propertyReport.monthly.remaining <= propertyReport.lastMonth.remaining ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.remaining <= propertyReport.lastMonth.remaining ? '↑' : '↓'} {Math.abs(propertyReport.monthly.remaining - propertyReport.lastMonth.remaining)}
                          </span>
                          /
                          <span className={propertyReport.monthly.total >= propertyReport.lastMonth.total ? "text-blue-500" : "text-red-500"}>
                            {propertyReport.monthly.total >= propertyReport.lastMonth.total ? '↑' : '↓'} {Math.abs(propertyReport.monthly.total - propertyReport.lastMonth.total)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 숙소투데이 */}
              <div className="bg-white rounded shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    숙소투데이(미완성)
                    <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">상품명</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">잔여객실수</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">입금가</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">변경가</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-gray-700">스탠다드 트윈</td>
                        <td className="text-center py-3 px-4">15</td>
                        <td className="text-center py-3 px-4">100,000</td>
                        <td className="text-center py-3 px-4">
                          <input type="number" className="w-20 px-2 py-1 border rounded text-center text-sm" defaultValue="0" />
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">저장</button>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">[대실]스탠다드 트윈</td>
                        <td className="text-center py-3 px-4">15</td>
                        <td className="text-center py-3 px-4">50,000</td>
                        <td className="text-center py-3 px-4">
                          <input type="number" className="w-20 px-2 py-1 border rounded text-center text-sm" defaultValue="0" />
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">저장</button>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-gray-700">[B2B여행사/모두투어] 스탠다드 트윈</td>
                        <td className="text-center py-3 px-4">15</td>
                        <td className="text-center py-3 px-4">80,000</td>
                        <td className="text-center py-3 px-4">
                          <input type="number" className="w-20 px-2 py-1 border rounded text-center text-sm" defaultValue="0" />
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">저장</button>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">[B2B여행사/하나투어] 스탠다드 트윈</td>
                        <td className="text-center py-3 px-4">15</td>
                        <td className="text-center py-3 px-4">80,000</td>
                        <td className="text-center py-3 px-4">
                          <input type="number" className="w-20 px-2 py-1 border rounded text-center text-sm" defaultValue="0" />
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">저장</button>
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="py-3 px-4 text-gray-700">[조식 2인 PKG] 스탠다드 트윈</td>
                        <td className="text-center py-3 px-4">15</td>
                        <td className="text-center py-3 px-4">105,000</td>
                        <td className="text-center py-3 px-4">
                          <input type="number" className="w-20 px-2 py-1 border rounded text-center text-sm" defaultValue="0" />
                        </td>
                        <td className="text-center py-3 px-4">
                          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200">저장</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}