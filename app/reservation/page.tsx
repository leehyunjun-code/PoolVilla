'use client'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState } from 'react'

export default function LocationPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [firstDate, setFirstDate] = useState<number | null>(null)
  const [secondDate, setSecondDate] = useState<number | null>(null)
  const [currentYear, setCurrentYear] = useState(2025)
  const [currentMonth, setCurrentMonth] = useState(9)
  const [nights, setNights] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showRoomResults, setShowRoomResults] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState('전체')
  const [visibleRooms, setVisibleRooms] = useState(3)
  const [selectedRoom, setSelectedRoom] = useState<Record<string, unknown> | null>(null)
  const [searchAdults, setSearchAdults] = useState(2)
  const [searchChildren, setSearchChildren] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [isDifferentGuest, setIsDifferentGuest] = useState(false)
  const [adultCount, setAdultCount] = useState<number>(0)
  const [studentCount, setStudentCount] = useState<number>(0) 
  const [childCount, setChildCount] = useState<number>(0)
  const [infantCount, setInfantCount] = useState<number>(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  
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
  
  // 예약번호 생성 함수 (수정된 버전)
  const generateReservationNumber = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2) // 25
    const month = (now.getMonth() + 1).toString().padStart(2, '0') // 09
    const day = now.getDate().toString().padStart(2, '0') // 07
    
    // 4자리 랜덤 숫자 생성 (0000~9999)
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    
    return `S${year}${month}${day}${randomNum}`
  }

  const handleDateClick = (date: number) => {
    if (!firstDate) {
      setFirstDate(date)
    } else if (!secondDate) {
      setSecondDate(date)
    } else {
      // 두 날짜가 모두 있으면 리셋하고 새로 시작
      setFirstDate(date)
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
    // 월이 바뀌면 선택된 날짜 리셋
    setFirstDate(null)
    setSecondDate(null)
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    // 월이 바뀌면 선택된 날짜 리셋
    setFirstDate(null)
    setSecondDate(null)
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ]

  // 체크인/체크아웃 날짜 계산 (더 빠른 날짜가 체크인)
  const checkInDate = firstDate && secondDate ? Math.min(firstDate, secondDate) : firstDate
  const checkOutDate = firstDate && secondDate ? Math.max(firstDate, secondDate) : secondDate
  
  // 숙박일 계산 함수
  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      return Math.abs(checkOutDate - checkInDate)
    }
    return 1
  }

  const isDateInRange = (date: number) => {
    if (!checkInDate || !checkOutDate) return false
    return date > checkInDate && date < checkOutDate
  }
  
  const isDateSelected = (date: number) => {
    return date === checkInDate || date === checkOutDate
  }

  // 객실 데이터 정의
  const allRooms = [
    { id: 'A3', name: 'A3호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 45, petFriendly: false, price: 200000 },
    { id: 'A4', name: 'A4호 풀빌라 독채 실내수영장', rooms: 3, bathrooms: 2, minGuests: 6, maxGuests: 10, size: 68, petFriendly: false, price: 200000 },
    { id: 'A5', name: 'A5호 풀빌라 독채 야외수영장', rooms: 3, bathrooms: 2, minGuests: 6, maxGuests: 10, size: 60, petFriendly: false, price: 200000 },
    { id: 'A6', name: 'A6호 풀빌라 독채 야외수영장', rooms: 3, bathrooms: 2, minGuests: 6, maxGuests: 10, size: 60, petFriendly: false, price: 200000 },
    { id: 'A7', name: 'A7호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 6, maxGuests: 10, size: 64, petFriendly: false, price: 200000 },
    { id: 'B9', name: 'B9호 풀빌라 독채 야외수영장', rooms: 4, bathrooms: 2, minGuests: 8, maxGuests: 12, size: 64, petFriendly: false, price: 200000 },
    { id: 'B10', name: 'B10호 풀빌라 독채 실내수영장', rooms: 4, bathrooms: 2, minGuests: 8, maxGuests: 12, size: 72, petFriendly: false, price: 200000 },
    { id: 'B11', name: 'B11호 풀빌라 독채 실내수영장', rooms: 3, bathrooms: 2, minGuests: 8, maxGuests: 12, size: 72, petFriendly: false, price: 200000 },
    { id: 'B12', name: 'B12호 풀빌라 독채', rooms: 4, bathrooms: 2, minGuests: 8, maxGuests: 12, size: 70, petFriendly: false, price: 200000 },
    // C동 (C13~C25)
    { id: 'C13', name: 'C13호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C14', name: 'C14호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C15', name: 'C15호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C16', name: 'C16호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C17', name: 'C17호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C18', name: 'C18호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 2, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C19', name: 'C19호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 2, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C20', name: 'C20호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 2, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C21', name: 'C21호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 2, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C22', name: 'C22호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C23', name: 'C23호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C24', name: 'C24호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    { id: 'C25', name: 'C25호 풀빌라 독채 실내수영장', rooms: 2, bathrooms: 2, minGuests: 4, maxGuests: 8, size: 35, petFriendly: true, price: 200000 },
    
    // D동 (D1~D15)
    { id: 'D1', name: 'D1호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D2', name: 'D2호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D3', name: 'D3호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D4', name: 'D4호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D5', name: 'D5호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D6', name: 'D6호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D7', name: 'D7호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D8', name: 'D8호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D9', name: 'D9호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D10', name: 'D10호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D11', name: 'D11호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D12', name: 'D12호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D13', name: 'D13호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D14', name: 'D14호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 },
    { id: 'D15', name: 'D15호 풀빌라 독채 실내수영장', rooms: 1, bathrooms: 2, minGuests: 2, maxGuests: 4, size: 23, petFriendly: true, price: 200000 }
  ]

  const getFilteredRooms = () => {
    let rooms = allRooms
    
    // 동별 필터링
    if (selectedBuilding !== '전체') {
      if (selectedBuilding === 'A동') rooms = rooms.filter(room => room.id.startsWith('A'))
      if (selectedBuilding === 'B동') rooms = rooms.filter(room => room.id.startsWith('B'))
      if (selectedBuilding === 'C동') rooms = rooms.filter(room => room.id.startsWith('C'))
      if (selectedBuilding === 'D동') rooms = rooms.filter(room => room.id.startsWith('D'))
    }
    
    // 인원수 필터링 (검색용 state 사용)
    const totalGuests = searchAdults + searchChildren
    rooms = rooms.filter(room => room.maxGuests >= totalGuests)
    
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
    const baseCapacity = (selectedRoom as any).minGuests
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
    setSelectedOptions(prev => 
      prev.includes(optionKey)
        ? prev.filter(key => key !== optionKey)
        : [...prev, optionKey]
    )
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
  const handleTermChange = (termKey: string) => {
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
                    onClick={() => setActiveStep(1)}
                    className={`w-80 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeStep === 1
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    01 객실선택
                  </button>
                  
                  {/* 02 정보입력 - 객실 선택 완료 시에만 활성화 */}
                  <button
                    onClick={() => {
                      if (selectedRoom) {
                        setActiveStep(2)
                      } else {
                        alert('먼저 객실을 선택해주세요.')
                      }
                    }}
                    className={`w-80 py-3 text-sm font-medium transition-colors duration-200 ${
                      activeStep === 2
                        ? 'bg-black text-white'
                        : selectedRoom 
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!selectedRoom}
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
                            ? `예약일자 ${currentYear}. ${currentMonth.toString().padStart(2, '0')}. ${checkInDate.toString().padStart(2, '0')}~ ${checkOutDate.toString().padStart(2, '0')}`
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
                          <div className="p-1"></div>
                          {[1,2,3,4,5,6].map(date => (
                            <div 
                              key={date} 
                              className={`p-1 cursor-pointer hover:bg-gray-200 ${
                                isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                isDateInRange(date) ? 'bg-blue-200' : ''
                              }`} 
                              onClick={() => handleDateClick(date)}
                            >
                              {date.toString().padStart(2, '0')}
                            </div>
                          ))}
                          
                          {[7,8,9,10,11,12,13].map(date => (
                            <div 
                              key={date} 
                              className={`p-1 cursor-pointer hover:bg-gray-200 ${
                                isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                isDateInRange(date) ? 'bg-blue-200' : ''
                              }`} 
                              onClick={() => handleDateClick(date)}
                            >
                              {date}
                            </div>
                          ))}
                          
                          {[14,15,16,17,18,19,20].map(date => (
                            <div 
                              key={date} 
                              className={`p-1 cursor-pointer hover:bg-gray-200 ${
                                isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                isDateInRange(date) ? 'bg-blue-200' : ''
                              }`} 
                              onClick={() => handleDateClick(date)}
                            >
                              {date}
                            </div>
                          ))}
                          
                          {[21,22,23,24,25,26,27].map(date => (
                            <div 
                              key={date} 
                              className={`p-1 cursor-pointer hover:bg-gray-200 ${
                                isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                isDateInRange(date) ? 'bg-blue-200' : ''
                              }`} 
                              onClick={() => handleDateClick(date)}
                            >
                              {date}
                            </div>
                          ))}
                          
                          {[28,29,30].map(date => (
                            <div 
                              key={date} 
                              className={`p-1 cursor-pointer hover:bg-gray-200 ${
                                isDateSelected(date) ? 'bg-blue-500 text-white rounded-full' : 
                                isDateInRange(date) ? 'bg-blue-200' : ''
                              }`} 
                              onClick={() => handleDateClick(date)}
                            >
                              {date}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 체크인 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">체크인</span>
                          <span className="text-gray-800">{checkInDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkInDate.toString().padStart(2, '0')}` : '--'}</span>
                        </div>
                      </div>
                      
                      {/* 체크아웃 */}
                      <div className="mb-3">
                        <div className="w-full p-2 bg-gray-50 text-xs flex justify-between">
                          <span className="text-gray-600">체크아웃</span>
                          <span className="text-gray-800">{checkOutDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkOutDate.toString().padStart(2, '0')}` : '--'}</span>
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
                        disabled={isSearching}
                        onClick={() => {
                          setIsSearching(true)
                          setShowRoomResults(false) // 기존 결과 숨기기
                          setTimeout(() => {
                            setShowRoomResults(true) // 새 결과 보여주기
                            setSelectedBuilding('전체')
                            setVisibleRooms(3)
                            setSearchAdults(adults)
                            setSearchChildren(children)
                            setIsSearching(false)
                          }, 500)
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
                                onClick={() => {
                                  setSelectedBuilding(building)
                                  setVisibleRooms(3)
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
                          {getFilteredRooms().length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-gray-500 mb-4">검색된 객실이 없습니다</p>
                              <button 
                                className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium text-sm transition-colors duration-200"
                                onClick={() => {
                                  setAdults(2)
                                  setChildren(0)
                                  setSelectedBuilding('전체')
                                }}
                              >
                                검색 조건 초기화
                              </button>
                            </div>
                          ) : (
                            <>
                              {getFilteredRooms().slice(0, visibleRooms).map((room) => (
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
                              {getFilteredRooms().length > visibleRooms && (
                                <div className="flex justify-center mt-4">
                                  <button
                                    onClick={() => setVisibleRooms(visibleRooms + 3)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium text-sm transition-colors duration-200"
                                  >
                                    더보기 ({getFilteredRooms().length - visibleRooms}개 더)
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
                            <div className="mb-1">체크인 : {checkInDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkInDate.toString().padStart(2, '0')}` : '--'}</div>
                            <div className="mb-1">체크아웃 : {checkOutDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkOutDate.toString().padStart(2, '0')}` : '--'}</div>
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
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="구매자 이름"
                              value={bookerInfo.name}
                              onChange={(e) => setBookerInfo(prev => ({...prev, name: e.target.value}))}
                            />
                          </div>
                          <div>
                            <input 
                              type="email" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="구매자 이메일"
                              value={bookerInfo.email}
                              onChange={(e) => setBookerInfo(prev => ({...prev, email: e.target.value}))}
                            />
                          </div>
                          <div>
                            <input 
                              type="text" 
                              className="w-full p-2 border border-gray-300 text-sm" 
                              placeholder="구매자 전화번호"
                              value={bookerInfo.phone}
                              onChange={(e) => setBookerInfo(prev => ({...prev, phone: e.target.value}))}
                            />
                          </div>
                        </div>
                      
                        {/* 투숙자 정보 - 체크박스 선택 시에만 표시 */}
                        {isDifferentGuest && (
                          <>
                            <h3 className="text-sm font-medium text-gray-800 text-left mb-6">투숙자 정보</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="투숙자 이름"
                                  value={guestInfo.name}
                                  onChange={(e) => setGuestInfo(prev => ({...prev, name: e.target.value}))}
                                />
                              </div>
                              <div>
                                <input 
                                  type="email" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="투숙자 이메일"
                                  value={guestInfo.email}
                                  onChange={(e) => setGuestInfo(prev => ({...prev, email: e.target.value}))}
                                />
                              </div>
                              <div>
                                <input 
                                  type="text" 
                                  className="w-full p-2 border border-gray-300 text-sm" 
                                  placeholder="투숙자 전화번호"
                                  value={guestInfo.phone}
                                  onChange={(e) => setGuestInfo(prev => ({...prev, phone: e.target.value}))}
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
                              숙박이용 규정 동의(필수)
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.required2}
                                onChange={() => handleTermChange('required2')}
                              />
                              개인정보 수집 이용 동의(필수)
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.required3}
                                onChange={() => handleTermChange('required3')}
                              />
                              개인정보 제3자 제공 동의(필수)
                            </label>
                            <label className="flex items-center text-sm text-gray-500">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={termsChecked.optional1}
                                onChange={() => handleTermChange('optional1')}
                              />
                              마케팅 정보 수신 동의(선택)
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
                            onClick={() => {
                              if (!getFirstErrorMessage()) {
                                setReservationNumber(generateReservationNumber())
                                setActiveStep(3)
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
                          <div className="bg-gray-100 p-3 pl-8 font-medium text-left flex items-center">추가옵션</div>
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
                                return optionNames[option]
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
                          <div className="p-3 text-left pl-8">{checkInDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkInDate.toString().padStart(2, '0')}` : '--'}</div>
                        </div>
                        <div className="grid border-b border-gray-300" style={{gridTemplateColumns: '30% 70%'}}>
                          <div className="bg-gray-100 p-3 pl-6 font-medium text-left">체크아웃</div>
                          <div className="p-3 text-left pl-8">{checkOutDate ? `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${checkOutDate.toString().padStart(2, '0')}` : '--'}</div>
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