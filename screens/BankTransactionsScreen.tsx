import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Text, View, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CalendarDays, Check, Plus, ReceiptText, Save, TrendingDown, TrendingUp } from "lucide-react-native";
import { BalanceFooter } from "@/components/BalanceFooter";
import { Dropdown } from "@/components/Dropdown";
import { EmptyState } from "@/components/EmptyState";
import { GlassCard } from "@/components/GlassCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SwipeableRow } from "@/components/SwipeableRow";
import { TextField } from "@/components/TextField";
import { TransactionItem } from "@/components/TransactionItem";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { Transaction } from "@/types/models";
import type { AppStackParamList } from "@/types/navigation";
import { currency } from "@/utils/format";

type Props = NativeStackScreenProps<AppStackParamList, "BankTransactions">;

export function BankTransactionsScreen({ route }: Props) {
  const { monthBankId } = route.params;
  const monthBanks = useAppStore((state) => state.monthBanks);
  const allTransactions = useAppStore((state) => state.transactions);
  const addTransaction = useAppStore((state) => state.addTransaction);
  const updateTransaction = useAppStore((state) => state.updateTransaction);
  const deleteTransaction = useAppStore((state) => state.deleteTransaction);
  const updateMonthBankBalance = useAppStore((state) => state.updateMonthBankBalance);
  const userId = useAppStore((state) => state.session?.user?.id ?? state.profile?.id ?? "");
  const { colors } = useThemeColors();
  const flatListRef = useRef<FlatList>(null);

  const bank = useMemo(() => monthBanks.find((item) => item.id === monthBankId), [monthBanks, monthBankId]);
  const transactions = useMemo(() => allTransactions.filter((item) => item.monthBankId === monthBankId), [allTransactions, monthBankId]);

  const [balanceText, setBalanceText] = useState(String(bank?.mainBalance ?? 0));
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10));
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [selectedTab, setSelectedTab] = useState<1 | 2>(1);

  const sortedTransactions = useMemo(
    () => [...transactions]
      .filter((item) => item.category === selectedTab)
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()),
    [transactions, selectedTab]
  );

  
  const totals = useMemo(
    () => {
      const expenses = transactions.filter((t) => t.category === 1).reduce((sum, t) => sum + t.amount, 0);
      const credited = transactions.filter((t) => t.category === 2).reduce((sum, t) => sum + t.amount, 0);
      return {
        mainBalance: bank?.mainBalance ?? 0,
        totalExpenses: expenses,
        totalCredited: credited,
        remainingBalance: bank?.currentBalance ?? 0
      };
    },
    [bank?.currentBalance, bank?.mainBalance, transactions]
  );


  useEffect(() => {
    setBalanceText(String(bank?.mainBalance ?? 0));
  }, [bank?.mainBalance]);

  const handleInputFocus = () => {
    // Scroll to top to show form fields when keyboard opens
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const saveBalance = async (amount: number) => {
    await updateMonthBankBalance(monthBankId, amount);
  };

  const resetForm = () => {
    setAmount("");
    setNotes("");
    setCategory("");
    setTransactionDate(new Date().toISOString().slice(0, 10));
    setEditing(null);
  };

  const handleSaveTransaction = async () => {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      Alert.alert("Invalid amount", "Enter an expense amount greater than zero.");
      return;
    }
    if (!category) {
      Alert.alert("Missing category", "Please select a category (Expense or Credit).");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(transactionDate)) {
      Alert.alert("Invalid date", "Use YYYY-MM-DD format.");
      return;
    }
    
    const categoryNum = Number(category);
    
    if (editing) {
      await updateTransaction(editing.id, { amount: value, notes, category: categoryNum, transactionDate });
      // If updating a credited transaction, adjust mainBalance by the difference
      if (categoryNum === 2 && editing.category === 2) {
        const difference = value - editing.amount;
        await saveBalance(totals.mainBalance + difference);
      } else if (categoryNum === 2 && editing.category !== 2) {
        // Changing from expense to credit, add the amount
        await saveBalance(totals.mainBalance + value);
      } else if (categoryNum !== 2 && editing.category === 2) {
        // Changing from credit to expense, subtract the amount
        await saveBalance(totals.mainBalance - editing.amount);
      }
    } else {
      await addTransaction(userId, monthBankId, { amount: value, notes, category: categoryNum, transactionDate });
      // If adding a credited transaction, increase mainBalance
      if (categoryNum === 2) {
        await saveBalance(totals.mainBalance + value);
      }
    }
    resetForm();
  };

  const startEdit = (transaction: Transaction) => {
    setEditing(transaction);
    setAmount(String(transaction.amount));
    setNotes(transaction.notes);
    setCategory(String(transaction.category));
    setTransactionDate(transaction.transactionDate);
  };

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <SwipeableRow onDelete={async () => {
        // If deleting a credited transaction, decrease mainBalance
        if (item.category === 2) {
          await saveBalance(totals.mainBalance - item.amount);
        }
        await deleteTransaction(item.id);
      }}>
        <TransactionItem
          transaction={item}
          onEdit={() => startEdit(item)}
          onDelete={() =>
            Alert.alert("Delete transaction", "Remove this transaction?", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: async () => {
                // If deleting a credited transaction, decrease mainBalance
                if (item.category === 2) {
                  await saveBalance(totals.mainBalance - item.amount);
                }
                await deleteTransaction(item.id);
              }}
            ])
          }
        />
      </SwipeableRow>
    ),
    [deleteTransaction, totals.mainBalance]
  );

  const header = (
    <View>
      <Text style={{ color: colors.muted }} className="text-sm font-semibold">
        {bank?.bankName ?? "Bank"}
      </Text>
      <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
        Transactions
      </Text>
      <GlassCard className="mb-5 mt-5 p-5">
        <Text style={{ color: colors.muted }} className="text-xs font-bold uppercase">
          Main bank balance
        </Text>
        <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
          {currency(totals.mainBalance)}
        </Text>
        <View className="mt-4">
          <TextField label="Set main balance" value={balanceText} onChangeText={setBalanceText} keyboardType="numeric" />
          <PrimaryButton title="Save Balance" icon={Save} variant="secondary" onPress={() => saveBalance(0)} />
        </View>
      </GlassCard>
      <GlassCard className="mb-5 p-5">
        <Text style={{ color: colors.text }} className="mb-4 text-lg font-extrabold">
          {editing ? "Edit transaction" : "New transaction"}
        </Text>
        <TextField label="Amount" value={amount} onChangeText={setAmount} onFocus={handleInputFocus} keyboardType="numeric" />
        <TextField label="Notes" value={notes} onChangeText={setNotes} onFocus={handleInputFocus} multiline />
        <Dropdown
          label="Select a category"
          value={category}
          onChangeText={setCategory}
          options={[
            { label: "Expense (Debit)", value: "1" },
            { label: "Credit (+)", value: "2" },
          ]}
        />
        <TextField label="Transaction date" icon={CalendarDays} value={transactionDate} onChangeText={setTransactionDate} onFocus={handleInputFocus} placeholder="YYYY-MM-DD" />
        <PrimaryButton title={editing ? "Update Transaction" : "Save Transaction"} icon={editing ? Check : Plus} onPress={handleSaveTransaction} />
        {editing ? (
          <View className="mt-3">
            <PrimaryButton title="Cancel Edit" variant="ghost" onPress={resetForm} />
          </View>
        ) : null}
      </GlassCard>
      <View className="mb-5">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setSelectedTab(1)}
            className="flex-1 flex-row items-center justify-center py-4 rounded-lg"
            style={{
              backgroundColor: selectedTab === 1 ? "#ef4444" : "#fee2e2",
              opacity: selectedTab === 1 ? 1 : 0.6
            }}
          >
            <TrendingDown size={18} color={selectedTab === 1 ? "#fff" : "#dc2626"} />
            <Text
              style={{
                color: selectedTab === 1 ? "#fff" : "#dc2626",
                marginLeft: 8
              }}
              className="font-bold"
            >
              Expense (Debit)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab(2)}
            className="flex-1 flex-row items-center justify-center py-4 rounded-lg"
            style={{
              backgroundColor: selectedTab === 2 ? "#22c55e" : "#dcfce7",
              opacity: selectedTab === 2 ? 1 : 0.6
            }}
          >
            <TrendingUp size={18} color={selectedTab === 2 ? "#fff" : "#16a34a"} />
            <Text
              style={{
                color: selectedTab === 2 ? "#fff" : "#16a34a",
                marginLeft: 8
              }}
              className="font-bold"
            >
              Credit (+)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"} keyboardVerticalOffset={100} className="flex-1 px-5 pt-5">
        <FlatList
          ref={flatListRef}
          data={sortedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState icon={ReceiptText} title="No transactions" message="Add your first transaction to see expenses and remaining balance update instantly." />}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={9}
          removeClippedSubviews
          contentContainerStyle={{ paddingBottom: 200, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled
        />
      </KeyboardAvoidingView>
      <BalanceFooter {...totals} />
    </Screen>
  );
}
