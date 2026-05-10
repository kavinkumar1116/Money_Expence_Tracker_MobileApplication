import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Landmark, WalletCards } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import type { MonthBank } from "@/types/models";
import { useThemeColors } from "@/hooks/useThemeColors";
import { currency, friendlyDate } from "@/utils/format";
import { GlassCard } from "@/components/GlassCard";

type Props = {
  bank: MonthBank;
  onPress: () => void;
};

export const BankCard = memo(function BankCard({ bank, onPress }: Props) {
  const { colors } = useThemeColors();

  return (
    <Animated.View entering={FadeInUp.duration(340).springify()} className="mb-4">
      <Pressable onPress={onPress}>
        <GlassCard className="p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: colors.primary }} className="h-12 w-12 items-center justify-center rounded-2xl">
                <Landmark color={colors.primaryText} size={22} />
              </View>
              <View className="ml-3">
                <Text style={{ color: colors.text }} className="text-lg font-extrabold">
                  {bank.bankName}
                </Text>
                <Text style={{ color: colors.muted }} className="mt-1 text-xs">
                  Created {friendlyDate(bank.createdAt)}
                </Text>
              </View>
            </View>
            <WalletCards color={colors.muted} size={20} />
          </View>
          <View className="mt-5 flex-row justify-between">
            <View>
              <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
                Current balance
              </Text>
              <Text style={{ color: colors.text }} className="mt-1 text-2xl font-black">
                {currency(bank.currentBalance)}
              </Text>
            </View>
            <View className="items-end">
              <Text style={{ color: colors.muted }} className="text-xs font-semibold uppercase">
                Transactions
              </Text>
              <Text style={{ color: colors.text }} className="mt-1 text-2xl font-black">
                {currency(bank.totalTransactions)}
              </Text>
            </View>
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
});
