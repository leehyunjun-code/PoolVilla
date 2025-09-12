'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminNavigation from '@/components/admin/navigation'

interface RoomPrice {
  room_id: string
  room_name: string
  zone: string
  price_weekday: number
  price_friday: number
  price_saturday: number
}

interface ZoneData {
  zone: string
  rooms: RoomPrice[]
  avgPrices: {
    weekday: number
    friday: number
    saturday: number
  }
}

interface PriceInput {
  weekday: number
  friday: number
  saturday: number
  price?: string
}

export default function PriceDetail() {
  const [zoneData, setZoneData] = useState<ZoneData[]>([])
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'table' | 'calendar'>('table')
  const [priceInputs, setPriceInputs] = useState<Record<string, PriceInput>>({})
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string>('')


  // 데이터 로드
  useEffect(() => {
    fetchPriceData()
  }, [])

  const fetchPriceData = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('cube45_rooms')
        .select(`
          id,
          name,
          zone,
          cube45_room_prices!inner(
            price_weekday,
            price_friday,
            price_saturday
          )
        `)
        .order('zone')
        .order('name')

      if (error) throw error

      const groupedData: Record<string, RoomPrice[]> = {}
      const inputs: Record<string, PriceInput> = {}
      
      data?.forEach(room => {
        const roomPrice: RoomPrice = {
          room_id: room.id,
          room_name: room.name,
          zone: room.zone,
          price_weekday: room.cube45_room_prices[0]?.price_weekday || 0,
          price_friday: room.cube45_room_prices[0]?.price_friday || 0,
          price_saturday: room.cube45_room_prices[0]?.price_saturday || 0
        }
        
        if (!groupedData[room.zone]) {
          groupedData[room.zone] = []
        }
        groupedData[room.zone].push(roomPrice)
        
        inputs[room.id] = {
          weekday: roomPrice.price_weekday,
          friday: roomPrice.price_friday,
          saturday: roomPrice.price_saturday
        }
      })

      const zones: ZoneData[] = Object.keys(groupedData).map(zone => {
        const rooms = groupedData[zone]
        const avgPrices = {
          weekday: Math.round(rooms.reduce((sum, r) => sum + r.price_weekday, 0) / rooms.length),
          friday: Math.round(rooms.reduce((sum, r) => sum + r.price_friday, 0) / rooms.length),
          saturday: Math.round(rooms.reduce((sum, r) => sum + r.price_saturday, 0) / rooms.length)
        }
        
        inputs[`zone_${zone}`] = {
          weekday: avgPrices.weekday,
          friday: avgPrices.friday,
          saturday: avgPrices.saturday
        }
        
        return { zone, rooms, avgPrices }
      })

      setZoneData(zones)
      setPriceInputs(inputs)
      
      // 첫 번째 객실을 기본 선택값으로 설정
      if (zones.length > 0 && zones[0].rooms.length > 0) {
        setSelectedRoom(zones[0].rooms[0].room_id)
      }
    } catch (error) {
      console.error('가격 데이터 로드 실패:', error)
      alert('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const toggleZoneExpand = (zone: string) => {
    const newExpanded = new Set(expandedZones)
    if (newExpanded.has(zone)) {
      newExpanded.delete(zone)
    } else {
      newExpanded.add(zone)
    }
    setExpandedZones(newExpanded)
  }

  const handleInputChange = (id: string, dayType: string, value: string) => {
    setPriceInputs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [dayType]: value
      }
    }))
  }

  const handleZonePriceApply = async (zone: string) => {
    const zoneKey = `zone_${zone}`
    const weekday = parseInt(String(priceInputs[zoneKey]?.weekday))
    const friday = parseInt(String(priceInputs[zoneKey]?.friday))
    const saturday = parseInt(String(priceInputs[zoneKey]?.saturday))

    if (isNaN(weekday) || isNaN(friday) || isNaN(saturday)) {
      alert('올바른 가격을 입력해주세요.')
      return
    }

    try {
      const roomIds = zoneData.find(z => z.zone === zone)?.rooms.map(r => r.room_id) || []
      
      const { error } = await supabase
        .from('cube45_room_prices')
        .update({
          price_weekday: weekday,
          price_friday: friday,
          price_saturday: saturday
        })
        .in('room_id', roomIds)

      if (error) throw error
      
      alert(`${zone}동 전체 가격이 일괄 적용되었습니다.`)
      fetchPriceData()
      
    } catch (error) {
      console.error('일괄 적용 실패:', error)
      alert('일괄 적용에 실패했습니다.')
    }
  }

  const handleRoomPriceSave = async (roomId: string) => {
    const weekday = parseInt(String(priceInputs[roomId]?.weekday))
    const friday = parseInt(String(priceInputs[roomId]?.friday))
    const saturday = parseInt(String(priceInputs[roomId]?.saturday))

    if (isNaN(weekday) || isNaN(friday) || isNaN(saturday)) {
      alert('올바른 가격을 입력해주세요.')
      return
    }

    try {
      const { error } = await supabase
        .from('cube45_room_prices')
        .update({
          price_weekday: weekday,
          price_friday: friday,
          price_saturday: saturday
        })
        .eq('room_id', roomId)

      if (error) throw error
      
      alert('가격이 저장되었습니다.')
      fetchPriceData()
      
    } catch (error) {
      console.error('개별 저장 실패:', error)
      alert('저장에 실패했습니다.')
    }
  }

  // 달력 관련 함수들
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getPriceForDate = (date: Date) => {
    const dayOfWeek = date.getDay()
    const room = zoneData.flatMap(z => z.rooms).find(r => r.room_id === selectedRoom)
    
    if (!room) return 0
    
    if (dayOfWeek === 5) return room.price_friday
    if (dayOfWeek === 6) return room.price_saturday
    return room.price_weekday
  }

  const getDayType = (date: Date) => {
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 5) return 'friday'
    if (dayOfWeek === 6) return 'saturday'
    return 'weekday'
  }

  const handleDateClick = (day: number) => {
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
    setSelectedDate(date)
  }

  const handleCalendarPriceSave = async () => {
    if (!selectedDate || !selectedRoom) {
      alert('날짜와 객실을 선택해주세요.')
      return
    }

    const dayType = getDayType(selectedDate)
    const inputKey = `calendar_${selectedRoom}_${selectedDate.toISOString().split('T')[0]}`
    const newPrice = parseInt(priceInputs[inputKey] || getPriceForDate(selectedDate))

    if (isNaN(newPrice)) {
      alert('올바른 가격을 입력해주세요.')
      return
    }

    try {
      const updateData: Partial<{
        price_weekday: number
        price_friday: number
        price_saturday: number
      }> = {}
      updateData[`price_${dayType}`] = newPrice
      
      const { error } = await supabase
        .from('cube45_room_prices')
        .update(updateData)
        .eq('room_id', selectedRoom)

      if (error) throw error
      
      const roomName = zoneData.flatMap(z => z.rooms).find(r => r.room_id === selectedRoom)?.room_name
      alert(`${roomName} ${selectedDate.toLocaleDateString()} 가격이 저장되었습니다.`)
      fetchPriceData()
      
    } catch (error) {
      console.error('달력 가격 저장 실패:', error)
      alert('저장에 실패했습니다.')
    }
  }

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

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">상세 요금 관리</h1>
          </div>

          {/* 뷰 전환 탭 */}
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setActiveView('table')}
              className={`px-4 py-2 rounded ${
                activeView === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              테이블 뷰
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 rounded ${
                activeView === 'calendar' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              달력 뷰
            </button>
          </div>

          {/* 테이블 뷰 */}
          {activeView === 'table' && (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">구분</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">주중 (일~목)</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">금요일</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">토요일</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {zoneData.map((zone) => (
                    <React.Fragment key={zone.zone}>
                      <tr className="bg-blue-50 border-b hover:bg-blue-100">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleZoneExpand(zone.zone)}
                            className="flex items-center font-medium text-gray-800"
                          >
                            <span className="mr-2">{expandedZones.has(zone.zone) ? '▼' : '▶'}</span>
                            <span>{zone.zone}동 ({zone.rooms.length})</span>
                          </button>
                        </td>
                        <td className="text-center px-4 py-3">
                          <input
                            type="text"
                            value={priceInputs[`zone_${zone.zone}`]?.weekday?.toLocaleString() || ''}
                            onChange={(e) => handleInputChange(`zone_${zone.zone}`, 'weekday', e.target.value.replace(/,/g, ''))}
                            className="w-28 px-2 py-1 border rounded text-center"
                          />
                        </td>
                        <td className="text-center px-4 py-3">
                          <input
                            type="text"
                            value={priceInputs[`zone_${zone.zone}`]?.weekday?.toLocaleString() || ''}
                            onChange={(e) => handleInputChange(`zone_${zone.zone}`, 'weekday', e.target.value.replace(/,/g, ''))}
                            className="w-28 px-2 py-1 border rounded text-center"
                          />
                        </td>
                        <td className="text-center px-4 py-3">
                          <input
                            type="text"
                            value={priceInputs[`zone_${zone.zone}`]?.weekday?.toLocaleString() || ''}
                            onChange={(e) => handleInputChange(`zone_${zone.zone}`, 'weekday', e.target.value.replace(/,/g, ''))}
                            className="w-28 px-2 py-1 border rounded text-center"
                          />
                        </td>
                        <td className="text-center px-4 py-3">
                          <button
                            onClick={() => handleZonePriceApply(zone.zone)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                          >
                            일괄적용
                          </button>
                        </td>
                      </tr>
                      
                      {expandedZones.has(zone.zone) && zone.rooms.map((room, index) => (
                        <tr key={room.room_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}>
                          <td className="px-4 py-2 pl-10 text-gray-600">{room.room_name}</td>
                          <td className="text-center px-4 py-2">
                            <input
                              type="text"
                              value={priceInputs[room.room_id]?.weekday?.toLocaleString() || ''}
                              onChange={(e) => handleInputChange(room.room_id, 'weekday', e.target.value.replace(/,/g, ''))}
                              className="w-28 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="text-center px-4 py-2">
                            <input
                              type="text"
                              value={priceInputs[room.room_id]?.friday?.toLocaleString() || ''}
                              onChange={(e) => handleInputChange(room.room_id, 'friday', e.target.value.replace(/,/g, ''))}
                              className="w-28 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="text-center px-4 py-2">
                            <input
                              type="text"
                              value={priceInputs[room.room_id]?.saturday?.toLocaleString() || ''}
                              onChange={(e) => handleInputChange(room.room_id, 'saturday', e.target.value.replace(/,/g, ''))}
                              className="w-28 px-2 py-1 border rounded text-center"
                            />
                          </td>
                          <td className="text-center px-4 py-2">
                            <button
                              onClick={() => handleRoomPriceSave(room.room_id)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                              저장
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 달력 뷰 */}
          {activeView === 'calendar' && (
            <div className="bg-white rounded shadow-sm p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-medium">
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
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">객실 선택:</label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="px-3 py-1 border rounded"
                  >
                    {zoneData.flatMap(zone => 
                      zone.rooms.map(room => (
                        <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-4">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                
                {Array.from({ length: getFirstDayOfMonth(selectedMonth) }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}
                
                {Array.from({ length: getDaysInMonth(selectedMonth) }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
                  const dayOfWeek = date.getDay()
                  const price = getPriceForDate(date)
                  const isSelected = selectedDate?.getDate() === day && 
                                   selectedDate?.getMonth() === selectedMonth.getMonth()
                  
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        p-2 border rounded text-sm
                        ${dayOfWeek === 0 ? 'text-red-500' : ''}
                        ${dayOfWeek === 6 ? 'text-blue-500' : ''}
                        ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}
                      `}
                    >
                      <div className="font-medium">{day}</div>
                      <div className="text-xs mt-1">{price.toLocaleString()}</div>
                    </button>
                  )
                })}
              </div>

              {selectedDate && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">선택된 날짜: </span>
                      {selectedDate.toLocaleDateString()} ({['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()]}요일)
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder={getPriceForDate(selectedDate).toString()}
                        onChange={(e) => handleInputChange(
                          `calendar_${selectedRoom}_${selectedDate.toISOString().split('T')[0]}`,
                          'price',
                          e.target.value
                        )}
                        className="w-32 px-2 py-1 border rounded text-center"
                      />
                      <button
                        onClick={handleCalendarPriceSave}
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}