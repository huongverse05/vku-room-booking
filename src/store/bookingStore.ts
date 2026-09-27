import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '../types';

export interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  clearAllBookings: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [], // Sạch sẽ, không có dữ liệu test ban đầu
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
