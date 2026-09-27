import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface SwipeToCancelProps {
  bookingId: string;
  onCancel: (id: string) => void;
  children: React.ReactNode;
  enabled?: boolean;
}

export function SwipeToCancel({
  bookingId,
  onCancel,
  children,
  enabled = true,
}: SwipeToCancelProps) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // Only allow dragging to the left (negative translationX)
      translateX.value = Math.min(0, e.translationX);
    })
    .onEnd((e) => {
      // Slide 26: if (e.translationX < -120) runOnJS(onCancel)(bookingId);
      if (e.translationX < -120) {
        runOnJS(onCancel)(bookingId);
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!enabled) {
    return <View>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {/* Background action revealed on swipe */}
      <View style={styles.actionBackground}>
        <View style={styles.actionContent}>
          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Hủy đặt phòng</Text>
        </View>
      </View>

      {/* Swipeable foreground card */}
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 14,
  },
  actionBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
  },
  actionContent: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
