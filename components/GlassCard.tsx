import type { PropsWithChildren } from "react";
import { View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = PropsWithChildren<ViewProps & { intensity?: number }>;

export function GlassCard({ children, className = "", intensity = 26, style, ...props }: Props) {
  const { colors, isDark } = useThemeColors();

  return (
    <BlurView
      intensity={intensity}
      tint={isDark ? "dark" : "light"}
      style={[{ borderColor: colors.border, backgroundColor: colors.surface }, style]}
      className={`overflow-hidden rounded-3xl border ${className}`}
      {...props}
    >
      <View>{children}</View>
    </BlurView>
  );
}
