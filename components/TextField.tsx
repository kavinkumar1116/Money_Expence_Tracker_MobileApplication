import { forwardRef } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: LucideIcon;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(({ label, error, icon: Icon, className = "", ...props }, ref) => {
  const { colors } = useThemeColors();

  return (
    <View className="mb-4">
      <Text style={{ color: colors.muted }} className="mb-2 text-xs font-semibold uppercase tracking-wide">
        {label}
      </Text>
      <View
        style={{ borderColor: error ? colors.danger : colors.border, backgroundColor: colors.surface }}
        className="min-h-14 flex-row items-center rounded-2xl border px-4"
      >
        {Icon ? <Icon color={colors.muted} size={18} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.muted}
          style={{ color: colors.text }}
          className={`ml-3 flex-1 py-3 text-base ${className}`}
          autoCapitalize="none"
          {...props}
        />
      </View>
      {error ? (
        <Text style={{ color: colors.danger }} className="mt-2 text-xs font-medium">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

TextField.displayName = "TextField";
