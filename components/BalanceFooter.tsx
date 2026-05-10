import { Text, View } from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { currency } from "@/utils/format";

type Props = {
  mainBalance: number;
  totalExpenses: number;
  remainingBalance: number;
};

export function BalanceFooter({ mainBalance, totalExpenses, remainingBalance }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={FadeInUp.duration(360)}
      layout={Layout.springify()}
      style={{ backgroundColor: colors.surfaceStrong, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, 16) }}
      className="absolute bottom-0 left-0 right-0 border-t px-5 pt-4 shadow-2xl"
    >
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
            Main
          </Text>
          <Text style={{ color: colors.text }} numberOfLines={1} adjustsFontSizeToFit className="mt-1 text-base font-black">
            {currency(mainBalance)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
            Expenses
          </Text>
          <Text style={{ color: colors.danger }} numberOfLines={1} adjustsFontSizeToFit className="mt-1 text-base font-black">
            {currency(totalExpenses)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
            Cridited
          </Text>
          <Text style={{ color: colors.primary }} numberOfLines={1} adjustsFontSizeToFit className="mt-1 text-base font-black">
            {currency(totalExpenses)}
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
            Remaining
          </Text>
          <Text style={{ color: colors.primary }} numberOfLines={1} adjustsFontSizeToFit className="mt-1 text-base font-black">
            {currency(remainingBalance)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
