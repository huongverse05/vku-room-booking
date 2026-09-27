import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface ErrorBannerProps {
  onRetry: () => void;
  message?: string;
}

export function ErrorBanner({
  onRetry,
  message = 'Không thể kết nối đến máy chủ quản lý phòng VKU',
}: ErrorBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="alert-circle-outline" size={44} color={COLORS.danger} />
        <Text style={styles.title}>Đã xảy ra lỗi</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={18} color={COLORS.white} />
          <Text style={styles.retryText}>Thử lại ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  retryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
