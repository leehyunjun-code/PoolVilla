import { supabase } from '@/lib/supabase'

// 예약자 이름과 전화번호로 예약 조회
export const getReservationByNameAndPhone = async (bookerName, bookerPhone) => {
  try {
    const { data, error } = await supabase
      .from('cube45_reservations')
      .select('*')
      .eq('booker_name', bookerName)
      .eq('booker_phone', bookerPhone)
      .eq('status', 'confirmed')

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('예약 조회 실패:', error)
    return { success: false, error }
  }
}

// 예약 취소
export const cancelReservationByInfo = async (bookerName, bookerPhone) => {
  try {
    const { data, error } = await supabase
      .from('cube45_reservations')
      .update({ status: 'cancelled' })
      .eq('booker_name', bookerName)
      .eq('booker_phone', bookerPhone)
      .eq('status', 'confirmed')
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('예약 취소 실패:', error)
    return { success: false, error }
  }
}