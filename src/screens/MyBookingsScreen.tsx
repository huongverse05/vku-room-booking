import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/bookingStore';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';
import { COLORS } from '../constants/theme';
import { MyBookingsScreenProps } from '../navigation/types';

export function MyBookingsScreen({ navigation }: MyBookingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [filterTab, setFilterTab] = useState<'active' | 'history'>('active');

  // Slide 13: GOOD: Select only what you need
  const bookings = useBookingStore((s) => s.bookings);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  // Filter lists
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const historyBookings = bookings.filter((b) => b.status === 'cancelled');

  const displayedList = filterTab === 'active' ? activeBookings : historyBookings;

  const handleCancelWithConfirm = (bookingId: string) => {
    Alert.alert(
      'Xác nhận hủy đặt phòng',
      'Bạn có chắc chắn muốn hủy lịch sử dụng phòng này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy phòng',
          style: 'destructive',
          onPress: () => {
            cancelBooking(bookingId);
          },
        },
      ]
    );
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

      {/* Hint for Swipe to Cancel on Active Tab */}
      {filterTab === 'active' && activeBookings.length > 0 && (
        <View style={styles.swipeTipBox}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.accent} />
          <Text style={styles.swipeTipText}>
            Mẹo: Vuốt thẻ phòng sang trái để kích hoạt cử chỉ hủy đặt phòng nhanh.
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
            onCancel={() => handleCancelWithConfirm(item.id)}
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
  listContent: {
    paddingBottom: 24,
  },
});
