import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/RoomCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBanner } from '../components/ErrorBanner';
import { FilterChip } from '../components/FilterChip';
import { EmptyState } from '../components/EmptyState';
import { VKU_BUILDINGS } from '../constants/mockData';
import { COLORS } from '../constants/theme';
import { BrowseRoomsScreenProps } from '../navigation/types';

export function BrowseRoomsScreen({ navigation }: BrowseRoomsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('All');

  // TanStack Query custom hook (Slide 17 & 18)
  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
  } = useRooms(selectedBuilding === 'Tất cả' ? undefined : selectedBuilding);

  // Client-side search and category filtering
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.equipment.some((eq) =>
          eq.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchType =
        selectedType === 'All' || room.type === selectedType;

      return matchSearch && matchType;
    });
  }, [rooms, searchQuery, selectedType]);

  const handleRoomPress = (roomId: string, roomName: string) => {
    navigation.navigate('RoomDetails', { roomId, roomName });
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandingRow}>
            <View style={styles.vkuLogoBadge}>
              <Text style={styles.vkuLogoText}>VKU</Text>
            </View>
            <Text style={styles.appName}>Room Booking</Text>
          </View>
          <Text style={styles.subGreeting}>
            Hệ thống đặt phòng học & nghiên cứu VKU
          </Text>
        </View>

        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('MyBookings')}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phòng theo tên, tòa nhà, thiết bị..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Horizontal Scroll: Buildings */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {VKU_BUILDINGS.map((b) => (
            <FilterChip
              key={b}
              label={b}
              isSelected={selectedBuilding === b}
              onPress={() => setSelectedBuilding(b)}
              icon={b === 'Tất cả' ? 'grid-outline' : 'business-outline'}
            />
          ))}
        </ScrollView>
      </View>

      {/* Type Filter Pills */}
      <View style={styles.typeFilterRow}>
        {[
          { key: 'All', label: 'Tất cả loại' },
          { key: 'Lab', label: '💻 Lab Máy tính' },
          { key: 'Conference', label: '🎙️ Hội thảo' },
          { key: 'StudySpace', label: '📖 Tự học' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.typePill,
              selectedType === item.key && styles.typePillActive,
            ]}
            onPress={() => setSelectedType(item.key)}
          >
            <Text
              style={[
                styles.typePillText,
                selectedType === item.key && styles.typePillTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner message="Đang tải dữ liệu phòng từ máy chủ VKU..." />
      ) : isError ? (
        <ErrorBanner onRetry={refetch} />
      ) : (
        <FlatList
          data={filteredRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <RoomCard
              room={item}
              index={index}
              onPress={() => handleRoomPress(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={refetch} // Slide 18 pull-to-refresh
          ListEmptyComponent={
            <EmptyState
              message="Không tìm thấy phòng phù hợp"
              subMessage="Thử thay đổi từ khóa tìm kiếm hoặc chọn tòa nhà khác."
              icon="search-outline"
            />
          }
        />
      )}
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
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vkuLogoBadge: {
    backgroundColor: COLORS.vkuRed,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  vkuLogoText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  subGreeting: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  filterSection: {
    marginBottom: 10,
  },
  chipsScroll: {
    paddingHorizontal: 16,
  },
  typeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },
  typePillActive: {
    backgroundColor: '#DBEAFE',
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  typePillTextActive: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
});
