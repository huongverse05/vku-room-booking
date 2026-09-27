import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoomDetailsProps } from '../navigation/types';
import { VKU_ROOMS, TIME_SLOTS, INITIAL_USER } from '../constants/mockData';
import { BookButton } from '../components/BookButton';
import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';

export function RoomDetailsScreen({ route, navigation }: RoomDetailsProps) {
  // Slide 6: Type-safe route params
  const { roomId, roomName } = route.params;

  // Retrieve room info
  const room = VKU_ROOMS.find((r) => r.id === roomId) || {
    id: roomId,
    name: roomName,
    building: 'Khu A',
    floor: 'Tầng 1',
    capacity: 40,
    type: 'Classroom',
    equipment: ['Máy chiếu', 'Điều hòa', 'Bảng trắng'],
    status: 'available',
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    description: 'Phòng học tiện nghi tiêu chuẩn tại khuôn viên VKU.',
    availableSlots: TIME_SLOTS,
  };

  // Zustand action selector (Slide 12 & 13)
  const addBooking = useBookingStore((s) => s.addBooking);

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-28');
  const [selectedSlot, setSelectedSlot] = useState<string>(
    room.availableSlots[0] || TIME_SLOTS[0]
  );
  const [purpose, setPurpose] = useState<string>('Học nhóm & Thuyết trình chuyên đề');
  const [studentId, setStudentId] = useState<string>(INITIAL_USER.studentId);
  const [studentName, setStudentName] = useState<string>(INITIAL_USER.fullName);

  const dates = [
    { label: 'Hôm nay', value: '2026-09-28', sub: 'Thứ Hai' },
    { label: 'Ngày mai', value: '2026-09-29', sub: 'Thứ Ba' },
    { label: '30/09', value: '2026-09-30', sub: 'Thứ Tư' },
    { label: '01/10', value: '2026-10-01', sub: 'Thứ Năm' },
  ];

  const handleConfirmBooking = () => {
    if (!studentId.trim() || !studentName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Mã sinh viên và Họ tên.');
      return;
    }

    if (!selectedSlot) {
      Alert.alert('Chưa chọn ca học', 'Vui lòng chọn một ca thời gian khả dụng.');
      return;
    }

    const bookingId = `vku-bk-${Date.now().toString().slice(-6)}`;
    const ticketCode = `VKU-${room.building.replace(/\s+/g, '')}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const newBooking: Booking = {
      id: bookingId,
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      date: selectedDate,
      timeSlot: selectedSlot,
      userName: studentName.trim(),
      studentId: studentId.trim(),
      purpose: purpose.trim() || 'Học tập & Nghiên cứu tại VKU',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ticketCode,
    };

    // Add to Zustand persistent store
    addBooking(newBooking);

    // Navigate to BookingConfirmationScreen (Modal Presentation per Slide 7)
    navigation.navigate('BookingConfirmation', { bookingId });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Room Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlayBadgeRow}>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      room.status === 'available' ? COLORS.success : COLORS.danger,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {room.status === 'available' ? 'Sẵn sàng đặt' : 'Bận'}
              </Text>
            </View>

            <View style={styles.ratingPill}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{room.rating.toFixed(1)} / 5.0</Text>
            </View>
          </View>
        </View>

        {/* Room Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.locationRow}>
            <View style={styles.badgeKhu}>
              <Ionicons name="business" size={14} color={COLORS.primary} />
              <Text style={styles.badgeKhuText}>{room.building}</Text>
            </View>
            <Text style={styles.floorText}>• {room.floor}</Text>
            <View style={styles.capacityBadge}>
              <Ionicons name="people" size={14} color={COLORS.textSecondary} />
              <Text style={styles.capacityText}>{room.capacity} chỗ</Text>
            </View>
          </View>

          <Text style={styles.title}>{room.name}</Text>
          <Text style={styles.description}>{room.description}</Text>
        </View>

        {/* Facilities & Equipment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trang thiết bị phòng</Text>
          <View style={styles.equipGrid}>
            {room.equipment.map((item, idx) => (
              <View key={idx} style={styles.equipItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={COLORS.success}
                />
                <Text style={styles.equipItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking Form: Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Chọn ngày sử dụng</Text>
          <View style={styles.datesRow}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[
                  styles.dateCard,
                  selectedDate === d.value && styles.dateCardActive,
                ]}
                onPress={() => setSelectedDate(d.value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.dateLabel,
                    selectedDate === d.value && styles.dateLabelActive,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    styles.dateSub,
                    selectedDate === d.value && styles.dateSubActive,
                  ]}
                >
                  {d.sub}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Booking Form: Select Slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Chọn ca thời gian khả dụng</Text>
          <View style={styles.slotsContainer}>
            {TIME_SLOTS.map((slot) => {
              const isAvailable = room.availableSlots.includes(slot);
              const isSelected = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  disabled={!isAvailable}
                  style={[
                    styles.slotBtn,
                    isSelected && styles.slotBtnSelected,
                    !isAvailable && styles.slotBtnDisabled,
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={
                      isSelected
                        ? 'radio-button-on'
                        : isAvailable
                        ? 'radio-button-off'
                        : 'lock-closed'
                    }
                    size={16}
                    color={
                      isSelected
                        ? COLORS.primary
                        : isAvailable
                        ? COLORS.textSecondary
                        : COLORS.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.slotBtnText,
                      isSelected && styles.slotBtnTextSelected,
                      !isAvailable && styles.slotBtnTextDisabled,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Booking Form: Student Information & Purpose */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Thông tin người đặt</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mã sinh viên VKU</Text>
            <TextInput
              style={styles.textInput}
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Ví dụ: 22IT089"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên</Text>
            <TextInput
              style={styles.textInput}
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Nguyễn Văn An"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mục đích sử dụng phòng</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={purpose}
              onChangeText={setPurpose}
              multiline
              numberOfLines={2}
              placeholder="Học nhóm, luyện thuyết trình, nghiên cứu đồ án..."
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar with Custom Animated BookButton (Slide 23) */}
      <View style={styles.bottomBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.priceLabel}>Quyền lợi SV VKU</Text>
          <Text style={styles.priceValue}>Miễn phí 100%</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <BookButton
            title="Xác nhận Đặt phòng"
            icon="calendar"
            onPress={handleConfirmBooking}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayBadgeRow: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  headerInfo: {
    padding: 18,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  badgeKhu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeKhuText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  floorText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 4,
  },
  capacityText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginTop: 14,
    padding: 18,
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  equipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  equipItemText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateCard: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primary,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  dateLabelActive: {
    color: COLORS.primary,
  },
  dateSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  dateSubActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  slotsContainer: {
    gap: 8,
  },
  slotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  slotBtnSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: COLORS.primary,
  },
  slotBtnDisabled: {
    opacity: 0.45,
    backgroundColor: '#F1F5F9',
  },
  slotBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  slotBtnTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  slotBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  priceSummary: {
    marginRight: 16,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.success,
  },
  buttonWrapper: {
    flex: 1,
  },
});
