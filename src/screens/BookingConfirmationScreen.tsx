import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
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

  // Retrieve booking from Zustand store
  const bookings = useBookingStore((s) => s.bookings);
  const booking = bookings.find((b) => b.id === bookingId);

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
    } catch (e) {
      // Ignored
    }
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
        {/* Success Header Animation / Icon */}
        <View style={styles.successHeader}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={38} color={COLORS.white} />
          </View>
          <Text style={styles.successTitle}>Đặt phòng thành công!</Text>
          <Text style={styles.successSub}>
            Hệ thống quản lý phòng học VKU đã ghi nhận thông tin của bạn
          </Text>
        </View>

        {/* Boarding Pass / Ticket Card */}
        <View style={styles.ticketCard}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.universityName}>TRƯỜNG ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</Text>
              <Text style={styles.ticketType}>THẺ RA VÀO PHÒNG HỌC & NGHIÊN CỨU</Text>
            </View>
            <View style={styles.vkuLogoBox}>
              <Text style={styles.vkuLogoText}>VKU</Text>
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
                <View style={styles.statusPill}>
                  <Ionicons name="checkmark-circle" size={13} color={COLORS.success} />
                  <Text style={styles.statusPillText}>Đã xác nhận</Text>
                </View>
              </View>

              <View style={[styles.gridItem, { width: '100%', marginTop: 8 }]}>
                <Text style={styles.gridLabel}>CA THỜI GIAN</Text>
                <Text style={[styles.gridValue, styles.timeSlotHighlight]}>
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
              <View style={styles.qrMockBox}>
                <Ionicons name="qr-code" size={72} color={COLORS.primary} />
              </View>
              <View style={styles.qrInfo}>
                <Text style={styles.qrCodeLabel}>MÃ THẺ ĐIỆN TỬ</Text>
                <Text style={styles.qrCodeValue}>{booking.ticketCode}</Text>
                <Text style={styles.qrHint}>
                  Xuất trình mã này cho Cán bộ Quản lý phòng / Bảo vệ khi nhận chìa khóa
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
            <Text style={styles.shareBtnText}>Chia sẻ thẻ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
            <Text style={styles.doneBtnText}>Xem danh sách đặt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    backgroundColor: COLORS.vkuRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vkuLogoText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
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
    gap: 4,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
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
});
