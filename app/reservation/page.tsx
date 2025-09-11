'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { saveReservation } from '@/api/reservation'
import { getBookedRooms } from '@/api/reservation'
import { supabase } from '@/lib/supabase'


interface Room {
  id: string
  name: string
  rooms: number
  bathrooms: number
  minGuests: number
  maxGuests: number
  size: number
  petFriendly: boolean
  price: number
}

interface DbRoom {
  id: string
  name: string
  zone: string
  type: string
  pool: string
  rooms: string | number
  bathrooms: string | number  
  standard_capacity: string | number
  max_capacity: string | number
  area: string | number
  pet_friendly: string
  current_price: number
}

export default function LocationPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [currentYear, setCurrentYear] = useState(2025)
  const [currentMonth, setCurrentMonth] = useState(9)
  const [nights, setNights] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showRoomResults, setShowRoomResults] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState('전체')
  const [visibleRooms, setVisibleRooms] = useState(3)
  const [searchAdults, setSearchAdults] = useState(2)
  const [searchChildren, setSearchChildren] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [isDifferentGuest, setIsDifferentGuest] = useState(false)
  const [adultCount, setAdultCount] = useState<number>(0)
  const [studentCount, setStudentCount] = useState<number>(0) 
  const [childCount, setChildCount] = useState<number>(0)
  const [infantCount, setInfantCount] = useState<number>(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [customerRequest, setCustomerRequest] = useState('')
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  
  const [showTermsPopup, setShowTermsPopup] = useState<{
    isOpen: boolean;
    type: 'terms1' | 'terms2' | 'terms3' | 'marketing' | null;
  }>({ isOpen: false, type: null })
  
  // Supabase 연동을 위한 상태 추가
  const [roomsData, setRoomsData] = useState<DbRoom[]>([])
  const [roomsLoading, setRoomsLoading] = useState(true)
  
  const today = new Date()
  const currentDate = today.getDate()
  
  // 이름 검증 - 한글, 영문만 허용 (숫자, 특수문자, 띄어쓰기 제한)
  const validateName = (name: string): string => {
    return name.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]/g, '');
  };
	
  // 이메일 검증 - 띄어쓰기 제거
  const validateEmail = (email: string): string => {
    return email.replace(/\s/g, '');
  };	
	
  // 전화번호 검증 - 숫자만 허용
  const validatePhone = (phone: string): string => {
    return phone.replace(/[^0-9]/g, '');
  };	
	 
  // 각 달의 실제 일수 계산
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  // 각 달의 첫 번째 날 요일 계산 (0=일요일, 1=월요일...)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  }; 	
   
  const [firstDate, setFirstDate] = useState<Date | null>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [secondDate, setSecondDate] = useState<Date | null>(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  })

    
  const [selectedRoom, setSelectedRoom] = useState<{
    id: string;
    name: string;
    rooms: number;
    bathrooms: number;
    minGuests: number;
    maxGuests: number;
    size: number;
    petFriendly: boolean;
    price: number;
  } | null>(null)

  const [termsChecked, setTermsChecked] = useState({
    required1: false,
    required2: false,
    required3: false,
    optional1: false
  })
  
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const [bookerInfo, setBookerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const [reservationNumber, setReservationNumber] = useState('')
  const [usedNumbers, setUsedNumbers] = useState<Set<string>>(new Set())
  
  // Supabase에서 객실 데이터 조회
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        setRoomsLoading(true)
        const { data: rooms, error } = await supabase
          .from('cube45_rooms')
          .select('*')
          .order('zone')
          .order('id')

        if (error) throw error

        setRoomsData(rooms || [])
      } catch (error) {
        console.error('객실 데이터 조회 실패:', error)
        alert('객실 정보를 불러오는데 실패했습니다.')
      } finally {
        setRoomsLoading(false)
      }
    }

    fetchRoomsData()
  }, [])
  
  // 객실명 동적 생성 함수
  const generateRoomDisplayName = (room: DbRoom): string => {
    let poolText = ""
    if (room.pool === "실내") {
      poolText = "실내수영장"
    } else if (room.pool === "야외") {
      poolText = "야외수영장"  
    } else if (room.pool === "없음") {
      poolText = "" // 수영장 표시 안함
    }
    
    return `${room.name} 풀빌라 ${room.type} ${poolText}`.trim()
  }
  
  // DB 데이터를 화면 표시용으로 변환하는 함수
  const mapRoomData = (dbRoom: DbRoom): Room => {
    return {
      id: dbRoom.id,
      name: generateRoomDisplayName(dbRoom),
      rooms: parseInt(String(dbRoom.rooms)) || 0,
      bathrooms: parseInt(String(dbRoom.bathrooms)) || 0,
      minGuests: parseInt(String(dbRoom.standard_capacity)) || 0,
      maxGuests: parseInt(String(dbRoom.max_capacity)) || 0,
      size: parseInt(String(dbRoom.area)) || 0,
      petFriendly: dbRoom.pet_friendly === '가능',
      price: dbRoom.current_price || 0
    }
  }
  
  // 예약번호 생성 함수 (중복 방지 버전)
  const generateReservationNumber = () => {
    let newNumber
    do {
      const now = new Date()
      const year = now.getFullYear().toString().slice(-2)
      const month = (now.getMonth() + 1).toString().padStart(2, '0')
      const day = now.getDate().toString().padStart(2, '0')
      const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      newNumber = `S${year}${month}${day}${randomNum}`
    } while (usedNumbers.has(newNumber))
    
    setUsedNumbers(prev => new Set(prev).add(newNumber))
    return newNumber
  }

  const handleDateClick = (date: number) => {
    // 현재 날짜와 선택한 날짜를 정확히 비교
    const selectedDate = new Date(currentYear, currentMonth - 1, date)
    selectedDate.setHours(0, 0, 0, 0)
    
    // 오늘 이전 날짜는 선택 불가
    const todayWithoutTime = new Date()
    todayWithoutTime.setHours(0, 0, 0, 0)
    if (selectedDate < todayWithoutTime) {
      return
    }
    
    if (!firstDate) {
      setFirstDate(selectedDate)
    } else if (!secondDate) {
      setSecondDate(selectedDate)
    } else {
      setFirstDate(selectedDate)
      setSecondDate(null)
    }
  }
  
  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  // 체크인/체크아웃 날짜 계산 (더 빠른 날짜가 체크인)
  const checkInDate = firstDate && secondDate 
    ? (firstDate <= secondDate ? firstDate : secondDate) 
    : firstDate
  const checkOutDate = firstDate && secondDate 
    ? (firstDate <= secondDate ? secondDate : firstDate) 
    : secondDate
  
  // 숙박일 계산 함수
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    }
    return 1
  }

  const isDateSelected = (date: number) => {
    const currentDateObj = new Date(currentYear, currentMonth - 1, date)
    return (checkInDate && currentDateObj.getTime() === checkInDate.getTime()) || 
           (checkOutDate && currentDateObj.getTime() === checkOutDate.getTime())
  }
  
  const isDateInRange = (date: number) => {
    if (!checkInDate || !checkOutDate) return false
    const currentDateObj = new Date(currentYear, currentMonth - 1, date)
    return currentDateObj > checkInDate && currentDateObj < checkOutDate
  }

  const getFilteredRooms = async (selectedBuildingParam = selectedBuilding, adultCount?: number, childCount?: number) => {
    // DB 데이터를 화면용으로 변환
    let rooms = roomsData.map(mapRoomData)
    
    // 동별 필터링 - 파라미터로 받은 값 사용
    if (selectedBuildingParam !== '전체') {
      if (selectedBuildingParam === 'A동') rooms = rooms.filter(room => room.id.startsWith('A'))
      if (selectedBuildingParam === 'B동') rooms = rooms.filter(room => room.id.startsWith('B'))
      if (selectedBuildingParam === 'C동') rooms = rooms.filter(room => room.id.startsWith('C'))
      if (selectedBuildingParam === 'D동') rooms = rooms.filter(room => room.id.startsWith('D'))
    }
    
    // 파라미터로 받은 값이 있으면 사용, 없으면 searchAdults/searchChildren 사용
    const currentAdults = adultCount !== undefined ? adultCount : searchAdults
    const currentChildren = childCount !== undefined ? childCount : searchChildren
    
    // 인원수 필터링
    // 1. 성인이 최소 1명 이상인지 체크
    if (currentAdults < 1) {
      return [] // 성인이 0명이면 빈 배열 반환
    }
    
    // 2. 전체 인원수 계산 (성인 + 소인)
    const totalGuests = currentAdults + currentChildren
    
    // 3. 객실의 최대인원과 비교
    rooms = rooms.filter(room => room.maxGuests >= totalGuests)
    
    // 날짜별 예약 중복 필터링
    if (checkInDate && checkOutDate) {
      const checkIn = `${checkInDate.getFullYear()}-${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}-${checkInDate.getDate().toString().padStart(2, '0')}`
      const checkOut = `${checkOutDate.getFullYear()}-${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}-${checkOutDate.getDate().toString().padStart(2, '0')}`
      const bookedRoomsResult = await getBookedRooms(checkIn, checkOut)
      if (bookedRoomsResult.success) {
        const bookedRoomIds = bookedRoomsResult.data
        rooms = rooms.filter(room => !bookedRoomIds?.includes(room.id))
      }
    }
    
    // A,B,C,D 동별 우선 정렬 → 각 동 내에서 숫자 순서로 정렬
    rooms = rooms.sort((a, b) => {
      // 1단계: 동별 정렬 (A → B → C → D)
      const aBldg = a.id.charAt(0)
      const bBldg = b.id.charAt(0)
      if (aBldg !== bBldg) {
        return aBldg.localeCompare(bBldg)
      }
      
      // 2단계: 같은 동 내에서 숫자 순서로 정렬
      const aNum = parseInt(a.id.replace(/[^0-9]/g, ''))
      const bNum = parseInt(b.id.replace(/[^0-9]/g, ''))
      return aNum - bNum
    })
    
    return rooms
  }
  
  // 추가요금 계산 함수
  const calculateAdditionalFee = (): number => {
    if (!selectedRoom) return 0
    
    // 영유아 2명까지 무료 처리
    const freeInfants = Math.min(infantCount, 2)
    const paidInfants = infantCount - freeInfants
    
    // 실제 계산 대상 인원 (영유아 무료 2명 제외)
    const totalPaidGuests = adultCount + studentCount + childCount + paidInfants
    
    // 기준인원 초과 여부 확인
    const baseCapacity = selectedRoom?.minGuests || 0
    const excessGuests = Math.max(0, totalPaidGuests - baseCapacity)
    
    if (excessGuests === 0) return 0
    
    // 초과 인원을 저렴한 요금부터 적용
    let remaining = excessGuests
    let additionalFee = 0
    
    // 순서: 영유아(1만원) → 아동(1만원) → 학생(2만원) → 성인(3만원)
    
    // 1. 유료 영유아 먼저 적용 (1만원)
    if (paidInfants > 0) {
      const infantApply = Math.min(remaining, paidInfants)
      additionalFee += infantApply * 10000
      remaining -= infantApply
    }
    
    // 2. 아동 적용 (1만원)
    if (remaining > 0) {
      const childApply = Math.min(remaining, childCount)
      additionalFee += childApply * 10000
      remaining -= childApply
    }
    
    // 3. 학생 적용 (2만원)
    if (remaining > 0) {
      const studentApply = Math.min(remaining, studentCount)
      additionalFee += studentApply * 20000
      remaining -= studentApply
    }
    
    // 4. 성인 적용 (3만원)
    if (remaining > 0) {
      const adultApply = Math.min(remaining, adultCount)
      additionalFee += adultApply * 30000
      remaining -= adultApply
    }
    
    return additionalFee
  }
  
  // 총 인원수 계산 함수
  const getTotalGuests = (): number => {
    return adultCount + studentCount + childCount + infantCount
  }
  
  // 최대인원 초과 체크 함수
  const isOverCapacity = (): boolean => {
    if (!selectedRoom) return false
    return getTotalGuests() > selectedRoom.maxGuests
  }
  
  // 최대인원 초과 시 경고 메시지 표시용
  const getCapacityWarning = (): string => {
    if (!selectedRoom) return ''
    const total = getTotalGuests()
    const max = selectedRoom.maxGuests
    
    if (total > max) {
      return `최대인원 ${max}명을 초과했습니다. (현재 ${total}명)`
    }
    return ''
  }
  
  // 옵션 가격 매핑
  const optionPrices: { [key: string]: number } = {
    'bbq4': 30000,
    'bbq4plus': 50000,
    'hotwater1': 100000,
    'hotwater2': 50000,
    'fireplace': 0
  }
  
  // 옵션 선택/해제 함수
  const handleOptionChange = (optionKey: string) => {
    setSelectedOptions(prev => {
      let newOptions = [...prev]
      
      // 미온수 그룹 처리
      if (optionKey === 'hotwater1' || optionKey === 'hotwater2') {
        newOptions = newOptions.filter(key => key !== 'hotwater1' && key !== 'hotwater2')
        newOptions.push(optionKey)
      }
      // BBQ 그룹 처리  
      else if (optionKey === 'bbq4' || optionKey === 'bbq4plus') {
        newOptions = newOptions.filter(key => key !== 'bbq4' && key !== 'bbq4plus')
        newOptions.push(optionKey)
      }
      // 벽난로는 단독 옵션
      else if (optionKey === 'fireplace') {
        if (newOptions.includes(optionKey)) {
          newOptions = newOptions.filter(key => key !== optionKey)
        } else {
          newOptions.push(optionKey)
        }
      }
      
      return newOptions
    })
  }
  
  // 추가옵션 총 가격 계산
  const calculateOptionsFee = (): number => {
    return selectedOptions.reduce((total, optionKey) => {
      return total + (optionPrices[optionKey] || 0)
    }, 0)
  }
  
  // 전체동의 체크 여부 계산
  const allTermsChecked = Object.values(termsChecked).every(checked => checked)
  
  // 개별 약관 체크/해제
  const handleTermChange = (termKey: keyof typeof termsChecked) => {
    setTermsChecked(prev => ({
      ...prev,
      [termKey]: !prev[termKey]
    }))
  }
  
  // 전체동의 체크/해제
  const handleAllTermsChange = () => {
    const newValue = !allTermsChecked
    setTermsChecked({
      required1: newValue,
      required2: newValue,
      required3: newValue,
      optional1: newValue
    })
  }
  
  // 필수 약관 체크 여부 확인 함수
  const isRequiredTermsChecked = (): boolean => {
    return termsChecked.required1 && termsChecked.required2 && termsChecked.required3
  }
  
  // 필수 약관 경고 메시지 생성 함수
  const getRequiredTermsWarning = (): string => {
    if (!isRequiredTermsChecked()) {
      return "필수 약관에 모두 동의해주세요."
    }
    return ""
  }
  
  // 모든 입력 필드 초기화 함수
  const handleReset = () => {
    // 인원수 초기화
    setAdultCount(0)
    setStudentCount(0)
    setChildCount(0)
    setInfantCount(0)
    
    // 추가옵션 초기화
    setSelectedOptions([])
    
    // 약관동의 초기화
    setTermsChecked({
      required1: false,
      required2: false,
      required3: false,
      optional1: false
    })
    
    // 투숙자 정보 체크박스 초기화
    setIsDifferentGuest(false)
    
    // 예약자 정보 초기화
    setBookerInfo({
      name: '',
      email: '',
      phone: ''
    })
    
    // 투숙자 정보 초기화
    setGuestInfo({
      name: '',
      email: '',
      phone: ''
    })
  }
  
  // 투숙자 정보 유효성 검사
  const isGuestInfoValid = (): boolean => {
    if (!isDifferentGuest) return true // 체크박스 안 했으면 검사 안 함
    return guestInfo.name.trim() !== '' && guestInfo.email.trim() !== '' && guestInfo.phone.trim() !== ''
  }
  
  // 예약자 정보 유효성 검사
  const isBookerInfoValid = (): boolean => {
    return bookerInfo.name.trim() !== '' && bookerInfo.email.trim() !== '' && bookerInfo.phone.trim() !== ''
  }
  
  // 투숙인원 0명 체크
  const hasGuestCount = (): boolean => {
    return adultCount > 0 || studentCount > 0 || childCount > 0 || infantCount > 0
  }
  
  // 우선순위에 따른 오류 메시지 반환
  const getFirstErrorMessage = (): string => {
    if (isOverCapacity()) {
      return getCapacityWarning()
    }
    if (!hasGuestCount()) {
      return "투숙인원을 1명 이상 선택해주세요."
    }
    if (!isBookerInfoValid()) {
      return "예약자 정보를 모두 입력해주세요."
    }
    if (!isRequiredTermsChecked()) {
      return "필수 약관에 모두 동의해주세요."
    }
    if (!isGuestInfoValid()) {
      return "투숙자 정보를 모두 입력해주세요."
    }
    return ""
  }
  
  // 예약 데이터 준비 함수
  const prepareReservationData = (reservationNum: string) => {
    return {
      reservationNumber: reservationNum,
      roomId: selectedRoom?.id || '',
      roomName: selectedRoom?.name || '',
      checkInDate: checkInDate ? `${checkInDate.getFullYear()}-${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}-${checkInDate.getDate().toString().padStart(2, '0')}` : '',
      checkOutDate: checkOutDate ? `${checkOutDate.getFullYear()}-${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}-${checkOutDate.getDate().toString().padStart(2, '0')}` : '',
      nights: calculateNights(),
      bookerName: bookerInfo.name,
      bookerEmail: bookerInfo.email,
      bookerPhone: bookerInfo.phone,
      isDifferentGuest: isDifferentGuest,
      guestName: isDifferentGuest ? guestInfo.name : null,
      guestEmail: isDifferentGuest ? guestInfo.email : null,
      guestPhone: isDifferentGuest ? guestInfo.phone : null,
      adultCount: adultCount,
      studentCount: studentCount,
      childCount: childCount,
      infantCount: infantCount,
      roomPrice: selectedRoom?.price || 0,
      additionalFee: calculateAdditionalFee(),
      optionsFee: calculateOptionsFee(),
      totalAmount: (selectedRoom?.price || 0) + calculateAdditionalFee() + calculateOptionsFee(),
      selectedOptions: selectedOptions,
      customerRequest: customerRequest
    }
  }

  // 로딩 중일 때 표시할 컴포넌트
  if (roomsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-28 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-lg text-gray-600">객실 정보를 불러오는 중...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
      
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />
      
      {/* 메인 콘텐츠 */}
      <div className="pt-28">
        {/* CUBE 45 헤더 섹션 */}
        <div className="relative">
          <div className="h-[500px] relative overflow-hidden">
            <Image 
              src="/images/cube45/background2.jpg"
              alt="CUBE 45" 
              fill
              priority
              quality={100}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Section 1: Urban Cube Pool */}
        <section className="py-32 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light mb-6 text-black">RESERVATION</h2>
              
              {/* 단계별 탭 - 수정된 버전 */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-gray-200 overflow-hidden">
                  {/* 01 객실선택 */}
                  <button
                    onClick={(e) => {
                      if (activeStep === 3) {
                        e.preventDefault();
                        return;
                      }
                      setActiveStep(1);
                    }}
                    className={`w-80 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeStep === 1
                        ? 'bg-black text-white'
                        : activeStep === 3
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    disabled={activeStep === 3}
                  >
                    01 객실선택
                  </button>
                  
                  <button
                    onClick={() => {
                      if (activeStep !== 3 && selectedRoom) {
                        setActiveStep(2)
                      } else if (activeStep !== 3) {
                        alert('먼저 객실을 선택해주세요.')
                      }
                    }}
                    className={`w-80 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeStep === 2
                        ? 'bg-black text-white'
                        : activeStep === 3
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedRoom 
                            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!selectedRoom || activeStep === 3}
                  >
                    02 정보입력
                  </button>
                  
                  {/* 03 예약완료 - 비활성화 */}
                  <button
                    onClick={() => {
                      alert('결제 완료 후 이용 가능합니다.')
                    }}
                    className="w-80 py-3 text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled={true}
                  >
                    03 예약완료
                  </button>
                </div>
              </div>

              {/* 객실선택 단계 - 예약 정보 입력 폼 */}
              {activeStep === 1 && (
                <div className="flex justify-center mb-6">
                  <div className="w-[960px] flex justify-start">
                    <div className="w-80 bg-white p-4 shadow-sm">
                      
                      {/* 달력 섹션 */}
                      <div className="mb-4 p-3 bg-gray-50">
                        <h4 className="text-sm font-medium mb-3 text-gray-800">
                          {checkInDate && checkOutDate 
                            ? `예약일자 ${checkInDate.getFullYear()}. ${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}. ${checkInDate.getDate().toString().padStart(2, '0')}~ ${checkOutDate.getFullYear()}. ${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}. ${checkOutDate.getDate().toString().padStart(2, '0')}`
                            : '예약일자'
                          }
                        </h4>
                        
                        {/* 달력 헤더 */}
                        <div className="flex justify-between items-center mb-3">
                          <button 
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            onClick={handlePreviousMonth}
                          >
                            &lt;
                          </button>
                          <span className="font-medium text-gray-800 text-sm">
                            {currentYear} {monthNames[currentMonth - 1]}
                          </span>
                          <button 
                            className="text-gray-600 hover:text-gray-800 text-sm"
                            onClick={handleNextMonth}
                          >
                            &gt;
                          </button>
                        </div>
                        
                        {/* 요일 */}
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs">
                          <div className="text-red-500 font-medium">일</div>
                          <div className="text-gray-600 font-medium">월</div>
                          <div className="text-gray-600 font-medium">화</div>
                          <div className="text-gray-600 font-medium">수</div>
                          <div className="text-gray-600 font-medium">목</div>
                          <div className="text-gray-600 font-medium">금</div>
                          <div className="text-blue-500 font-medium">토</div>
                        </div>
                        
                        {/* 날짜 */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                          {/* 첫 주의 빈 칸들 */}
                          {Array.from({length: getFirstDayOfMonth(currentYear, currentMonth)}).map((_, index) => (
                            <div key={`empty-${index}`} className="p-1"></div>
                          ))}
                          
                          {/* 실제 날짜들 */}
                          {Array.from({length: getDaysInMonth(currentYear, currentMonth)}).map((_, index) => {
                            const date = index + 1;
                            return (
                              <div 
                                key={date} 
                                className={`p-1 ${
                                  (() => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0)
                                    const selectedDate = new Date(currentYear, currentMonth - 1, date)
                                    return selectedDate < today
                                  })()
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'cursor-pointer hover:bg-gray-200'
                                } ${
                                  isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                  isDateInRange(date) ? 'bg-blue-200' : ''
                                }`} 
                                onClick={() => handleDateClick(date)}
                              >
                                {date}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 체크인 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">체크인</span>
                          <span className="text-gray-800">{checkInDate ? `${checkInDate.getFullYear()}-${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}-${checkInDate.getDate().toString().padStart(2, '0')}` : '--'}</span>
                        </div>
                      </div>
                      
                      {/* 체크아웃 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">체크아웃</span>
                          <span className="text-gray-800">{checkOutDate ? `${checkOutDate.getFullYear()}-${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}-${checkOutDate.getDate().toString().padStart(2, '0')}` : '--'}</span>
                        </div>
                      </div>
                      
                      {/* 숙박일 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">숙박일</span>
                          <span className="text-gray-800">{calculateNights()}</span>
                        </div>
                      </div>
                      
                      {/* 객실 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">객실</span>
                          <span className="text-gray-800">1</span>
                        </div>
                      </div>

                      
                      {/* 성인 인수 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">성인 인수</span>
                          <div className="flex items-center">
                            <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-gray-600 hover:text-gray-800 px-2">-</button>
                            <span className="text-gray-800 px-2">{adults}</span>
                            <button onClick={() => setAdults(adults + 1)} className="text-gray-600 hover:text-gray-800 px-2">+</button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 소인 인수 */}
                      <div className="mb-4">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">소인 인수</span>
                          <div className="flex items-center">
                            <button onClick={() => setChildren(Math.max(0, children - 1))} className="text-gray-600 hover:text-gray-800 px-2">-</button>
                            <span className="text-gray-800 px-2">{children}</span>
                            <button onClick={() => setChildren(children + 1)} className="text-gray-600 hover:text-gray-800 px-2">+</button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 객실검색 버튼 */}
                      <button 
                        className="w-full py-3 text-white font-medium text-sm"
                        style={{backgroundColor: '#134C59'}}
                        disabled={isSearching || roomsLoading}
                        onClick={async () => {
                          if (!checkInDate || !checkOutDate) {
                            alert('체크인과 체크아웃 날짜를 선택해주세요.')
                            return
                          }
                          
                          setIsSearching(true)
                          setShowRoomResults(false)
                          setSelectedBuilding('전체')
                          setVisibleRooms(3)
                          
                          // 상태 업데이트 대신 직접 값 전달
                          setSearchAdults(adults)
                          setSearchChildren(children)
                          
                          try {
                            // getFilteredRooms에 직접 값 전달
                            const rooms = await getFilteredRooms('전체', adults, children)
                            setFilteredRooms(rooms)
                            setTimeout(() => {
                              setShowRoomResults(true)
                              setIsSearching(false)
                            }, 500)
                          } catch (error) {
                            console.error('객실 검색 실패:', error)
                            alert('객실 검색 중 오류가 발생했습니다.')
                            setIsSearching(false)
                          }
                        }}
                      >
                        {isSearching ? '검색중...' : '객실검색'}
                      </button>
                    </div>
                    
                    {/* 객실 검색 결과 */}
                    {showRoomResults && (
                      <div className="w-[640px] ml-4 h-[600px]">
                        {/* 동 선택 필터 */}
                        <div className="flex justify-center mb-4">
                          <div className="flex bg-gray-200 overflow-hidden">
                            {['전체', 'A동', 'B동', 'C동', 'D동'].map(building => (
                              <button
                                key={building}
                                onClick={async () => {
                                  setSelectedBuilding(building)
                                  setVisibleRooms(3)
                                  
                                  // 해결: 선택된 building을 직접 전달
                                  const rooms = await getFilteredRooms(building)
                                  setFilteredRooms(rooms)
                                }}

                                className={`px-6 py-2 text-sm font-medium transition-colors duration-200 ${
                                  selectedBuilding === building
                                    ? 'bg-black text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {building}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="max-h-[700px] overflow-y-auto">
                          {filteredRooms.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-gray-500 mb-4">검색된 객실이 없습니다</p>
                              <button 
                                className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium text-sm transition-colors duration-200"
                                onClick={async () => {
                                  setAdults(2)
                                  setChildren(0)
                                  setSelectedBuilding('전체')
                                  setSearchAdults(2)
                                  setSearchChildren(0)
                                  
                                  const rooms = await getFilteredRooms()
                                  setFilteredRooms(rooms)
                                }}
                              >
                                검색 조건 초기화
                              </button>
                            </div>
                          ) : (
                            <>
                              {filteredRooms.slice(0, visibleRooms).map((room) => (
                                <div key={room.id} className="bg-white p-6 shadow-sm mb-4">
                                  <div className="flex">
                                    <div className="w-48 h-32 mr-6">
                                      <Image 
                                        src="/images/reservation/roomex.jpg"
                                        alt={room.name}
                                        width={192}
                                        height={128}
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="flex-1 flex justify-between">
                                      <div className="text-left">
                                        <h3 className="text-base font-medium mb-3 text-gray-800">{room.name}</h3>
                                        <div className="text-sm text-gray-600">
                                          <div>침대룸 {room.rooms}개, 화장실 {room.bathrooms}개</div>
                                          <div>기준인원 : {room.minGuests}명 최대인원 : {room.maxGuests}명</div>
                                          <div>객실크기 : {room.size}평</div>
                                          <div>애견동반 {room.petFriendly ? '가능' : '불가능'}</div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end justify-end">
                                        <div className="text-base font-bold mb-2">₩{room.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">VAT포함</span></div>
                                        <button className="px-8 py-2 text-white font-medium text-sm" style={{backgroundColor: '#134C59'}} onClick={() => {
                                          setSelectedRoom(room)
                                          setActiveStep(2)
                                        }}>객실예약</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* 더보기 버튼 */}
                              {filteredRooms.length > visibleRooms && (
                                <div className="flex justify-center mt-4">
                                  <button
                                    onClick={() => setVisibleRooms(visibleRooms + 3)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium text-sm transition-colors duration-200"
                                  >
                                    더보기 ({filteredRooms.length - visibleRooms}개 더)
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 현재 단계 표시 */}
              <div className="mt-6">
                {activeStep === 2 && (
                  <div className="flex justify-center mb-6">
                    <div className="w-[960px] flex gap-4">
                      {/* 왼쪽 - 예약정보 요약 */}
                      <div className="w-80 bg-white p-4 shadow-sm">
                        {/* 객실 이미지 */}
                        <div className="w-full h-48 mb-4">
                          <Image 
                            src="/images/reservation/roomex.jpg"
                            alt="예약정보"
                            width={320}
                            height={192}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        
                        {/* 취소규정 */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2 text-gray-800 text-left">취소규정</h5>
                          <table className="w-full text-xs border border-gray-300">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border-r border-gray-300 px-3 py-2 text-center font-medium">취소일기준</th>
                                <th className="border-r border-gray-300 px-3 py-2 text-center font-medium">취소가능여부</th>
                                <th className="px-3 py-2 text-center font-medium">수수료율</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border-r border-gray-300 px-3 py-2 text-center">2025-09-04 부터</td>
                                <td className="border-r border-gray-300 px-3 py-2 text-center">취소불가능</td>
                                <td className="px-3 py-2 text-center">100%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        {/* 예약정보 */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-800 text-left">예약정보</h4>
                          <div className="text-xs text-gray-600 bg-gray-50 p-3 text-left">
                            <div className="mb-1">객실명 : {selectedRoom?.id || '--'}</div>
                            <div className="mb-1">체크인 : {checkInDate ? `${checkInDate.getFullYear()}-${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}-${checkInDate.getDate().toString().padStart(2, '0')}` : '--'}</div>
                            <div className="mb-1">체크아웃 : {checkOutDate ? `${checkOutDate.getFullYear()}-${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}-${checkOutDate.getDate().toString().padStart(2, '0')}` : '--'}</div>
                            <div className="mb-1">침대룸 {selectedRoom?.rooms || 0}개, 화장실 {selectedRoom?.bathrooms || 0}개</div>
                            <div className="mb-1">기준인원 : {selectedRoom?.minGuests || 0}명 최대인원 : {selectedRoom?.maxGuests || 0}명</div>
                            <div className="mb-1">객실크기 : {selectedRoom?.size || 0}평</div>
                            <div>애견동반 {selectedRoom?.petFriendly ? '가능' : '불가능'}</div>
                          </div>
                        </div>
                        
                        {/* 예약 유의사항 */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2 text-gray-800 text-left">예약 유의사항</h5>
                          <div className="h-150 overflow-y-auto text-xs text-gray-600 leading-relaxed text-left">
                            패밀리트윈 객실은 인원추가 시 11,000원/인이 추가됩니다. 스위트는 인원추가 시 22,000원/인이 추가되며 침구류가 제공됩니다.<br/><br/>
                            
                            <strong>[성수기 취소규정]</strong><br/>
                            - 성수기 기간 : 2024년 7월 14일 ~ 10월 8일<br/>
                            - 체크인 기준 7일전 : 무료취소 가능<br/>
                            - 체크인 기준 6~1일전 : 1박(첫째날)에대해 100% 수수료 발생<br/>
                            - 체크인 기준 당일 취소 및 NO SHOW : 전체예약에대해 100% 수수료 발생<br/><br/>
                            
                            <strong>[비성수기 취소규정]</strong><br/>
                            - 체크인 기준 3일전 : 무료취소 가능<br/>
                            - 체크인 기준 2일전 : 전체예약에대해 50% 수수료 발생<br/>
                            - 체크인 기준 1일전 및 당일취소, NO SHOW : 전체 예약에 대해 100% 수수료 발생<br/><br/>
                            
                            - 기준 인원 초과 시 추가 비용이 발생하게 됩니다. (모든 영,유아는 투숙 인원에 포함이 됩니다.)<br/>
                            - 만 35개월 무료, 만 36개월 이상 유아일 경우 인원 추가 비용이 발생하게 됩니다.<br/>
                            - 영,유아 포함하여 최대인원 초과하여 입실 불가하며 해당사유로 취소 및 환불 불가합니다.<br/>
                            - 객실에 따라 이미지와 다른 객실로 배정될 수 있습니다.<br/>
                            - 실시간 예약 특성상 중복예약이 발생할 수 있으며 예약이 취소될 수 있습니다.<br/>
                            - 단순변심, 고객사정으로 인한 취소 시 취소환불수수료가 적용됩니다.<br/>
                            - 업체 물품의 파손 및 분실 시 업체기준으로 변상하셔야 합니다.<br/>
                            - 반려동물 동반입실 불가합니다.<br/>
                            - 기본 에티켓을 지키지 않거나, 타인에게 피해를 주거나 불쾌감을 주는 행위는 강제퇴실조치 사유입니다.<br/>
                            - 화재 예방을 위해 객실 내 취사 및 화기 사용금지입니다.<br/>
                            - 미성년자 투숙불가 / 만 19세 이상 체크인 가능합니다.<br/>
                            - 벤티모 호텔은 국민건강증진법 9조 4항에 의거하여 전 객실 및 공용공간이 금연장소로 지정되어있습니다. 금연 정책을 어길 경우 객실 정비 비용 20만원 패널티가 발생합니다.<br/>
                            - 무료 주차 가능 (기계 주차장 26대, 야외 주차장)<br/><br/>
                            
                            * 체크인 시 반드시 차량 등록이 필요하며, 야외 전용 주차장 이용 시 프론트에서 반드시 차량 등록 카드 작성 부탁 드립니다.<br/>
                            * 2,200kg이 초과되는 대형 차량 및 전기차의 경우 호텔 내부에 이용중인 기계식 주차장 이용이 불가능하여 야외 주차장(연동88주차장 / 제주시 연삼로 50) 이용을 부탁드립니다.
                          </div>
                        </div>
                      </div>
                      
                      {/* 오른쪽 - 예약자 정보 입력 폼 */}
                      <div className="flex-1 bg-white p-6 shadow-sm">
                        {/* 헤더 영역 - 제목과 체크박스를 flex로 배치 */}
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-sm font-medium text-gray-800 text-left">예약자 정보</h3>
                          <label className="flex items-center text-sm text-gray-600">
                            <input 
                              type="checkbox" 
                              className="mr-2" 
                              onChange={(e) => setIsDifferentGuest(e.target.checked)}
                            />
                            투숙자가 다릅니다
                          </label>
                        </div>
                        
                        {/* 예약자 정보 */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">예약자 이름</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="홍길동"
                              value={bookerInfo.name}
                              onChange={(e) => {
                                console.log('입력값:', e.target.value);
                                const validatedName = validateName(e.target.value);
                                console.log('검증 후:', validatedName);
                                setBookerInfo(prev => ({...prev, name: validatedName}));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">예약자 이메일</label>
                            <input 
                              type="email" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="example@email.com"
                              value={bookerInfo.email}
                              onKeyDown={(e) => {
                                if (e.key === ' ') {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => setBookerInfo(prev => ({...prev, email: e.target.value}))}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">예약자 연락처</label>
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="010-1234-5678"
                              value={bookerInfo.phone}
                              onChange={(e) => {
                                const validatedPhone = validatePhone(e.target.value);
                                setBookerInfo(prev => ({...prev, phone: validatedPhone}));
                              }}
                            />
                          </div>
                        </div>
                      
                        {/* 투숙자 정보 - 체크박스 선택 시에만 표시 */}
                        {isDifferentGuest && (
                          <>
                            <h3 className="text-sm font-medium text-gray-800 text-left mb-6">투숙자 정보</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">투숙자 이름</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="홍길동"
                                  value={guestInfo.name}
                                  onChange={(e) => {
                                    const validatedName = validateName(e.target.value);
                                    setGuestInfo(prev => ({...prev, name: validatedName}));
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">투숙자 이메일</label>
                                <input 
                                  type="email" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="example@email.com"
                                  value={guestInfo.email}
                                  onKeyDown={(e) => {
                                    if (e.key === ' ') {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => setGuestInfo(prev => ({...prev, email: e.target.value}))}
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">투숙자 연락처</label>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="010-1234-5678"
                                  value={guestInfo.phone}
                                  onChange={(e) => {
                                    const validatedPhone = validatePhone(e.target.value);
                                    setGuestInfo(prev => ({...prev, phone: validatedPhone}));
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                                              
                        {/* 인원 선택 */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3 text-gray-800 text-left">투숙인원</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">성인</label>
                              <input 
                                type="number" 
                                min="0" 
                                value={adultCount}
                                onChange={(e) => setAdultCount(parseInt(e.target.value) || 0)}
                                onBlur={(e) => e.target.value = adultCount.toString()}
                                className="w-full p-2 border border-gray-300 text-sm" 
                                placeholder="0" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">학생</label>
                              <input 
                                type="number" 
                                min="0" 
                                value={studentCount}
                                onChange={(e) => setStudentCount(parseInt(e.target.value) || 0)}
                                onBlur={(e) => e.target.value = studentCount.toString()}
                                className="w-full p-2 border border-gray-300 text-sm" 
                                placeholder="0" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">아동</label>
                              <input 
                                type="number" 
                                min="0" 
                                value={childCount}
                                onChange={(e) => setChildCount(parseInt(e.target.value) || 0)}
                                onBlur={(e) => e.target.value = childCount.toString()}
                                className="w-full p-2 border border-gray-300 text-sm" 
                                placeholder="0" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">영유아</label>
                              <input 
                                type="number" 
                                min="0" 
                                value={infantCount}
                                onChange={(e) => setInfantCount(parseInt(e.target.value) || 0)}
                                onBlur={(e) => e.target.value = infantCount.toString()}
                                className="w-full p-2 border border-gray-300 text-sm" 
                                placeholder="0" 
                              />
                            </div>
                          </div>
                          <div className="mt-6 text-xs text-black text-left">
                            <div>• 학생 : 만 13세 ~ 18세</div>
                            <div>• 아동 : 만 2세 ~ 12세</div>
                            <div>• 영유아 : 24개월 미만</div>
                            <div>• 기준인원 초과 시 추가요금: 성인 3만원, 학생 2만원, 아동 1만원</div>
                            <div>• 초과 인원 발생 시 저렴한 요금부터 자동 적용 (영유아는 2명까지 무료)</div>
                          </div>
                        </div>
                        
                        {/* 추가옵션 */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-3 text-gray-800 text-left">추가옵션</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="flex items-center text-sm">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedOptions.includes('bbq4')}
                                  onChange={() => handleOptionChange('bbq4')}
                                />
                                BBQ 숯&그릴 4인용 : 3만원
                              </label>
                              <label className="flex items-center text-sm">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedOptions.includes('bbq4plus')}
                                  onChange={() => handleOptionChange('bbq4plus')}
                                />
                                BBQ 숯&그릴 4인 이상 : 5만원
                              </label>
                              <label className="flex items-center text-sm">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedOptions.includes('hotwater1')}
                                  onChange={() => handleOptionChange('hotwater1')}
                                />
                                미온수(11/1~5/31) : 10만원
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="flex items-center text-sm">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedOptions.includes('hotwater2')}
                                  onChange={() => handleOptionChange('hotwater2')}
                                />
                                미온수(6/1~10/31) : 5만원
                              </label>
                              <label className="flex items-center text-sm">
                                <input 
                                  type="checkbox" 
                                  className="mr-2"
                                  checked={selectedOptions.includes('fireplace')}
                                  onChange={() => handleOptionChange('fireplace')}
                                />
                                벽난로(20pcs)
                              </label>
                            </div>
                          </div>
                          <div className="mt-6 text-xs text-black text-left">
                            <div>• 미온수 추가는 실내 수영장에만 가능합니다.</div>
                            <div>• 벽난로 옵션은 벽난로가 있는 객실만 가능합니다. (12월~3월)</div>
                          </div>
                        </div>
                        
                        {/* 고객요청사항 */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium mb-2 text-gray-800 text-left">고객요청사항</h4>
                          <textarea 
                            className="w-full p-3 border border-gray-300 text-sm h-24 resize-none" 
                            placeholder="요청사항을 입력해주세요"
                            value={customerRequest}
                            onChange={(e) => setCustomerRequest(e.target.value)}
                          ></textarea>
                        </div>
                        
                        {/* 전체동의 */}
                        <div className="mb-6">
                          <div className="flex items-center mb-3">
                            <input 
                              type="checkbox" 
                              className="mr-2"
                              checked={allTermsChecked}
                              onChange={handleAllTermsChange}
                            />
                            <h4 className="text-sm font-medium text-gray-800 text-left">전체동의</h4>
                          </div>
                          <hr className="mb-3 border-gray-300" />
                          <div className="space-y-2">
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.required1}
                                onChange={() => handleTermChange('required1')}
                              />
                              <span 
                                className="underline cursor-pointer hover:text-gray-700"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowTermsPopup({ isOpen: true, type: 'terms1' })
                                }}
                              >
                                숙박이용 규정 동의(필수)
                              </span>
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.required2}
                                onChange={() => handleTermChange('required2')}
                              />
                              <span 
                                className="underline cursor-pointer hover:text-gray-700"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowTermsPopup({ isOpen: true, type: 'terms2' })
                                }}
                              >
                                개인정보 수집 이용 동의(필수)
                              </span>
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.required3}
                                onChange={() => handleTermChange('required3')}
                              />
                              <span 
                                className="underline cursor-pointer hover:text-gray-700"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowTermsPopup({ isOpen: true, type: 'terms3' })
                                }}
                              >
                                개인정보 제3자 제공 동의(필수)
                              </span>
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.optional1}
                                onChange={() => handleTermChange('optional1')}
                              />
                              <span 
                                className="underline cursor-pointer hover:text-gray-700"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowTermsPopup({ isOpen: true, type: 'marketing' })
                                }}
                              >
                                마케팅 정보 수신 동의(선택)
                              </span>
                            </label>
                          </div>
                        </div>
                        
                        {/* 총 결제 금액 */}
                        <div className="mb-6 p-4 bg-gray-50">
                          <h4 className="text-sm font-medium mb-2 text-gray-800">총 결제 금액</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">객실요금</span>
                            <span className="text-sm">₩{selectedRoom?.price.toLocaleString() || '0'}</span>
                          </div>
                          
                          {/* 추가인원요금이 있을 때만 표시 */}
                          {calculateAdditionalFee() > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">추가인원요금</span>
                              <span className="text-sm">₩{calculateAdditionalFee().toLocaleString()}</span>
                            </div>
                          )}
                          
                          {/* 추가옵션요금이 있을 때만 표시 */}
                          {calculateOptionsFee() > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">추가옵션요금</span>
                              <span className="text-sm">₩{calculateOptionsFee().toLocaleString()}</span>
                            </div>
                          )}
                          
                          <hr className="my-2 border-gray-300" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-medium">총 결제금액</span>
                            <span className="text-lg font-bold text-red-500">
                              ₩{((selectedRoom?.price || 0) + calculateAdditionalFee() + calculateOptionsFee()).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* 버튼 */}
                        <div className="flex gap-4">
                          <button 
                            className="flex-1 py-3 bg-gray-400 text-white font-medium text-sm"
                            onClick={handleReset}
                          >
                            다시검색
                          </button>
                          <button 
                            className={`flex-1 py-3 font-medium text-sm ${
                              getFirstErrorMessage()
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'text-white'
                            }`}
                            style={getFirstErrorMessage() ? {} : {backgroundColor: '#134C59'}}
                            disabled={!!getFirstErrorMessage()}
                            onClick={async () => {
                              if (!getFirstErrorMessage()) {
                                const newReservationNumber = generateReservationNumber()
                                const reservationData = prepareReservationData(newReservationNumber)
                                const result = await saveReservation(reservationData)
                                
                                if (result.success) {
                                  setReservationNumber(newReservationNumber)
                                  setActiveStep(3)
                                } else {
                                  alert('예약 처리 중 오류가 발생했습니다.')
                                }
                              }
                            }}
                          >
                            결제
                          </button>
                        </div>
                        
                        {/* 오류 메시지 - 결제 버튼 밑에 하나만 표시 */}
                        {getFirstErrorMessage() && (
                          <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
                            {getFirstErrorMessage()}
                          </div>
                        )}
						{/* 팝업 모달 */}
                        {showTermsPopup.isOpen && showTermsPopup.type && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                              <div className="p-6 border-b">
                                <h2 className="text-xl font-bold">
                                  {showTermsPopup.type === 'terms1' && '예약 유의사항 및 취소규정 동의'}
                                  {showTermsPopup.type === 'terms2' && '개인정보 수집 이용 동의'}
                                  {showTermsPopup.type === 'terms3' && '제 3자에 대한 개인정보 제공'}
                                  {showTermsPopup.type === 'marketing' && '마케팅 정보 수신 동의'}
                                </h2>
                              </div>
                              <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-700 text-left">
                                {showTermsPopup.type === 'terms1' && (
                                  <div>
                                    <h5 className="font-bold mb-2">[예약 유의사항 및 취소규정 동의]</h5>
                                    <p className="mb-2">예약정보 하단에 기재된 취소 규정 및 예약 유의사항을 확인하였고, 이에 동의합니다.</p>
                                    <p className="mb-2">- 예약 및 결제 완료 후 해당 숙소의 취소규정이 적용됩니다.</p>
                                    <p className="mb-4">- 예약 유의사항에 동의하지 않을 경우 예약이 불가하며, 예약 취소 및 입실이 거절될 수 있습니다.</p>
                                    
                                    <h5 className="font-bold mb-2">[아동,청소년 보호법에 대한 동의]</h5>
                                    <p className="mb-2">예약자(투숙자) 본인을 포함하여 가족 이외의 미성년자 동반 입실 시 모든 법적 책임은 당사자에게 있습니다.</p>
                                    <p className="mb-2">또한, 이로 인해 영업정지, 과태료 등 당 사업장의 피해 발생 시 예약자(투숙자)에게 모든 손해배상 의무가 있음을 동의합니다.</p>
                                  </div>
                                )}
                                {showTermsPopup.type === 'terms2' && (
                                  <div>
                                    <h5 className="font-bold mb-2">[개인정보 수집 이용 동의]</h5>
                                    <p className="mb-2">큐브45 (이하 '회사'는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다. 회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.</p>
                                    <p className="mb-4">ο 본 방침은 : 2017 년 3 월 01일 부터 시행됩니다.</p>
                                    
                                    <h5 className="font-bold mb-2">개인정보 수집항목</h5>
                                    <p className="mb-2">1. 수집하는 개인정보 항목 및 수집방법</p>
                                    <p className="mb-2">가. 수집하는 개인정보의 항목</p>
                                    <p className="mb-2">1) 회사는 원활한 고객상담, 각종 서비스 제공을 위해 상품구매시 아래와 같은 최소한의 개인정보를 수집하고 있습니다.</p>
                                    <p className="mb-2">ο 구매자 - 이름, 이메일주소, 휴대폰 번호</p>
                                    <p className="mb-2">2) 서비스 이용과정이나 사업처리 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다.</p>
                                    <p className="mb-2">- IP Address, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</p>
                                    <p className="mb-2">나. 개인정보 수집방법 회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
                                    <p className="mb-2">ο 홈페이지를 통한 구매, 게시판작성</p>
                                    <p className="mb-4">ο 제휴사로부터의 제공</p>
                                    
                                    <h5 className="font-bold mb-2">개인정보의 수집 및 이용목적</h5>
                                    <p className="mb-2">2. 개인정보의 수집 및 이용목적</p>
                                    <p className="mb-2">회사는 수집한 개인정보를 아래의 목적을 위해 활용합니다.</p>
                                    <p className="mb-2">- 이름:서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용 방지와 비인가사용 방지 등 고객센터의 운영을 위하여 사용됩니다.</p>
                                    <p className="mb-2">- 이메일, 휴대폰 번호 : 고지사항 전달, 본인 의사확인, 불만처리 등 민원처리, 신상품, 이벤트 등 광고성정보안내 및 개인맞춤서비스를 제공 하기 위한 자료로 사용됩니다.</p>
                                    <p className="mb-2">- 이용자의 IP주소, 방문 일시 : 불량회원의 부정 이용방지와 비인가 사용방지, 서비스 이용에 대한 통계학적 분석에 사용됩니다.</p>
                                    <p className="mb-4">-그외의 선택항목 :개인맞춤서비스를 제공하기 위하여 사용됩니다.</p>
                                    
                                    <h5 className="font-bold mb-2">개인정보의 보유 및 이용기간</h5>
                                    <p className="mb-2">3. 개인정보의 보유 및 이용기간</p>
                                    <p className="mb-2">회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 원칙적으로 지체없이 파기합니다.</p>
                                    <p className="mb-2">다만, 아래의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.</p>
                                    <p className="mb-2">&lt; 내부 방침에 의한 정보보유 사유&gt;</p>
                                    <p className="mb-2">ο 회원 ID</p>
                                    <p className="mb-2">- 보존 이유 : 서비스 이용의 혼선방지</p>
                                    <p className="mb-2">- 보존 기간 : 사업종료시까지 &lt;관련법령에 의한 정보보유 사유&gt;</p>
                                    <p className="mb-2">- 계약 또는 청약철회 등에 관한 기록: 5년</p>
                                    <p className="mb-2">- 대금결제 및 재화 등의 공급에 관한 기록: 5년</p>
                                    <p className="mb-2">- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년</p>
                                    <p className="mb-2">- 보유기간을 이용자에게 미리 고지하거나 개별적으로 이용자의 동의를 받은 경우: 고지하거나 개별 동의한 기간</p>
                                  </div>
                                )}
                                {showTermsPopup.type === 'terms3' && (
                                  <div>
                                    <h5 className="font-bold mb-2">[제 3자에 대한 개인정보 제공]</h5>
                                    <p className="mb-2">큐브45는(은) 공정거래위원회 인증 전자상거래 표준약관을 준수하고 있으며, 이용하시려면 아래 개인정보의 수집 및 제공에 동의하셔야 합니다.</p>
                                    <p className="mb-2">제공받는자 : (주)브래드포럼</p>
                                    <p className="mb-2">개인정보 이용목적 : 본인확인 및 숙소 확인</p>
                                    <p className="mb-2">제공하는 개인정보 : 구매자명, 사용자명, 이메일주소, 휴대폰번호</p>
                                    <p className="mb-2">보유기간 : 계약 또는 청약철회 등에 관한 기록 - 5년</p>
                                  </div>
                                )}
                                {showTermsPopup.type === 'marketing' && (
                                  <div>
                                    <h5 className="font-bold mb-2">마케팅 정보 수신 동의</h5>
                                    <p className="mb-4">큐브45 풀빌라에서 제공하는 이벤트/혜택 등 다양한 정보를 휴대전화(문자), 이메일로 받아보실 수 있습니다.</p>
                                    
                                    <h5 className="font-bold mb-2">수신 정보</h5>
                                    <p className="mb-2">• 할인 쿠폰 및 프로모션 안내</p>
                                    <p className="mb-2">• 신규 시설 및 서비스 안내</p>
                                    <p className="mb-2">• 이벤트 및 행사 정보</p>
                                    <p className="mb-4">• 계절별 특별 패키지 안내</p>
                                    
                                    <h5 className="font-bold mb-2">수신 방법</h5>
                                    <p className="mb-2">• SMS/MMS</p>
                                    <p className="mb-4">• 이메일</p>
                                    
                                    <h5 className="font-bold mb-2">동의 철회</h5>
                                    <p className="mb-2">마케팅 정보 수신 동의는 언제든지 철회할 수 있습니다.</p>
                                    <p className="mb-2">고객센터 또는 수신된 메시지의 수신거부 링크를 통해 철회 가능합니다.</p>
                                  </div>
                                )}
                              </div>
                              <div className="p-6 border-t">
                                <button
                                  className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                                  onClick={() => setShowTermsPopup({ isOpen: false, type: null })}
                                >
                                  닫기
                                </button>
                              </div>
                            </div>
                          </div>
                        )}  
                      </div>
                    </div>
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="flex justify-center mb-6">
                    <div className="w-[750px] bg-gray-50 p-8">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-medium mb-2">예약완료</h2>
                        <p className="text-gray-600">구매해 주셔서 감사합니다.</p>
                      </div>
                      
                      {/* 예약 정보 표 */}
                      <div className="mb-8">
                        <div className="grid border-b border-gray-300 border-t-2 border-t-black" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">예약번호</div>
                          <div className="p-3 text-left pl-8">{reservationNumber}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">객실명</div>
                          <div className="p-3 text-left pl-8">{selectedRoom?.name || '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left flex items-center">추가옵션</div>
                          <div className="p-3 flex items-center text-left pl-8">
                            {selectedOptions.length > 0 ? 
                              selectedOptions.map(option => {
                                const optionNames = {
                                  'bbq4': 'BBQ 숯&그릴 4인용',
                                  'bbq4plus': 'BBQ 숯&그릴 4인 이상',
                                  'hotwater1': '미온수(11/1~5/31)',
                                  'hotwater2': '미온수(6/1~10/31)',
                                  'fireplace': '벽난로(20pcs)'
                                }
                                return optionNames[option as keyof typeof optionNames]
                              }).join(', ') : '없음'
                            }
                          </div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">객실수</div>
                          <div className="p-3 text-left pl-8">1</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">체크인</div>
                          <div className="p-3 text-left pl-8">{checkInDate ? `${checkInDate.getFullYear()}-${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}-${checkInDate.getDate().toString().padStart(2, '0')}` : '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">체크아웃</div>
                          <div className="p-3 text-left pl-8">{checkOutDate ? `${checkOutDate.getFullYear()}-${(checkOutDate.getMonth() + 1).toString().padStart(2, '0')}-${checkOutDate.getDate().toString().padStart(2, '0')}` : '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">구매자</div>
                          <div className="p-3 text-left pl-8">{bookerInfo.name || '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">구매자 연락처</div>
                          <div className="p-3 text-left pl-8">{bookerInfo.phone || '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">구매자 이메일</div>
                          <div className="p-3 text-left pl-8">{bookerInfo.email || '--'}</div>
                        </div>
                        
                        {/* 투숙자 정보는 체크박스 체크했을 때만 표시 */}
                        {isDifferentGuest && (
                          <>
                            <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                              <div className="bg-gray-100 p-3 pl-6 font-medium text-left">투숙자</div>
                              <div className="p-3 text-left pl-8">{guestInfo.name || '--'}</div>
                            </div>
                            <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                              <div className="bg-gray-100 p-3 pl-6 font-medium text-left">투숙자 연락처</div>
                              <div className="p-3 text-left pl-8">{guestInfo.phone || '--'}</div>
                            </div>
                            <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                              <div className="bg-gray-100 p-3 pl-6 font-medium text-left">투숙자 이메일</div>
                              <div className="p-3 text-left pl-8">{guestInfo.email || '--'}</div>
                            </div>
                          </>
                        )}
						  
						{/* 고객요청사항 - 새로 추가 */}
						<div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
						  <div className="bg-gray-100 p-3 pl-6 font-medium text-left">고객요청사항</div>
						  <div className="p-3 text-left pl-8">{customerRequest || '없음'}</div>
						</div>  
                        
                        <div className="grid" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">결제금액</div>
                          <div className="p-3 text-red-500 font-bold text-left pl-8">
                            ₩{((selectedRoom?.price || 0) + calculateAdditionalFee() + calculateOptionsFee()).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* 하단 버튼 */}
                      <div className="flex gap-4 justify-center">
                        <button 
                          className="px-8 py-3 bg-gray-500 text-white font-medium"
                          onClick={() => window.location.href = '/'}
                        >
                          메인으로
                        </button>
                        <button 
                          className="px-8 py-3 text-white font-medium"
                          style={{backgroundColor: '#134C59'}}
                          onClick={() => {
                            if (confirm('정말 예약을 취소하시겠습니까?')) {
                              window.location.href = '/'
                            }
                          }}
                        >
                          취소하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* 푸터 */}
      <Footer />
    </div>
  )
}