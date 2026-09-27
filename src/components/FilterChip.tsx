import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  count?: number;
}

export function FilterChip({ label, isSelected, onPress, icon, count }: FilterChipProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        isSelected ? styles.chipSelected : styles.chipUnselected,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={15}
          color={isSelected ? COLORS.white : COLORS.textSecondary}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={[
          styles.label,
          isSelected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {typeof count === 'number' && (
        <View
          style={[
            styles.badge,
            isSelected ? styles.badgeSelected : styles.badgeUnselected,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isSelected ? styles.badgeTextSelected : styles.badgeTextUnselected,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipUnselected: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: COLORS.white,
  },
  labelUnselected: {
    color: COLORS.textSecondary,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeUnselected: {
    backgroundColor: COLORS.surface,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextSelected: {
    color: COLORS.white,
  },
  badgeTextUnselected: {
    color: COLORS.textSecondary,
  },
});
