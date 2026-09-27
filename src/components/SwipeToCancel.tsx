import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  const handleTriggerCancel = () => {
    onCancel(bookingId);
  };

  const pan = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-15, 15])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      // Allow dragging to the left up to -140px
      translateX.value = Math.min(0, Math.max(e.translationX, -140));
    })
    .onEnd((e) => {
      // Trigger cancel when swiped past -60px (responsive threshold)
      if (e.translationX < -60) {
        runOnJS(handleTriggerCancel)();
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
      {/* Background action revealed on swipe (also directly tappable) */}
      <TouchableOpacity
        style={styles.actionBackground}
        onPress={handleTriggerCancel}
        activeOpacity={0.85}
      >
        <View style={styles.actionContent}>
          <Ionicons name="trash-outline" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Hủy phòng</Text>
        </View>
      </TouchableOpacity>

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
