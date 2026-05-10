import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { CalendarDays, Landmark, Trash2 } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import type { Month } from "@/types/models";
import { useThemeColors } from "@/hooks/useThemeColors";
import { currency } from "@/utils/format";
import { GlassCard } from "@/components/GlassCard";

type Props = {
  month: Month;
  onPress: () => void;
  onDelete: () => void;
};

export const MonthCard = memo(function MonthCard({ month, onPress, onDelete }: Props) {
  const { colors } = useThemeColors();

  return (
    <Animated.View entering={FadeInUp.duration(360).springify()} className="mb-4">
      <Pressable onPress={onPress}>
        <GlassCard className="p-5">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <View className="flex-row items-center">
                <CalendarDays color={colors.primary} size={20} />
                <Text style={{ color: colors.text }} className="ml-2 text-xl font-extrabold">
                  {month.name}
                </Text>
              </View>
            </View>
            <Pressable onPress={onDelete} hitSlop={10} style={{ backgroundColor: colors.surfaceStrong }} className="h-11 w-11 items-center justify-center rounded-2xl">
              <Trash2 color={colors.danger} size={18} />
            </Pressable>
          </View>
          <View className="mt-5 flex-row items-center">
            <Landmark color={colors.muted} size={17} />
            <Text style={{ color: colors.muted }} className="ml-2 text-sm font-semibold">
              {month.totalBanks} banks connected
            </Text>
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
});
