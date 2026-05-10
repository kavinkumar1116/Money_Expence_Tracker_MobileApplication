import { View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";

export function SkeletonCard() {
  const { colors } = useThemeColors();
  const opacity = useSharedValue(0.42);

  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0.85, { duration: 760 }), withTiming(0.42, { duration: 760 })), -1);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View entering={FadeIn} style={[style, { backgroundColor: colors.surface, borderColor: colors.border }]} className="mb-4 rounded-3xl border p-5">
      <View style={{ backgroundColor: colors.border }} className="h-5 w-2/3 rounded-full" />
      <View style={{ backgroundColor: colors.border }} className="mt-5 h-4 w-1/2 rounded-full" />
      <View style={{ backgroundColor: colors.border }} className="mt-3 h-4 w-3/4 rounded-full" />
    </Animated.View>
  );
}
