import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/bookingStore';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';
import { COLORS, SHADOWS } from '../constants/theme';
import { MyBookingsScreenProps } from '../navigation/types';
import { Booking } from '../types';

export function MyBookingsScreen({ navigation }: MyBookingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [filterTab, setFilterTab] = useState<'active' | 'history'>('active');
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Slide 13: GOOD: Select only what you need
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  // Filter lists
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const historyBookings = bookings.filter((b) => b.status === 'cancelled');

  const displayedList = filterTab === 'active' ? activeBookings : historyBookings;

  const handleRequestCancel = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    const roomName = bookingToCancel.roomName;
    cancelBooking(bookingToCancel.id);
    setBookingToCancel(null);
    setToastNotice(`Đã hủy lịch phòng: ${roomName}`);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setToastNotice(null);
    }, 4000);
  };

  const handleDismissModal = () => {
    setBookingToCancel(null);
  };

  const handleViewPass = (bookingId: string) => {
    navigation.navigate('BookingConfirmation', { bookingId });
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Lịch Đặt Phòng Của Tôi</Text>
          <Text style={styles.subtitle}>
            Quản lý các phòng học và lab bạn đã đăng ký tại VKU
          </Text>
        </View>

        <TouchableOpacity
          style={styles.newBookingBtn}
          onPress={() => navigation.navigate('BrowseRooms')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Segment Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'active' && styles.tabBtnActive]}
          onPress={() => setFilterTab('active')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabBtnText,
              filterTab === 'active' && styles.tabBtnTextActive,
            ]}
          >
            Đang hoạt động ({activeBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'history' && styles.tabBtnActive]}
          onPress={() => setFilterTab('history')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabBtnText,
              filterTab === 'history' && styles.tabBtnTextActive,
            ]}
          >
            Đã hủy / Lịch sử ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notice after cancellation */}
      {toastNotice && (
        <View style={styles.toastBanner}>
          <View style={styles.toastLeft}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.toastText} numberOfLines={1}>
              {toastNotice}
            </Text>
          </View>
          {filterTab === 'active' && (
            <TouchableOpacity
              style={styles.toastActionBtn}
              onPress={() => {
                setFilterTab('history');
                setToastNotice(null);
              }}
            >
              <Text style={styles.toastActionText}>Xem mục Đã hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Hint for Swipe to Cancel on Active Tab */}
      {filterTab === 'active' && activeBookings.length > 0 && !toastNotice && (
        <View style={styles.swipeTipBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.swipeTipText}>
            Mẹo: Nhấn nút &quot;Hủy phòng&quot; hoặc vuốt thẻ sang trái để hủy đặt phòng nhanh.
          </Text>
        </View>
      )}

      {/* Bookings List (Slide 13 implementation) */}
      <FlatList
        data={displayedList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onCancel={() => handleRequestCancel(item)}
            onViewPass={() => handleViewPass(item.id)}
            showSwipe={filterTab === 'active'}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            message={
              filterTab === 'active'
                ? 'Không có lịch đặt phòng nào'
                : 'Chưa có lịch sử hủy phòng'
            }
            subMessage={
              filterTab === 'active'
                ? 'Bạn chưa đăng ký sử dụng phòng nào trong tuần này.'
                : 'Các lượt đặt phòng đã hủy sẽ xuất hiện tại đây.'
            }
            icon="calendar-outline"
          />
        }
      />

      {/* Cross-Platform Cancellation Confirmation Modal */}
      <Modal
        visible={!!bookingToCancel}
        transparent
        animationType="fade"
        onRequestClose={handleDismissModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleDismissModal}
          />
          <View style={styles.modalContent}>
            {/* Modal Header Icon */}
            <View style={styles.modalIconBox}>
              <Ionicons name="alert-circle" size={36} color={COLORS.danger} />
            </View>

            <Text style={styles.modalTitle}>Xác nhận hủy đặt phòng</Text>
            <Text style={styles.modalSub}>
              Bạn có chắc chắn muốn hủy lịch sử dụng phòng học này tại VKU không?
            </Text>

            {/* Room Info Preview */}
            {bookingToCancel && (
              <View style={styles.modalRoomPreview}>
                <Text style={styles.modalRoomName}>{bookingToCancel.roomName}</Text>
                <View style={styles.modalMetaRow}>
                  <Ionicons name="business-outline" size={13} color={COLORS.accent} />
                  <Text style={styles.modalMetaText}>
                    {bookingToCancel.building} • {bookingToCancel.floor}
                  </Text>
                </View>
                <View style={styles.modalMetaRow}>
                  <Ionicons name="calendar-outline" size={13} color={COLORS.accent} />
                  <Text style={styles.modalMetaText}>{bookingToCancel.date}</Text>
                  <Text style={styles.modalMetaDot}>•</Text>
                  <Text style={styles.modalTimeText}>{bookingToCancel.timeSlot}</Text>
                </View>
                <View style={styles.modalTicketRow}>
                  <Text style={styles.modalTicketLabel}>Mã vé:</Text>
                  <Text style={styles.modalTicketCode}>{bookingToCancel.ticketCode}</Text>
                </View>
              </View>
            )}

            <Text style={styles.modalNotice}>
              Sau khi hủy, thông tin đặt phòng sẽ được chuyển sang mục lịch sử và nhường chỗ cho sinh viên khác.
            </Text>

            {/* Action Buttons */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalKeepBtn}
                onPress={handleDismissModal}
                activeOpacity={0.8}
              >
                <Text style={styles.modalKeepBtnText}>Giữ lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmCancel}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.white} />
                <Text style={styles.modalConfirmBtnText}>Hủy phòng này</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  newBookingBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: COLORS.cardBg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  swipeTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  swipeTipText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 8,
  },
  toastLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toastText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  toastActionBtn: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toastActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  listContent: {
    paddingBottom: 24,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  modalIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalRoomPreview: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },
  modalRoomName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  modalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  modalMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalMetaDot: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  modalTimeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalTicketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalTicketLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  modalTicketCode: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalNotice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  modalKeepBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalKeepBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalConfirmBtn: {
    flex: 1.3,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.md,
  },
  modalConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
});
