import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { INITIAL_USER } from '../constants/mockData';
import { useBookingStore } from '../store/bookingStore';
import { COLORS, SHADOWS } from '../constants/theme';
import { ProfileScreenProps } from '../navigation/types';

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const bookings = useBookingStore((s) => s.bookings);
  const activeCount = bookings.filter((b) => b.status === 'confirmed').length;

  const handleClearBookings = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmed = window.confirm(
        'Xóa dữ liệu đặt phòng:\nBạn có chắc chắn muốn xóa toàn bộ lịch đặt phòng trên thiết bị này không?'
      );
      if (confirmed) {
        useBookingStore.getState().clearAllBookings();
        if (window.alert) window.alert('Đã làm sạch toàn bộ dữ liệu đặt phòng!');
      }
      return;
    }

    Alert.alert(
      'Xóa dữ liệu đặt phòng',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch đặt phòng trên thiết bị này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa sạch',
          style: 'destructive',
          onPress: () => {
            useBookingStore.getState().clearAllBookings();
            Alert.alert('Thành công', 'Đã làm sạch toàn bộ dữ liệu đặt phòng!');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hồ Sơ Sinh Viên</Text>
          <Text style={styles.subtitle}>VKU Student Campus Account</Text>
        </View>
        <View style={styles.headerLogoWrapper}>
          <Image
            source={require('../../assets/vku-logo.png')}
            style={styles.headerLogoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: INITIAL_USER.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.fullName}>{INITIAL_USER.fullName}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.accent} />
              </View>
            </View>
            <Text style={styles.studentId}>MSSV: {INITIAL_USER.studentId}</Text>
            <Text style={styles.faculty}>{INITIAL_USER.faculty}</Text>
            <Text style={styles.major}>{INITIAL_USER.major}</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{bookings.length}</Text>
            <Text style={styles.statLabel}>Tổng lượt đặt</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {activeCount}
            </Text>
            <Text style={styles.statLabel}>Đang hoạt động</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: COLORS.accent }]}>
              100%
            </Text>
            <Text style={styles.statLabel}>Đúng quy định</Text>
          </View>
        </View>

        {/* Course & Project Info Banner */}
        <View style={styles.projectInfoBanner}>
          <View style={styles.projectBadge}>
            <Text style={styles.projectBadgeText}>MINI-PROJECT 2</Text>
          </View>
          <Text style={styles.projectTitle}>Cross-Platform Mobile App Development</Text>
          <Text style={styles.projectInstructor}>
            Giảng viên hướng dẫn: TS. Nguyễn Thanh Tuấn
          </Text>
          <Text style={styles.projectTech}>
            Stack: React Native + Expo • React Navigation (Stack + Tabs) • Zustand • TanStack Query • Reanimated 3 • Gesture Handler
          </Text>
        </View>

        {/* Campus Room Booking Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quy định sử dụng phòng học VKU</Text>
          {[
            {
              icon: 'time-outline',
              text: 'Đến nhận chìa khóa và kiểm tra thiết bị trước giờ bắt đầu 10 phút.',
            },
            {
              icon: 'shield-checkmark-outline',
              text: 'Bảo quản tài sản, máy chiếu, màn hình TV và máy tính trong phòng.',
            },
            {
              icon: 'power-outline',
              text: 'Tắt đèn, máy điều hòa và các thiết bị điện tử khi rời khỏi phòng.',
            },
            {
              icon: 'trash-bin-outline',
              text: 'Giữ gìn vệ sinh chung, không mang thức ăn nặng mùi vào phòng lab.',
            },
          ].map((rule, idx) => (
            <View key={idx} style={styles.ruleItem}>
              <Ionicons
                name={rule.icon as any}
                size={18}
                color={COLORS.primary}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.ruleText}>{rule.text}</Text>
            </View>
          ))}
        </View>

        {/* Settings & Demo Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tùy chọn & Thử nghiệm</Text>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate('MyBookings')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              <Text style={styles.menuLabel}>Xem các phòng đã đặt</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleClearBookings}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
              <Text style={[styles.menuLabel, { color: COLORS.danger }]}>Xóa toàn bộ lịch đặt phòng</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerLogoWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLogoImage: {
    width: 54,
    height: 34,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  verifiedBadge: {
    marginLeft: 2,
  },
  studentId: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  faculty: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  major: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  projectInfoBanner: {
    marginTop: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  projectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  projectBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  projectInstructor: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  projectTech: {
    fontSize: 11,
    color: COLORS.accent,
    marginTop: 6,
    lineHeight: 16,
  },
  section: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
