import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookingConfirmationProps } from '../navigation/types';
import { useBookingStore } from '../store/bookingStore';
import { COLORS, SHADOWS } from '../constants/theme';

export function BookingConfirmationScreen({
  route,
  navigation,
}: BookingConfirmationProps) {
  // Slide 6: Type-safe route params
  const { bookingId } = route.params;

  // Retrieve booking and actions from Zustand store
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const booking = bookings.find((b) => b.id === bookingId);

  const [showCancelModal, setShowCancelModal] = useState(false);

  const isConfirmed = booking?.status === 'confirmed';

  const handleDone = () => {
    navigation.navigate('MainTabs', { screen: 'MyBookings' });
  };

  const handleShare = async () => {
    if (!booking) return;
    try {
      await Share.share({
        title: `VKU Room Pass - ${booking.roomName}`,
        message: `[VKU Room Pass] Đã xác nhận phòng ${booking.roomName} (${booking.building}) vào ngày ${booking.date}, ca: ${booking.timeSlot}. Mã thẻ: ${booking.ticketCode}.`,
      });
    } catch {
      // Ignored
    }
  };

  const handleExecuteCancel = () => {
    if (!booking) return;
    cancelBooking(booking.id);
    setShowCancelModal(false);
  };

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Không tìm thấy thông tin lượt đặt phòng.</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Animation / Icon */}
        <View style={styles.successHeader}>
          <View
            style={[
              styles.successCircle,
              !isConfirmed && { backgroundColor: COLORS.danger },
            ]}
          >
            <Ionicons
              name={isConfirmed ? 'checkmark' : 'close'}
              size={38}
              color={COLORS.white}
            />
          </View>
          <Text style={styles.successTitle}>
            {isConfirmed ? 'Đặt phòng thành công!' : 'Lịch phòng đã bị hủy'}
          </Text>
          <Text style={styles.successSub}>
            {isConfirmed
              ? 'Hệ thống quản lý phòng học VKU đã ghi nhận thông tin của bạn'
              : 'Lịch sử dụng phòng này hiện không còn hiệu lực trên hệ thống'}
          </Text>
        </View>

        {/* Boarding Pass / Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Ticket Header */}
          <View
            style={[
              styles.ticketHeader,
              !isConfirmed && { backgroundColor: '#475569' },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.universityName}>TRƯỜNG ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</Text>
              <Text style={styles.ticketType}>THẺ RA VÀO PHÒNG HỌC & NGHIÊN CỨU</Text>
            </View>
            <View style={styles.vkuLogoBox}>
              <Image
                source={require('../../assets/vku-logo.png')}
                style={styles.vkuLogoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Ticket Body */}
          <View style={styles.ticketBody}>
            <View style={styles.roomHighlight}>
              <Text style={styles.roomName}>{booking.roomName}</Text>
              <View style={styles.locationTagRow}>
                <View style={styles.locationPill}>
                  <Ionicons name="business" size={13} color={COLORS.accent} />
                  <Text style={styles.locationPillText}>{booking.building}</Text>
                </View>
                <Text style={styles.floorText}>{booking.floor}</Text>
              </View>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>NGÀY SỬ DỤNG</Text>
                <Text style={styles.gridValue}>{booking.date}</Text>
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>TRẠNG THÁI</Text>
                <View
                  style={[
                    styles.statusPill,
                    !isConfirmed && { backgroundColor: COLORS.dangerBg },
                  ]}
                >
                  <Ionicons
                    name={isConfirmed ? 'checkmark-circle' : 'close-circle'}
                    size={13}
                    color={isConfirmed ? COLORS.success : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isConfirmed ? COLORS.success : COLORS.danger },
                    ]}
                  >
                    {isConfirmed ? 'Đã xác nhận' : 'Đã hủy'}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridItem, { width: '100%', marginTop: 8 }]}>
                <Text style={styles.gridLabel}>CA THỜI GIAN</Text>
                <Text
                  style={[
                    styles.gridValue,
                    styles.timeSlotHighlight,
                    !isConfirmed && { color: COLORS.textMuted },
                  ]}
                >
                  {booking.timeSlot}
                </Text>
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>SINH VIÊN ĐẶT PHÒNG</Text>
                <Text style={styles.gridValue}>{booking.userName}</Text>
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>MÃ SINH VIÊN (MSSV)</Text>
                <Text style={styles.gridValue}>{booking.studentId}</Text>
              </View>
            </View>

            {booking.purpose ? (
              <View style={styles.purposeBox}>
                <Text style={styles.purposeLabel}>MỤC ĐÍCH SỬ DỤNG:</Text>
                <Text style={styles.purposeText}>{booking.purpose}</Text>
              </View>
            ) : null}
          </View>

          {/* Ticket Perforation Notch Separator */}
          <View style={styles.perforationContainer}>
            <View style={[styles.cutoutCircle, styles.cutoutLeft]} />
            <View style={styles.dashedLine} />
            <View style={[styles.cutoutCircle, styles.cutoutRight]} />
          </View>

          {/* Ticket Footer with Mock QR Code & Ticket Code */}
          <View style={styles.ticketFooter}>
            <View style={styles.qrContainer}>
              <View style={[styles.qrMockBox, !isConfirmed && { opacity: 0.5 }]}>
                <Ionicons
                  name={isConfirmed ? 'qr-code' : 'ban'}
                  size={72}
                  color={isConfirmed ? COLORS.primary : COLORS.danger}
                />
              </View>
              <View style={styles.qrInfo}>
                <Text style={styles.qrCodeLabel}>MÃ THẺ ĐIỆN TỬ</Text>
                <Text
                  style={[
                    styles.qrCodeValue,
                    !isConfirmed && { textDecorationLine: 'line-through', color: COLORS.textMuted },
                  ]}
                >
                  {booking.ticketCode}
                </Text>
                <Text style={styles.qrHint}>
                  {isConfirmed
                    ? 'Xuất trình mã này cho Cán bộ Quản lý phòng / Bảo vệ khi nhận chìa khóa'
                    : 'Thẻ đã bị hủy bỏ. Mã này không còn giá trị để mở khóa phòng.'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          {isConfirmed && (
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
              <Text style={styles.shareBtnText}>Chia sẻ thẻ</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.doneBtn, !isConfirmed && { flex: 1 }]}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
            <Text style={styles.doneBtnText}>Xem danh sách đặt</Text>
          </TouchableOpacity>
        </View>

        {/* Cancel Button on ticket screen (if still confirmed) */}
        {isConfirmed && (
          <TouchableOpacity
            style={styles.cancelTicketBtn}
            onPress={() => setShowCancelModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={styles.cancelTicketBtnText}>Hủy lịch đặt phòng này</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowCancelModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <Ionicons name="alert-circle" size={36} color={COLORS.danger} />
            </View>
            <Text style={styles.modalTitle}>Xác nhận hủy đặt phòng</Text>
            <Text style={styles.modalSub}>
              Bạn có chắc chắn muốn hủy lịch sử dụng phòng {booking.roomName} ({booking.timeSlot}) không?
            </Text>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalKeepBtn}
                onPress={() => setShowCancelModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalKeepBtnText}>Giữ lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleExecuteCancel}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.white} />
                <Text style={styles.modalConfirmBtnText}>Hủy phòng</Text>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  successSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  ticketCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  ticketHeader: {
    backgroundColor: COLORS.primary,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  universityName: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ticketType: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  vkuLogoBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vkuLogoImage: {
    width: 58,
    height: 36,
  },
  ticketBody: {
    padding: 20,
  },
  roomHighlight: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
    marginBottom: 14,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  locationTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  locationPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  floorText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '47%',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeSlotHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    backgroundColor: COLORS.successBg,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  purposeBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
  },
  purposeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  purposeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  perforationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 24,
    backgroundColor: COLORS.cardBg,
  },
  cutoutCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    position: 'absolute',
  },
  cutoutLeft: {
    left: -12,
  },
  cutoutRight: {
    right: -12,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginHorizontal: 16,
  },
  ticketFooter: {
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qrMockBox: {
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  qrInfo: {
    flex: 1,
  },
  qrCodeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  qrCodeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginVertical: 2,
  },
  qrHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: 8,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  doneBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    gap: 8,
    ...SHADOWS.md,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  cancelTicketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  cancelTicketBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
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
    maxWidth: 360,
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
    marginBottom: 18,
    lineHeight: 18,
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
    flex: 1.2,
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
