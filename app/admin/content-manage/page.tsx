'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import AdminNavigation from '@/components/admin/navigation'

interface SliderContent {
  id: number
  image_url: string
  title: string
  subtitle: string
  display_order: number
  is_active: boolean
}

interface Cube45Content {
  id: number
  subtitle: string
  title: string
  description: string
  image_url: string
}

export default function ContentManage() {
  const [activeTab, setActiveTab] = useState<'slider' | 'cube45'>('slider')
  const [sliders, setSliders] = useState<SliderContent[]>([])
  const [cube45, setCube45] = useState<Cube45Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 데이터 불러오기
  useEffect(() => {
    fetchContent()
  }, [])

  // 토스트 메시지 표시
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const fetchContent = async () => {
    try {
      const { data: sliderData, error: sliderError } = await supabase
        .from('cube45_main_contents')
        .select('*')
        .eq('section_type', 'slider')
        .order('display_order')

      if (sliderError) throw sliderError
      setSliders(sliderData || [])

      const { data: cube45Data, error: cube45Error } = await supabase
        .from('cube45_main_contents')
        .select('*')
        .eq('section_type', 'cube45')
        .single()

      if (cube45Error && cube45Error.code !== 'PGRST116') throw cube45Error
      setCube45(cube45Data)
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      showToast('데이터를 불러오는데 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 이미지 업로드
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      setUploadProgress(30)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `main-contents/${fileName}`

      setUploadProgress(60)

      const { data, error } = await supabase.storage
        .from('cube45-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      setUploadProgress(90)

      const { data: { publicUrl } } = supabase.storage
        .from('cube45-images')
        .getPublicUrl(filePath)

      setUploadProgress(100)
      
      return publicUrl
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      showToast('이미지 업로드에 실패했습니다.', 'error')
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      await handleNewSliderImage(file)
    } else {
      showToast('이미지 파일만 업로드 가능합니다.', 'error')
    }
  }

  // 새 슬라이더 이미지 처리
  const handleNewSliderImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('파일 크기는 5MB 이하여야 합니다.', 'error')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      // 새 슬라이더 즉시 추가
      try {
        const { error } = await supabase
          .from('cube45_main_contents')
          .insert({
            section_type: 'slider',
            image_url: url,
            title: '',
            subtitle: '',
            display_order: sliders.length + 1,
            is_active: true
          })

        if (error) throw error
        
        showToast('슬라이더가 추가되었습니다.', 'success')
        fetchContent()
      } catch (error) {
        console.error('슬라이더 추가 실패:', error)
        showToast('슬라이더 추가에 실패했습니다.', 'error')
      }
    }
  }

  // 순서 변경 처리
  const handleOrderChange = async (sliderId: number, newOrder: number) => {
    try {
      // 현재 슬라이더 찾기
      const currentSlider = sliders.find(s => s.id === sliderId)
      if (!currentSlider) return
      
      const oldOrder = currentSlider.display_order
      
      // 순서가 같으면 변경 없음
      if (oldOrder === newOrder) return
      
      // 업데이트할 슬라이더들 계산
      const updates: { id: number; display_order: number }[] = []
      
      if (newOrder < oldOrder) {
        // 순서를 앞으로 이동 (예: 5 -> 3)
        // 3, 4를 4, 5로 밀기
        sliders.forEach(slider => {
          if (slider.id === sliderId) {
            updates.push({ id: slider.id, display_order: newOrder })
          } else if (slider.display_order >= newOrder && slider.display_order < oldOrder) {
            updates.push({ id: slider.id, display_order: slider.display_order + 1 })
          }
        })
      } else {
        // 순서를 뒤로 이동 (예: 3 -> 5)
        // 4, 5를 3, 4로 당기기
        sliders.forEach(slider => {
          if (slider.id === sliderId) {
            updates.push({ id: slider.id, display_order: newOrder })
          } else if (slider.display_order > oldOrder && slider.display_order <= newOrder) {
            updates.push({ id: slider.id, display_order: slider.display_order - 1 })
          }
        })
      }
      
      // 모든 업데이트를 병렬로 실행
      const updatePromises = updates.map(update =>
        supabase
          .from('cube45_main_contents')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      )
      
      await Promise.all(updatePromises)
      
      showToast('순서가 변경되었습니다.', 'success')
      fetchContent()
    } catch (error) {
      console.error('순서 변경 실패:', error)
      showToast('순서 변경에 실패했습니다.', 'error')
    }
  }

  // 슬라이더 수정
  const handleUpdateSlider = async (id: number, field: string, value: string | boolean | number) => {
    try {
      const { error } = await supabase
        .from('cube45_main_contents')
        .update({ [field]: value })
        .eq('id', id)

      if (error) throw error
      
      if (field === 'image_url') {
        showToast('이미지가 변경되었습니다.', 'success')
      }
      
      fetchContent()
    } catch (error) {
      console.error('슬라이더 수정 실패:', error)
      showToast('수정에 실패했습니다.', 'error')
    }
  }

  // 슬라이더 삭제
  const handleDeleteSlider = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      // 삭제할 슬라이더 찾기
      const sliderToDelete = sliders.find(s => s.id === id)
      if (!sliderToDelete) return
      
      const deletedOrder = sliderToDelete.display_order
      
      // 먼저 슬라이더 삭제
      const { error: deleteError } = await supabase
        .from('cube45_main_contents')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      // 삭제된 순서보다 큰 순서들을 1씩 감소
      const updates = sliders
        .filter(s => s.display_order > deletedOrder)
        .map(s => ({
          id: s.id,
          display_order: s.display_order - 1
        }))
      
      // 순서 업데이트
      if (updates.length > 0) {
        const updatePromises = updates.map(update =>
          supabase
            .from('cube45_main_contents')
            .update({ display_order: update.display_order })
            .eq('id', update.id)
        )
        
        await Promise.all(updatePromises)
      }
      
      showToast('삭제되었습니다.', 'success')
      fetchContent()
    } catch (error) {
      console.error('슬라이더 삭제 실패:', error)
      showToast('삭제에 실패했습니다.', 'error')
    }
  }

  // CUBE 45 수정
  const handleUpdateCube45 = async () => {
    if (!cube45) return

    try {
      const { error } = await supabase
        .from('cube45_main_contents')
        .update({
          subtitle: cube45.subtitle,
          title: cube45.title,
          description: cube45.description,
          image_url: cube45.image_url
        })
        .eq('section_type', 'cube45')

      if (error) throw error
      
      showToast('CUBE 45 섹션이 업데이트되었습니다.', 'success')
      fetchContent()
    } catch (error) {
      console.error('CUBE 45 수정 실패:', error)
      showToast('수정에 실패했습니다.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">로딩 중...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavigation />
      
      {/* 토스트 메시지 */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}

      <main className="flex-1">
        {/* 헤더 */}
        <div className="bg-white border-b px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">메인 콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-gray-500">메인 페이지의 슬라이더와 CUBE 45 섹션을 관리합니다</p>
        </div>

        {/* 탭 */}
        <div className="bg-white border-b px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('slider')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'slider'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              슬라이더 관리
            </button>
            <button
              onClick={() => setActiveTab('cube45')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'cube45'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              CUBE 45 섹션
            </button>
          </nav>
        </div>

        <div className="p-8">
          {/* 슬라이더 관리 */}
          {activeTab === 'slider' && (
            <div className="space-y-6">
              {/* 업로드 영역 */}
              <div
                ref={dragAreaRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-white rounded-lg border-2 border-dashed transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>파일을 선택</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleNewSliderImage(file)
                        }}
                      />
                    </label>
                    하거나 드래그하여 업로드
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (최대 5MB)</p>
                  
                  {uploading && (
                    <div className="mt-4">
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">업로드 중... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 슬라이더 목록 테이블 */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이미지
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제목 / 부제목
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        순서
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sliders.map((slider) => (
                      <tr key={slider.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative w-20 h-12 bg-gray-100 rounded overflow-hidden">
                            <img
                              src={slider.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-100 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
                              <span className="text-white text-xs">변경</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const url = await uploadImage(file)
                                    if (url) handleUpdateSlider(slider.id, 'image_url', url)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === slider.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={slider.title || ''}
                                onChange={(e) => handleUpdateSlider(slider.id, 'title', e.target.value)}
                                placeholder="제목"
                                className="w-full px-2 py-1 text-sm border rounded"
                              />
                              <input
                                type="text"
                                value={slider.subtitle || ''}
                                onChange={(e) => handleUpdateSlider(slider.id, 'subtitle', e.target.value)}
                                placeholder="부제목"
                                className="w-full px-2 py-1 text-sm border rounded"
                              />
                            </div>
                          ) : (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{slider.title || '제목 없음'}</div>
                              <div className="text-gray-500">{slider.subtitle || '부제목 없음'}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            value={slider.display_order}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value)
                              if (!isNaN(newValue) && newValue > 0) {
                                handleOrderChange(slider.id, newValue)
                              }
                            }}
                            className="w-12 px-2 py-1 text-sm text-center border rounded"
                            min="1"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleUpdateSlider(slider.id, 'is_active', !slider.is_active)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              slider.is_active ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                slider.is_active ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingId(editingId === slider.id ? null : slider.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            {editingId === slider.id ? '완료' : '수정'}
                          </button>
                          <button
                            onClick={() => handleDeleteSlider(slider.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUBE 45 관리 */}
          {activeTab === 'cube45' && cube45 && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 왼쪽: 폼 */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      배경 이미지
                    </label>
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={cube45.image_url}
                          alt="CUBE 45 배경"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-lg cursor-pointer hover:bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">이미지 변경</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const url = await uploadImage(file)
                              if (url && cube45) {
                                setCube45({ ...cube45, image_url: url })
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상단 텍스트
                    </label>
                    <input
                      type="text"
                      value={cube45.subtitle}
                      onChange={(e) => setCube45({...cube45, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Exclusive Cube of Joy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메인 타이틀
                    </label>
                    <input
                      type="text"
                      value={cube45.title}
                      onChange={(e) => setCube45({...cube45, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CUBE 45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      하단 텍스트
                    </label>
                    <input
                      type="text"
                      value={cube45.description}
                      onChange={(e) => setCube45({...cube45, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="큐브45에서만 누릴 수 있는 즐거움"
                    />
                  </div>

                  <button
                    onClick={handleUpdateCube45}
                    disabled={uploading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? '업로드 중...' : '변경사항 저장'}
                  </button>
                </div>

                {/* 오른쪽: 미리보기 */}
                <div className="lg:pl-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">미리보기</h3>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={cube45.image_url}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      <div className="absolute bottom-4 right-4 text-right text-white">
                        <p className="text-sm mb-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {cube45.subtitle}
                        </p>
                        <h2 className="text-2xl font-bold mb-1" style={{ textShadow: '2px 2px 3px rgba(0,0,0,0.8)' }}>
                          {cube45.title}
                        </h2>
                        <p className="text-sm" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                          {cube45.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}