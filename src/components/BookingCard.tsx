import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';
import { SwipeToCancel } from './SwipeToCancel';

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  onViewPass?: () => void;
  showSwipe?: boolean;
}

export function BookingCard({
  booking,
  onCancel,
  onViewPass,
  showSwipe = true,
}: BookingCardProps) {
  const isConfirmed = booking.status === 'confirmed';

  const cardContent = (
    <View style={styles.card}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.ticketBadge}>
          <Ionicons name="qr-code-outline" size={14} color={COLORS.primary} />
          <Text style={styles.ticketCode}>{booking.ticketCode}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isConfirmed ? styles.statusConfirmed : styles.statusCancelled,
          ]}
        >
          <Ionicons
            name={isConfirmed ? 'checkmark-circle' : 'close-circle'}
            size={13}
            color={isConfirmed ? COLORS.success : COLORS.danger}
          />
          <Text
            style={[
              styles.statusText,
              { color: isConfirmed ? COLORS.success : COLORS.danger },
            ]}
          >
            {isConfirmed ? 'Đã duyệt' : 'Đã hủy'}
          </Text>
        </View>
      </View>

      {/* Main room information */}
      <View style={styles.body}>
        <Text style={styles.roomName}>{booking.roomName}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="business-outline" size={14} color={COLORS.accent} />
            <Text style={styles.metaText}>
              {booking.building} • {booking.floor}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
            <Text style={styles.metaText}>{booking.date}</Text>
          </View>
        </View>

        <View style={styles.timeSlotRow}>
          <Ionicons name="time-outline" size={15} color={COLORS.textPrimary} />
          <Text style={styles.timeSlotText}>{booking.timeSlot}</Text>
        </View>

        {booking.purpose ? (
          <View style={styles.purposeBox}>
            <Text style={styles.purposeLabel}>Mục đích:</Text>
            <Text style={styles.purposeText} numberOfLines={2}>
              {booking.purpose}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {isConfirmed && showSwipe && (
          <View style={styles.swipeHint}>
            <Ionicons name="arrow-back" size={13} color={COLORS.textMuted} />
            <Text style={styles.swipeHintText}>Vuốt sang trái để hủy</Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          {onViewPass && (
            <TouchableOpacity
              style={styles.passBtn}
              onPress={onViewPass}
              activeOpacity={0.8}
            >
              <Ionicons name="ticket-outline" size={14} color={COLORS.primary} />
              <Text style={styles.passBtnText}>Thẻ vào phòng</Text>
            </TouchableOpacity>
          )}

          {isConfirmed && onCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (isConfirmed && showSwipe && onCancel) {
    return (
      <SwipeToCancel
        bookingId={booking.id}
        onCancel={() => onCancel()}
      >
        {cardContent}
      </SwipeToCancel>
    );
  }

  return <View style={styles.wrapper}>{cardContent}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  ticketCode: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  statusConfirmed: {
    backgroundColor: COLORS.successBg,
  },
  statusCancelled: {
    backgroundColor: COLORS.dangerBg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  body: {
    marginBottom: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    marginBottom: 10,
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  purposeBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  purposeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  purposeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 'auto',
  },
  passBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  passBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.dangerBg,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
});
