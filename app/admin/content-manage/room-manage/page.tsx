'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminNavigation from '@/components/admin/navigation'
import Image from 'next/image'

interface RoomContent {
  id: number
  page_type: string
  room_id: string | null
  section_name: string
  content: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

interface Room {
  id: string
  name: string
  zone: string
  type: string
  area: string
  standard_capacity: string
  max_capacity: string
  rooms: string
  bathrooms: string
  fireplace: string
  pool: string
  pet_friendly: string
}

export default function RoomManagePage() {
  const [activeTab, setActiveTab] = useState<string>('pool')
  const [contents, setContents] = useState<RoomContent[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [editedRooms, setEditedRooms] = useState<Room[]>([])
  const [roomsChanged, setRoomsChanged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [savingSection, setSavingSection] = useState<string | null>(null)
  const [editedContents, setEditedContents] = useState<RoomContent[]>([])
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // 객실 목록 정의
  const roomsByZone = {
    A: ['A3', 'A4', 'A5', 'A6', 'A7'],
    B: ['B9', 'B10', 'B11', 'B12'],
    C: ['C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25'],
    D: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15']
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  // 데이터 조회
  const fetchContents = useCallback(async () => {
    setLoading(true)
    try {
      // 1. 콘텐츠 데이터 조회
      let contentQuery = supabase.from('cube45_room_contents').select('*')
      
      if (activeTab === 'pool') {
        contentQuery = contentQuery.eq('page_type', 'pool')
      } else if (selectedRoom) {
        // 개별 객실 데이터 조회: 개별 데이터와 기본값 병합
        const zone = selectedRoom[0].toLowerCase()
        
        // 개별 객실 데이터 조회
        const { data: roomData } = await supabase
          .from('cube45_room_contents')
          .select('*')
          .eq('page_type', 'room')
          .eq('room_id', selectedRoom)
          .order('display_order')
        
        // zone_default 데이터 조회
        const { data: defaultData } = await supabase
          .from('cube45_room_contents')
          .select('*')
          .eq('page_type', `zone_default_${zone}`)
          .order('display_order')
        
        // 데이터 병합: 개별 데이터 우선, 없으면 기본값 사용
        const mergedData: RoomContent[] = []
        const addedSections = new Set<string>()
        
        // 1. 먼저 모든 개별 객실 데이터를 추가
        roomData?.forEach(item => {
          mergedData.push(item)
          addedSections.add(item.section_name)
        })
        
        // 2. zone_default 데이터 중 개별 데이터에 없는 것만 추가
        defaultData?.forEach(item => {
          if (!addedSections.has(item.section_name)) {
            mergedData.push(item)
            addedSections.add(item.section_name)
          }
        })
        
        // display_order로 정렬
        mergedData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        
        setContents(mergedData)
        setEditedContents(mergedData)
        setLoading(false)
        return
      } else {
        contentQuery = contentQuery.eq('page_type', `zone_${activeTab}`)
      }
      
      const { data: contentData, error: contentError } = await contentQuery.order('display_order')
      if (contentError) throw contentError
      
      setContents(contentData || [])
      setEditedContents(contentData || [])
      
      // 2. Pool 탭인 경우 객실 데이터도 조회
      if (activeTab === 'pool') {
        const { data: roomData, error: roomError } = await supabase
          .from('cube45_rooms')
            .select('*')
          .order('zone, name')
        
        if (roomError) throw roomError
        setRooms(roomData || [])
        setEditedRooms(roomData || [])
        setRoomsChanged(false)
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error)
      showToast('데이터를 불러오는데 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }, [activeTab, selectedRoom])
  
  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  // 이미지 업로드
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `room-contents/${fileName}`

      const { error } = await supabase.storage
        .from('cube45-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('cube45-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      showToast('이미지 업로드에 실패했습니다.', 'error')
      return null
    }
  }

  // 로컬 업데이트
  const handleLocalUpdate = (sectionName: string, field: 'content' | 'image_url', value: string) => {
    setEditedContents(prev => 
      prev.map(content => 
        content.section_name === sectionName 
          ? { ...content, [field]: value }
          : content
      )
    )
  }

  // 섹션별 저장
  const handleSaveSection = async (sectionNames: string[]) => {
    setSavingSection(sectionNames[0])
    try {
      // 개별 객실 수정 시 새 데이터 생성 로직
      if (selectedRoom) {
        const zone = selectedRoom[0].toLowerCase()
        const updates = editedContents.filter(content => 
          sectionNames.includes(content.section_name)
        )
        
        // 중복 제거: 같은 section_name이 여러 개 있으면 마지막 것만 사용
        const uniqueUpdatesMap = new Map()
        updates.forEach(content => {
          uniqueUpdatesMap.set(content.section_name, content)
        })
        const uniqueUpdates = Array.from(uniqueUpdatesMap.values())
        
        // 🔍 디버깅 1: 저장하려는 전체 데이터 확인
        console.log('=====================================')
        console.log(`[${selectedRoom}호] 저장 시작`)
        console.log('저장할 섹션들:', sectionNames)
        console.log('필터링된 업데이트 데이터 (중복 제거 전):', updates.length, '개')
        console.log('중복 제거 후:', uniqueUpdates.length, '개')
        console.log('최종 업데이트 데이터:', uniqueUpdates)
        
        for (const content of uniqueUpdates) {
          // 🔍 디버깅 2: 각 content 상세 정보
          console.log(`\n--- ${content.section_name} 처리 중 ---`)
          console.log('page_type:', content.page_type)
          console.log('content 값:', content.content)
          console.log('content 길이:', content.content?.length || 0)
          console.log('image_url:', content.image_url)
          
          // zone_default 데이터인지 확인
          if (content.page_type === `zone_default_${zone}`) {
            console.log(`✅ zone_default_${zone} 타입 감지`)
            
            // 먼저 해당 데이터가 이미 있는지 확인
            const { data: existingData } = await supabase
              .from('cube45_room_contents')
              .select('id')
              .eq('page_type', 'room')
              .eq('room_id', selectedRoom)
              .eq('section_name', content.section_name)
              .maybeSingle()
            
            console.log('기존 데이터 존재 여부:', existingData ? `있음 (ID: ${existingData.id})` : '없음')
            
            if (existingData) {
              // 이미 있으면 업데이트
              console.log('📝 UPDATE 실행')
              console.log('업데이트 데이터:', {
                content: content.content,
                image_url: content.image_url
              })
              
              const { error } = await supabase
                .from('cube45_room_contents')
                .update({
                  content: content.content,
                  image_url: content.image_url
                })
                .eq('id', existingData.id)
              
              if (error) {
                console.error('UPDATE 에러:', error)
                throw error
              }
              console.log('✅ UPDATE 성공')
            } else {
              // 없으면 새로 생성
              console.log('📝 INSERT 실행')
              const insertData = {
                page_type: 'room',
                room_id: selectedRoom,
                section_name: content.section_name,
                content: content.content,
                image_url: content.image_url,
                display_order: content.display_order,
                is_active: true
              }
              console.log('INSERT 데이터:', insertData)
              
              const { error } = await supabase
                .from('cube45_room_contents')
                .insert(insertData)
              
              if (error) {
                console.error('INSERT 에러:', error)
                throw error
              }
              console.log('✅ INSERT 성공')
            }
          } else {
            // 이미 개별 객실 데이터인 경우 업데이트
            console.log(`✅ 개별 객실 데이터 (page_type: ${content.page_type})`)
            console.log('📝 UPDATE 실행 (ID:', content.id, ')')
            console.log('업데이트 데이터:', {
              content: content.content,
              image_url: content.image_url
            })
            
            const { error } = await supabase
              .from('cube45_room_contents')
              .update({
                content: content.content,
                image_url: content.image_url
              })
              .eq('id', content.id)
            
            if (error) {
              console.error('UPDATE 에러:', error)
              throw error
            }
            console.log('✅ UPDATE 성공')
          }
        }
        console.log('\n=====================================')
        console.log('모든 저장 완료!')
      } else {
        // 일반 업데이트
        const updates = editedContents.filter(content => 
          sectionNames.includes(content.section_name)
        )
        const updatePromises = updates.map(content => 
          supabase
            .from('cube45_room_contents')
            .update({
              content: content.content,
              image_url: content.image_url
            })
            .eq('id', content.id)
        )
        await Promise.all(updatePromises)
      }
      
      showToast('저장되었습니다.', 'success')
      fetchContents()
    } catch (error) {
      console.error('저장 실패:', error)
      showToast('저장에 실패했습니다.', 'error')
    } finally {
      setSavingSection(null)
    }
  }

  // 이미지 변경 처리
  const handleImageUpload = async (sectionName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('파일 크기는 5MB 이하여야 합니다.', 'error')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      handleLocalUpdate(sectionName, 'image_url', url)
    }
  }

  // 객실 테이블 데이터 로컬 업데이트
  const handleRoomLocalUpdate = (roomId: string, field: string, value: string) => {
    setEditedRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, [field]: value }
          : room
      )
    )
    setRoomsChanged(true)
  }

  // 객실 테이블 데이터 일괄 저장
  const handleRoomsSave = async () => {
    try {
      const updatePromises = editedRooms.map(room => 
        supabase
          .from('cube45_rooms')
          .update({
            name: room.name,
            type: room.type,
            area: room.area,
            standard_capacity: room.standard_capacity,
            max_capacity: room.max_capacity,
            rooms: room.rooms,
            bathrooms: room.bathrooms,
            fireplace: room.fireplace,
            pool: room.pool,
            pet_friendly: room.pet_friendly
          })
          .eq('id', room.id)
      )

      await Promise.all(updatePromises)
      
      showToast('저장되었습니다.', 'success')
      setRoomsChanged(false)
      fetchContents()
    } catch (error) {
      console.error('저장 실패:', error)
      showToast('저장에 실패했습니다.', 'error')
    }
  }

  // 이미지 추가
  const handleAddImage = async (sectionPrefix: string) => {
    const newSectionName = `${sectionPrefix}_${Date.now()}`
    const maxOrder = Math.max(...editedContents.map(c => c.display_order || 0))
    
    const newContent: RoomContent = {
      id: 0,
      page_type: selectedRoom ? 'room' : `zone_${activeTab}`,
      room_id: selectedRoom,
      section_name: newSectionName,
      content: null,
      image_url: '/images/room/aroom.jpg',
      display_order: maxOrder + 1,
      is_active: true
    }
    
    setEditedContents([...editedContents, newContent])
  }

  // 이미지 삭제
  const handleDeleteImage = async (sectionName: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const content = editedContents.find(c => c.section_name === sectionName)
      if (content?.id) {
        const { error } = await supabase
          .from('cube45_room_contents')
          .delete()
          .eq('id', content.id)
        
        if (error) throw error
      }
      
      setEditedContents(prev => prev.filter(c => c.section_name !== sectionName))
      showToast('삭제되었습니다.', 'success')
    } catch (error) {
      console.error('삭제 실패:', error)
      showToast('삭제에 실패했습니다.', 'error')
    }
  }

  const getContent = (sectionName: string): RoomContent | undefined => {
    return editedContents.find(c => c.section_name === sectionName)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavigation />
      
      <main className="flex-1">
        {/* 토스트 메시지 */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.message}
          </div>
        )}

        {/* 헤더 */}
        <div className="bg-white border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">객실 콘텐츠 관리</h1>
              <p className="mt-1 text-sm text-gray-500">Pool, 동별, 개별 객실 페이지의 콘텐츠를 관리합니다</p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white border-b px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('pool')
                setSelectedRoom(null)
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pool'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              풀빌라 전체
            </button>
            {['a', 'b', 'c', 'd'].map(zone => (
              <button
                key={zone}
                onClick={() => {
                  setActiveTab(zone)
                  setSelectedRoom(null)
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === zone
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {zone.toUpperCase()}동
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">로딩 중...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Pool 페이지 관리 */}
              {activeTab === 'pool' && (
                <>
                  {/* 배너 섹션 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">배너 섹션</h2>
                      <button
                        onClick={() => handleSaveSection(['banner', 'title', 'subtitle', 'description'])}
                        disabled={savingSection === 'banner'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingSection === 'banner' ? '저장 중...' : '저장'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                            {getContent('banner')?.image_url ? (
                              <Image
                                src={getContent('banner')?.image_url || ''}
                                alt="배너 이미지"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>이미지 없음</span>
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-lg cursor-pointer hover:bg-gray-50">
                            <span className="text-sm font-medium text-gray-700">이미지 변경</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('banner', e)}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                          <textarea
                            value={getContent('title')?.content || ''}
                            onChange={(e) => handleLocalUpdate('title', 'content', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                          <textarea
                            value={getContent('subtitle')?.content || ''}
                            onChange={(e) => handleLocalUpdate('subtitle', 'content', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                          <textarea
                            value={getContent('description')?.content || ''}
                            onChange={(e) => handleLocalUpdate('description', 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 객실 정보 테이블 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">전체 객실 정보</h2>
                      <button
                        onClick={handleRoomsSave}
                        disabled={!roomsChanged}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          roomsChanged 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {roomsChanged ? '저장' : '저장됨'}
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실명</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실타입</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">객실면적</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">기준인원</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">최대인원</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">룸</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">화장실</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">벽난로</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">수영장</th>
                            <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium">애견동반</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editedRooms.map((room) => {
                            const isChanged = JSON.stringify(room) !== JSON.stringify(rooms.find(r => r.id === room.id))
                            return (
                              <tr key={room.id} className={isChanged ? 'bg-yellow-50' : ''}>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.name}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'name', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.type}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'type', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.area}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'area', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.standard_capacity}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'standard_capacity', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.max_capacity}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'max_capacity', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.rooms}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'rooms', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.bathrooms}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'bathrooms', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.fireplace}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'fireplace', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.pool}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'pool', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                                <td className="border border-gray-300 p-1">
                                  <textarea
                                    value={room.pet_friendly}
                                    onChange={(e) => handleRoomLocalUpdate(room.id, 'pet_friendly', e.target.value)}
                                    rows={1}
                                    className="w-full px-2 py-1 text-sm text-center border border-gray-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none hover:bg-gray-50"
                                  />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* 동별 페이지 관리 */}
              {activeTab !== 'pool' && !selectedRoom && (
                <>
                  {/* 배너 섹션 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">{activeTab.toUpperCase()}동 배너 섹션</h2>
                      <button
                        onClick={() => handleSaveSection(['banner', 'title', 'subtitle'])}
                        disabled={savingSection === 'banner'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingSection === 'banner' ? '저장 중...' : '저장'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">배경 이미지</label>
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                            {getContent('banner')?.image_url ? (
                              <Image
                                src={getContent('banner')?.image_url || ''}
                                alt="배너 이미지"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>이미지 없음</span>
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-lg cursor-pointer hover:bg-gray-50">
                            <span className="text-sm font-medium text-gray-700">이미지 변경</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => handleImageUpload('banner', e)}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">제목 (CUBE45)</label>
                          <textarea
                            value={getContent('title')?.content || ''}
                            onChange={(e) => handleLocalUpdate('title', 'content', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">부제목 (URBAN POOL STAY)</label>
                          <textarea
                            value={getContent('subtitle')?.content || ''}
                            onChange={(e) => handleLocalUpdate('subtitle', 'content', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 슬라이더 이미지 섹션 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">슬라이더 이미지</h2>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAddImage('slider')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          이미지 추가
                        </button>
                        <button
                          onClick={() => handleSaveSection(['slider_1', 'slider_2', 'slider_3', 'slider_4', 'slider_5'])}
                          disabled={savingSection === 'slider_1'}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {savingSection === 'slider_1' ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {[1, 2, 3, 4, 5].map(num => {
                        const content = getContent(`slider_${num}`)
                        return content ? (
                          <div key={num} className="relative">
                            <div className="w-full h-32 bg-gray-100 rounded overflow-hidden relative">
                              <Image
                                src={content.image_url || '/images/room/aroom.jpg'}
                                alt={`슬라이더 ${num}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <label className="block w-full text-center px-2 py-1 mt-2 bg-gray-200 text-sm rounded cursor-pointer hover:bg-gray-300">
                              변경
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(`slider_${num}`, e)}
                              />
                            </label>
                            <button
                              onClick={() => handleDeleteImage(`slider_${num}`)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>

                  {/* Information 섹션 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Information 섹션</h2>
                      <button
                        onClick={() => handleSaveSection(['info_checkin', 'info_pet', 'info_pool'])}
                        disabled={savingSection === 'info_checkin'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {savingSection === 'info_checkin' ? '저장 중...' : '저장'}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">체크인/체크아웃</label>
                        <textarea
                          value={getContent('info_checkin')?.content || ''}
                          onChange={(e) => handleLocalUpdate('info_checkin', 'content', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">애견동반</label>
                        <textarea
                          value={getContent('info_pet')?.content || ''}
                          onChange={(e) => handleLocalUpdate('info_pet', 'content', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">수영장</label>
                        <textarea
                          value={getContent('info_pool')?.content || ''}
                          onChange={(e) => handleLocalUpdate('info_pool', 'content', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 개별 객실 목록 */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-6">개별 객실 관리</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {roomsByZone[activeTab.toUpperCase() as keyof typeof roomsByZone]?.map(roomId => (
                        <button
                          key={roomId}
                          onClick={() => setSelectedRoom(roomId)}
                          className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <div className="text-lg font-medium">{roomId}호</div>
                          <div className="text-sm text-gray-500">클릭하여 편집</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 개별 객실 편집 */}
              {selectedRoom && (
                <>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">{selectedRoom}호 편집</h2>
                      <button
                        onClick={() => setSelectedRoom(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        목록으로
                      </button>
                    </div>

                    {/* 배너 및 기본 정보 */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">배너 및 기본 정보</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지</label>
                            <div className="w-full h-32 bg-gray-100 rounded overflow-hidden relative">
                              <Image
                                src={getContent('banner')?.image_url || '/images/room/aroom.jpg'}
                                alt="배너"
                                fill
                                className="object-cover"
                              />
                              <label className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded shadow cursor-pointer hover:bg-gray-50">
                                <span className="text-xs">변경</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload('banner', e)}
                                />
                              </label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Zone 텍스트</label>
                              <textarea
                                value={getContent('zone_text')?.content || ''}
                                onChange={(e) => handleLocalUpdate('zone_text', 'content', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">해시태그</label>
                              <textarea
                                value={getContent('hashtag')?.content || ''}
                                onChange={(e) => handleLocalUpdate('hashtag', 'content', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">객실명</label>
                              <textarea
                                value={getContent('room_name')?.content || ''}
                                onChange={(e) => handleLocalUpdate('room_name', 'content', e.target.value)}
                                rows={1}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleSaveSection(['banner', 'zone_text', 'hashtag', 'room_name'])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>

                      {/* 갤러리 이미지 */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">갤러리 이미지</h3>
                        <div className="grid grid-cols-5 gap-4">
                          {[1, 2, 3, 4, 5].map(num => (
                            <div key={num} className="relative">
                              <div className="w-full h-24 bg-gray-100 rounded overflow-hidden relative">
                                <Image
                                  src={getContent(`gallery_${num}`)?.image_url || '/images/room/aroom.jpg'}
                                  alt={`갤러리 ${num}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <label className="block w-full text-center px-2 py-1 mt-2 bg-gray-200 text-sm rounded cursor-pointer hover:bg-gray-300">
                                변경
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(`gallery_${num}`, e)}
                                />
                              </label>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleSaveSection(['gallery_1', 'gallery_2', 'gallery_3', 'gallery_4', 'gallery_5'])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>

                      {/* 기본정보 */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">기본정보</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">객실타입</label>
                            <textarea
                              value={getContent('basic_type')?.content || ''}
                              onChange={(e) => handleLocalUpdate('basic_type', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">객실구성</label>
                            <textarea
                              value={getContent('basic_room')?.content || ''}
                              onChange={(e) => handleLocalUpdate('basic_room', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">객실크기</label>
                            <textarea
                              value={getContent('basic_size')?.content || ''}
                              onChange={(e) => handleLocalUpdate('basic_size', 'content', e.target.value)}
                              rows={1}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">기준 / 최대인원</label>
                            <textarea
                              value={getContent('basic_capacity')?.content || ''}
                              onChange={(e) => handleLocalUpdate('basic_capacity', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">수영장</label>
                            <textarea
                              value={getContent('basic_pool')?.content || ''}
                              onChange={(e) => handleLocalUpdate('basic_pool', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleSaveSection(['basic_type', 'basic_room', 'basic_size', 'basic_capacity', 'basic_pool'])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>

                      {/* 어메니티 */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">어메니티</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">어메니티 1</label>
                            <textarea
                              value={getContent('amenity_1')?.content || ''}
                              onChange={(e) => handleLocalUpdate('amenity_1', 'content', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">어메니티 2</label>
                            <textarea
                              value={getContent('amenity_2')?.content || ''}
                              onChange={(e) => handleLocalUpdate('amenity_2', 'content', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleSaveSection(['amenity_1', 'amenity_2'])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>

                      {/* 이용안내 */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">이용안내</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">애견동반</label>
                            <textarea
                              value={getContent('guide_pet')?.content || ''}
                              onChange={(e) => handleLocalUpdate('guide_pet', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">벽난로 이용가능기간</label>
                            <textarea
                              value={getContent('guide_fireplace')?.content || ''}
                              onChange={(e) => handleLocalUpdate('guide_fireplace', 'content', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">추가금 안내사항</label>
                            <textarea
                              value={getContent('guide_additional')?.content || ''}
                              onChange={(e) => handleLocalUpdate('guide_additional', 'content', e.target.value)}
                              rows={12}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md whitespace-pre-wrap"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleSaveSection(['guide_pet', 'guide_fireplace', 'guide_additional'])}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}