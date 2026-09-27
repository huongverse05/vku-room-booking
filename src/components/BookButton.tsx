import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface BookButtonProps {
  onPress: () => void;
  title?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'danger' | 'secondary';
}

export function BookButton({
  onPress,
  title = 'Đặt phòng này',
  icon = 'calendar-outline',
  disabled = false,
  style,
  variant = 'primary',
}: BookButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackgroundColor = () => {
    if (disabled) return COLORS.textMuted;
    if (variant === 'danger') return COLORS.danger;
    if (variant === 'secondary') return COLORS.surface;
    return COLORS.primary;
  };

  const getTextColor = () => {
    if (variant === 'secondary') return COLORS.textPrimary;
    return COLORS.white;
  };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      style={{ width: '100%' }}
    >
      <Animated.View
        style={[
          styles.bookBtn,
          { backgroundColor: getBackgroundColor() },
          style,
          animStyle,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={getTextColor()}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[styles.bookBtnText, { color: getTextColor() }]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bookBtn: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
