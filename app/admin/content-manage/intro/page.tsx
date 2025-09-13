'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import AdminNavigation from '@/components/admin/navigation'
import Image from 'next/image'

// TypeScript 타입 정의
interface ExtraData {
  tag?: string
  description?: string
  [key: string]: string | undefined
}

interface PageContent {
  id: number
  page_name: string
  section_name: string
  content_type: string
  title: string
  subtitle: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
  extra_data: ExtraData | null
}

interface CafeItem {
  id: number
  section_name: string
  title: string
  image_url: string
  tag: string
  description: string
  display_order: number
}

interface UpdateData {
  title?: string
  image_url?: string
  extra_data?: ExtraData
  [key: string]: string | ExtraData | undefined
}

export default function PageContentsManage() {
  const [activeTab, setActiveTab] = useState<'intro' | 'location' | 'tour'>('intro')
  const [contents, setContents] = useState<PageContent[]>([])
  const [cafes, setCafes] = useState<CafeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCafe, setEditingCafe] = useState<string | null>(null)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const fetchContents = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('cube45_page_contents')
        .select('*')
        .eq('page_name', activeTab)
        .order('display_order')

      if (error) throw error
      
      setContents(data || [])
      
      // Tour 페이지인 경우 카페 데이터 별도 처리
      if (activeTab === 'tour') {
        const cafeData = data?.filter(item => item.content_type === 'card').map(item => ({
          id: item.id,
          section_name: item.section_name,
          title: item.title,
          image_url: item.image_url,
          tag: item.extra_data?.tag || '',
          description: item.extra_data?.description || '',
          display_order: item.display_order
        })) || []
        setCafes(cafeData)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
      showToast('데이터를 불러오는데 실패했습니다.', 'error')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchContents()
  }, [fetchContents])

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `page-contents/${fileName}`

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

  const handleUpdate = async (section_name: string, field: string, value: string | ExtraData) => {
    try {
      const { error } = await supabase
        .from('cube45_page_contents')
        .update({ [field]: value })
        .eq('page_name', activeTab)
        .eq('section_name', section_name)

      if (error) throw error
      
      showToast('저장되었습니다.', 'success')
      fetchContents()
    } catch (error) {
      console.error('업데이트 실패:', error)
      showToast('저장에 실패했습니다.', 'error')
    }
  }

  const handleCafeUpdate = async (section_name: string, updates: Partial<CafeItem>) => {
    try {
      const updateData: UpdateData = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url
      if (updates.tag !== undefined || updates.description !== undefined) {
        const currentCafe = cafes.find(c => c.section_name === section_name)
        updateData.extra_data = {
          tag: updates.tag !== undefined ? updates.tag : currentCafe?.tag,
          description: updates.description !== undefined ? updates.description : currentCafe?.description
        }
      }

      const { error } = await supabase
        .from('cube45_page_contents')
        .update(updateData)
        .eq('page_name', 'tour')
        .eq('section_name', section_name)

      if (error) throw error
      
      showToast('저장되었습니다.', 'success')
      fetchContents()
    } catch (error) {
      console.error('카페 업데이트 실패:', error)
      showToast('저장에 실패했습니다.', 'error')
    }
  }

  const handleImageUpload = async (section_name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('파일 크기는 5MB 이하여야 합니다.', 'error')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      handleUpdate(section_name, 'image_url', url)
    }
  }

  const handleCafeImageUpload = async (section_name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      showToast('파일 크기는 5MB 이하여야 합니다.', 'error')
      return
    }

    const url = await uploadImage(file)
    if (url) {
      handleCafeUpdate(section_name, { image_url: url })
    }
  }

  const getContent = (section_name: string) => {
    return contents.find(c => c.section_name === section_name)
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
          <h1 className="text-2xl font-bold text-gray-900">페이지 콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-gray-500">Intro, Location, Tour 페이지의 콘텐츠를 관리합니다</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white border-b px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('intro')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'intro'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Intro 페이지
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'location'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Location 페이지
            </button>
            <button
              onClick={() => setActiveTab('tour')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tour'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tour 페이지
            </button>
          </nav>
        </div>

        <div className="p-8 space-y-8">
          {/* INTRO 탭 콘텐츠 */}
          {activeTab === 'intro' && (
            <>
              {/* 배너 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">배너 섹션</h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">메인 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.title || ''}
                        onChange={(e) => handleUpdate('banner', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서브 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.subtitle || ''}
                        onChange={(e) => handleUpdate('banner', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exclusive Cube 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Exclusive Cube of Joy 섹션</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={getContent('exclusive_cube')?.title || ''}
                        onChange={(e) => handleUpdate('exclusive_cube', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                      <input
                        type="text"
                        value={getContent('exclusive_cube')?.subtitle || ''}
                        onChange={(e) => handleUpdate('exclusive_cube', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <textarea
                        value={getContent('exclusive_cube')?.description || ''}
                        onChange={(e) => handleUpdate('exclusive_cube', 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                        {getContent('exclusive_cube_image')?.image_url ? (
                          <Image
                            src={getContent('exclusive_cube_image')?.image_url || ''}
                            alt="Exclusive Cube 이미지"
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
                          onChange={(e) => handleImageUpload('exclusive_cube_image', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exceptional Retreat 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">An Exceptional Retreat 섹션</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={getContent('exceptional_retreat')?.title || ''}
                        onChange={(e) => handleUpdate('exceptional_retreat', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                      <input
                        type="text"
                        value={getContent('exceptional_retreat')?.subtitle || ''}
                        onChange={(e) => handleUpdate('exceptional_retreat', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <textarea
                        value={getContent('exceptional_retreat')?.description || ''}
                        onChange={(e) => handleUpdate('exceptional_retreat', 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                        {getContent('exceptional_retreat_image')?.image_url ? (
                          <Image
                            src={getContent('exceptional_retreat_image')?.image_url || ''}
                            alt="Exceptional Retreat 이미지"
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
                          onChange={(e) => handleImageUpload('exceptional_retreat_image', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* LOCATION 탭 콘텐츠 */}
          {activeTab === 'location' && (
            <>
              {/* 배너 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">배너 섹션</h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">메인 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.title || ''}
                        onChange={(e) => handleUpdate('banner', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서브 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.subtitle || ''}
                        onChange={(e) => handleUpdate('banner', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout 텍스트 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Layout 섹션</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={getContent('layout_text')?.title || ''}
                        onChange={(e) => handleUpdate('layout_text', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                      <input
                        type="text"
                        value={getContent('layout_text')?.subtitle || ''}
                        onChange={(e) => handleUpdate('layout_text', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                      <textarea
                        value={getContent('layout_text')?.description || ''}
                        onChange={(e) => handleUpdate('layout_text', 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">배치도 이미지</label>
                    <div className="relative">
                      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                        {getContent('layout_image')?.image_url ? (
                          <Image
                            src={getContent('layout_image')?.image_url || ''}
                            alt="배치도 이미지"
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
                          onChange={(e) => handleImageUpload('layout_image', e)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TOUR 탭 콘텐츠 */}
          {activeTab === 'tour' && (
            <>
              {/* 배너 섹션 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">배너 섹션</h2>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">메인 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.title || ''}
                        onChange={(e) => handleUpdate('banner', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">서브 타이틀</label>
                      <input
                        type="text"
                        value={getContent('banner')?.subtitle || ''}
                        onChange={(e) => handleUpdate('banner', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tour 소개 텍스트 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">소개 섹션</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                    <input
                      type="text"
                      value={getContent('tour_intro')?.title || ''}
                      onChange={(e) => handleUpdate('tour_intro', 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                    <input
                      type="text"
                      value={getContent('tour_intro')?.subtitle || ''}
                      onChange={(e) => handleUpdate('tour_intro', 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                    <textarea
                      value={getContent('tour_intro')?.description || ''}
                      onChange={(e) => handleUpdate('tour_intro', 'description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 카페 목록 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">카페 목록</h2>
                <div className="space-y-4">
                  {cafes.map((cafe) => (
                    <div key={cafe.section_name} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        {/* 이미지 */}
                        <div className="w-32 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={cafe.image_url}
                            alt={cafe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* 편집 영역 */}
                        <div className="flex-1">
                          {editingCafe === cafe.section_name ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={cafe.title}
                                onChange={(e) => {
                                  const newCafes = cafes.map(c => 
                                    c.section_name === cafe.section_name 
                                      ? { ...c, title: e.target.value }
                                      : c
                                  )
                                  setCafes(newCafes)
                                }}
                                placeholder="카페 이름"
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                              <input
                                type="text"
                                value={cafe.tag}
                                onChange={(e) => {
                                  const newCafes = cafes.map(c => 
                                    c.section_name === cafe.section_name 
                                      ? { ...c, tag: e.target.value }
                                      : c
                                  )
                                  setCafes(newCafes)
                                }}
                                placeholder="태그 (예: #Premium Artisan Bakery Café)"
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                              <textarea
                                value={cafe.description}
                                onChange={(e) => {
                                  const newCafes = cafes.map(c => 
                                    c.section_name === cafe.section_name 
                                      ? { ...c, description: e.target.value }
                                      : c
                                  )
                                  setCafes(newCafes)
                                }}
                                placeholder="설명"
                                rows={3}
                                className="w-full px-2 py-1 border rounded text-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const updatedCafe = cafes.find(c => c.section_name === cafe.section_name)
                                    if (updatedCafe) {
                                      handleCafeUpdate(cafe.section_name, {
                                        title: updatedCafe.title,
                                        tag: updatedCafe.tag,
                                        description: updatedCafe.description
                                      })
                                    }
                                    setEditingCafe(null)
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCafe(null)
                                    fetchContents()
                                  }}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                >
                                  취소
                                </button>
                                <label className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 cursor-pointer">
                                  이미지 변경
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleCafeImageUpload(cafe.section_name, e)}
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-semibold">{cafe.title}</h3>
                              <p className="text-sm text-gray-500">{cafe.tag}</p>
                              <p className="text-sm text-gray-700 mt-1">{cafe.description}</p>
                              <button
                                onClick={() => setEditingCafe(cafe.section_name)}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                              >
                                수정
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}