import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function EmptyState({
  message = 'Chưa có phòng nào được đặt',
  subMessage = 'Hãy duyệt danh sách phòng và chọn không gian phù hợp cho học tập hoặc hội thảo.',
  icon = 'calendar-outline',
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>{subMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
