import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../types';
import { COLORS, SHADOWS } from '../constants/theme';

interface RoomCardProps {
  room: Room;
  index: number;
  onPress: () => void;
}

export function RoomCard({ room, index, onPress }: RoomCardProps) {
  const isAvailable = room.status === 'available';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      exiting={FadeOutUp.duration(200)}
      layout={Layout.springify()}
      style={styles.cardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={styles.card}
      >
        {/* Room Image with Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: room.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.topBadgesRow}>
            <View
              style={[
                styles.statusBadge,
                isAvailable ? styles.statusAvailable : styles.statusBusy,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isAvailable ? COLORS.success : COLORS.danger },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isAvailable ? COLORS.success : COLORS.danger },
                ]}
              >
                {isAvailable ? 'Sẵn sàng đặt' : 'Đang có lớp'}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.capacityBadge}>
            <Ionicons name="people-outline" size={13} color={COLORS.white} />
            <Text style={styles.capacityText}>{room.capacity} chỗ ngồi</Text>
          </View>
        </View>

        {/* Room Content */}
        <View style={styles.content}>
          <View style={styles.locationRow}>
            <View style={styles.locationPill}>
              <Ionicons name="business-outline" size={13} color={COLORS.accent} />
              <Text style={styles.location}>{room.building}</Text>
            </View>
            <Text style={styles.floor}>{room.floor}</Text>
          </View>

          <Text style={styles.roomName} numberOfLines={2}>
            {room.name}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {room.description}
          </Text>

          {/* Equipment Pills */}
          <View style={styles.equipmentRow}>
            {room.equipment.slice(0, 3).map((item, eqIdx) => (
              <View key={eqIdx} style={styles.equipPill}>
                <Text style={styles.equipText} numberOfLines={1}>
                  {item}
                </Text>
              </View>
            ))}
            {room.equipment.length > 3 && (
              <View style={[styles.equipPill, styles.equipMore]}>
                <Text style={styles.equipMoreText}>
                  +{room.equipment.length - 3}
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <View style={styles.slotsInfo}>
              <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.slotsCount}>
                {room.availableSlots.length} ca trống hôm nay
              </Text>
            </View>

            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Chi tiết & Đặt</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.accent} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusAvailable: {
    backgroundColor: '#FFFFFFEE',
  },
  statusBusy: {
    backgroundColor: '#FFFFFFEE',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFFEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  capacityBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  capacityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
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
  location: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  floor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  equipPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: 160,
  },
  equipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  equipMore: {
    backgroundColor: '#E0E7FF',
  },
  equipMoreText: {
    fontSize: 11,
    color: '#4338CA',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  slotsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotsCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
  },
});
