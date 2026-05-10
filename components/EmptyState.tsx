import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  icon: LucideIcon;
  title: string;
  message: string;
};

export function EmptyState({ icon: Icon, title, message }: Props) {
  const { colors } = useThemeColors();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View style={{ backgroundColor: colors.surfaceStrong }} className="h-16 w-16 items-center justify-center rounded-3xl">
        <Icon color={colors.primary} size={28} />
      </View>
      <Text style={{ color: colors.text }} className="mt-5 text-center text-xl font-extrabold">
        {title}
      </Text>
      <Text style={{ color: colors.muted }} className="mt-2 text-center text-sm leading-6">
        {message}
      </Text>
    </View>
  );
}
