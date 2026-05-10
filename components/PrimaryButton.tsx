import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useThemeColors } from "@/hooks/useThemeColors";

type PrimaryButtonProps = PressableProps & {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  icon?: LucideIcon;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({ title, variant = "primary", loading, icon: Icon, disabled, onPressIn, onPressOut, ...props }: PrimaryButtonProps) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const bg =
    variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : variant === "secondary" ? colors.surfaceStrong : "transparent";
  const fg = variant === "primary" || variant === "danger" ? colors.primaryText : colors.text;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={[animatedStyle, { backgroundColor: bg, borderColor: colors.border, opacity: disabled ? 0.58 : 1 }]}
      className={`h-14 flex-row items-center justify-center rounded-2xl border px-5 ${variant === "ghost" ? "border-transparent" : ""}`}
      onPressIn={(event) => {
        scale.value = withSpring(0.98);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1);
        onPressOut?.(event);
      }}
      {...props}
    >
      {loading ? <ActivityIndicator color={fg} /> : Icon ? <Icon color={fg} size={19} /> : null}
      <Text style={{ color: fg }} className={`${Icon || loading ? "ml-2" : ""} text-base font-bold`}>
        {title}
      </Text>
    </AnimatedPressable>
  );
}
