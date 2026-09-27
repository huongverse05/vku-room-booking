export type RoomType = 'Lab' | 'Classroom' | 'Conference' | 'StudySpace';

export interface Room {
  id: string;
  name: string;
  building: string; // 'Khu A', 'Khu V', 'Khu K', 'Thư viện'
  floor: string;
  capacity: number;
  type: RoomType;
  equipment: string[];
  status: 'available' | 'busy' | 'maintenance';
  imageUrl: string;
  rating: number;
  description: string;
  availableSlots: string[];
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: string;
  floor: string;
  date: string;
  timeSlot: string;
  userName: string;
  studentId: string;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
  ticketCode: string;
}

export interface UserProfile {
  studentId: string;
  fullName: string;
  email: string;
  faculty: string;
  major: string;
  academicYear: string;
  avatarUrl: string;
}
