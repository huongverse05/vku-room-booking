import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

export interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  clearAllBookings?: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [
        // Seed initial booking for a realistic demo
        {
          id: 'vku-bk-1001',
          roomId: 'room-a202',
          roomName: 'Phòng Hội thảo Smart Meeting A202',
          building: 'Khu A',
          floor: 'Tầng 2',
          date: '2026-09-29',
          timeSlot: '13:00 - 15:15 (Tiết 7-9)',
          userName: 'Nguyễn Văn An',
          studentId: '22IT089',
          purpose: 'Báo cáo tiến độ đồ án tốt nghiệp Khóa 2022',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          ticketCode: 'VKU-PASS-A202-99',
        },
      ],
      addBooking: (b: Booking) =>
        set((s) => ({ bookings: [b, ...s.bookings] })),
      cancelBooking: (id: string) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' as const } : b
          ),
        })),
      clearAllBookings: () => set({ bookings: [] }),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
