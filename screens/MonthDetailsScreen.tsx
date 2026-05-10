import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Landmark, Plus, WalletCards } from "lucide-react-native";
import { BankCard } from "@/components/BankCard";
import { EmptyState } from "@/components/EmptyState";
import { ModalSheet } from "@/components/ModalSheet";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { AppStackParamList } from "@/types/navigation";
import type { BankMaster, MonthBank } from "@/types/models";
import { currency } from "@/utils/format";

type Props = NativeStackScreenProps<AppStackParamList, "MonthDetails">;

export function MonthDetailsScreen({ route, navigation }: Props) {
  const { monthId } = route.params;
  const months = useAppStore((state) => state.months);
  const bankMasters = useAppStore((state) => state.bankMasters);
  const monthBanks = useAppStore((state) => state.monthBanks);
  const addMonthBank = useAppStore((state) => state.addMonthBank);
  const userId = useAppStore((state) => state.session?.user?.id ?? state.profile?.id ?? "");
  const { colors } = useThemeColors();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankMaster | null>(null);
  const [mainBalance, setMainBalance] = useState("");

  const month = months.find((item) => item.id === monthId);
  const banks = useMemo(() => monthBanks.filter((item) => item.monthId === monthId), [monthBanks, monthId]);
  const availableBanks = useMemo(() => bankMasters.filter((item) => !banks.some((bank) => bank.bankMasterId === item.id)), [bankMasters, banks]);
  const totalBalance = useMemo(() => banks.reduce((sum, bank) => sum + bank.currentBalance, 0), [banks]);

  const handleAdd = async () => {
    if (!selectedBank) {
      Alert.alert("Select bank", "Choose a bank name from Bank Master.");
      return;
    }
    await addMonthBank(userId, monthId, selectedBank, Number(mainBalance || 0));
    setSelectedBank(null);
    setMainBalance("");
    setModalOpen(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: MonthBank }) => <BankCard bank={item} onPress={() => navigation.navigate("BankTransactions", { monthBankId: item.id })} />,
    [navigation]
  );

  return (
    <Screen padded={false}>
      <View className="flex-1 px-5 pt-5">
        <View className="mb-5">
          <Text style={{ color: colors.muted }} className="text-sm font-semibold">
            {month?.name ?? "Month"}
          </Text>
          <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
            Bank Accounts
          </Text>
        </View>
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mb-5 rounded-3xl border p-5">          
          <View className="mt-0">
            <PrimaryButton title="Add Bank" icon={Plus} onPress={() => setModalOpen(true)} />
          </View>
        </View>
        <FlatList
          data={banks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={<EmptyState icon={WalletCards} title="No banks in this month" message="Create a bank account from your Bank Master and add the opening balance." />}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        />
      </View>

      <ModalSheet visible={modalOpen} title="Add bank account" onClose={() => setModalOpen(false)}>
        <Text style={{ color: colors.muted }} className="mb-2 text-xs font-semibold uppercase">
          Bank name
        </Text>
        <View style={{ borderColor: colors.border }} className="mb-4 max-h-56 rounded-2xl border">
          {availableBanks.length ? (
            availableBanks.map((bank) => (
              <Pressable
                key={bank.id}
                onPress={() => setSelectedBank(bank)}
                style={{ backgroundColor: selectedBank?.id === bank.id ? colors.primary : "transparent" }}
                className="flex-row items-center px-4 py-4"
              >
                <Landmark color={selectedBank?.id === bank.id ? colors.primaryText : colors.primary} size={18} />
                <Text style={{ color: selectedBank?.id === bank.id ? colors.primaryText : colors.text }} className="ml-3 text-base font-bold">
                  {bank.name}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: colors.muted }} className="p-4 text-sm">
              Add names in Bank Master first.
            </Text>
          )}
        </View>
        <TextField label="Main balance" value={mainBalance} onChangeText={setMainBalance} keyboardType="numeric" />
        <PrimaryButton title="Add Bank" icon={Plus} onPress={handleAdd} disabled={!availableBanks.length} />
      </ModalSheet>
    </Screen>
  );
}
