import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  keyboard?: boolean;
  padded?: boolean;
  contentClassName?: string;
}> &
  ViewProps;

export function Screen({ children, scroll, keyboard, padded = true, contentClassName = "", className = "", ...props }: ScreenProps) {
  const { colors, isDark } = useThemeColors();
  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }}
      className="flex-1"
    >
      <View className={`${padded ? "px-5" : ""} ${contentClassName}`}>{children}</View>
    </ScrollView>
  ) : (
    <View className={`flex-1 ${padded ? "px-5" : ""} ${contentClassName}`}>{children}</View>
  );

  return (
    <LinearGradient
      colors={isDark ? ["#071311", "#0E1D1A", "#13241F"] : ["#F6F1E8", "#EAF3E8", "#F8EEE6"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} className={className} {...props}>
        {keyboard ? (
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} className="flex-1">
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
