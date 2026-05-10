import { Pressable } from "react-native";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Plus } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({ onPress }: Props) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInUp.duration(420).springify()} className="absolute bottom-6 right-5">
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.94))}
        onPressOut={() => (scale.value = withSpring(1))}
        style={[style, { backgroundColor: colors.primary }]}
        className="h-16 w-16 items-center justify-center rounded-3xl shadow-xl"
      >
        <Plus color={colors.primaryText} size={30} strokeWidth={2.6} />
      </AnimatedPressable>
    </Animated.View>
  );
}
