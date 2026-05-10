import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu, Plus, TrendingDown, WalletCards } from "lucide-react-native";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import { currency } from "@/utils/format";

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const months = useAppStore((state) => state.months);
  const monthBanks = useAppStore((state) => state.monthBanks);
  const transactions = useAppStore((state) => state.transactions);
  const { colors } = useThemeColors();

  const totals = useMemo(() => {
    const mainBalance = monthBanks.reduce((sum, bank) => sum + bank.mainBalance, 0);
    const expenses = transactions.reduce((sum, item) => sum + item.amount, 0);
    return { mainBalance, expenses, remaining: mainBalance - expenses };
  }, [monthBanks, transactions]);

  return (
    <Screen scroll contentClassName="py-5">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text style={{ color: colors.muted }} className="text-sm font-semibold">
            Monthly overview
          </Text>
          <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
            Dashboard
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ backgroundColor: colors.surfaceStrong }}
          className="h-12 w-12 items-center justify-center rounded-2xl"
        >
          <Menu color={colors.text} size={22} />
        </Pressable>
      </View>

      <GlassCard className="p-6">
        <Text style={{ color: colors.muted }} className="text-sm font-semibold">
          Remaining balance
        </Text>
        <Text style={{ color: colors.text }} adjustsFontSizeToFit numberOfLines={1} className="mt-2 text-4xl font-black">
          {currency(totals.remaining)}
        </Text>
        <View className="mt-6 flex-row">
          <View className="flex-1">
            <Text style={{ color: colors.muted }} className="text-xs font-bold uppercase">
              Main balance
            </Text>
            <Text style={{ color: colors.primary }} className="mt-1 text-lg font-black">
              {currency(totals.mainBalance)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text style={{ color: colors.muted }} className="text-xs font-bold uppercase">
              Expenses
            </Text>
            <Text style={{ color: colors.danger }} className="mt-1 text-lg font-black">
              {currency(totals.expenses)}
            </Text>
          </View>
        </View>
      </GlassCard>

      <View className="mt-5 flex-row">
        <GlassCard className="mr-3 flex-1 p-4">
          <WalletCards color={colors.primary} size={22} />
          <Text style={{ color: colors.text }} className="mt-4 text-2xl font-black">
            {months.length}
          </Text>
          <Text style={{ color: colors.muted }} className="mt-1 text-xs font-semibold">
            Months
          </Text>
        </GlassCard>
        <GlassCard className="flex-1 p-4">
          <TrendingDown color={colors.danger} size={22} />
          <Text style={{ color: colors.text }} className="mt-4 text-2xl font-black">
            {transactions.length}
          </Text>
          <Text style={{ color: colors.muted }} className="mt-1 text-xs font-semibold">
            Transactions
          </Text>
        </GlassCard>
      </View>

      <View className="mt-6">
        <PrimaryButton title="Create Month" icon={Plus} onPress={() => navigation.navigate("Months" as never)} />
      </View>
    </Screen>
  );
}
