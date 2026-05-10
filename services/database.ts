import type { BankMaster, Month, MonthBank, Transaction, UserProfile } from "@/types/models";
import { hasSupabaseConfig, supabase } from "@/services/supabase";

const requireSupabase = () => {
  if (!hasSupabaseConfig) {
    throw new Error("Supabase is not configured. Add your real EXPO_PUBLIC_SUPABASE_ANON_KEY to .env and restart Expo.");
  }
};

const throwIfError = (error: unknown) => {
  if (error) throw error;
};

const toMonth = (row: any): Month => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  month: row.month,
  year: row.year,
  totalExpenses: Number(row.total_expenses ?? 0),
  totalBanks: Number(row.total_banks ?? 0),
  createdAt: row.created_at
});

const toBankMaster = (row: any): BankMaster => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const toMonthBank = (row: any): MonthBank => ({
  id: row.id,
  userId: row.user_id,
  monthId: row.month_id,
  bankMasterId: row.bank_master_id,
  bankName: row.bank_name,
  mainBalance: Number(row.main_balance ?? 0),
  totalTransactions: Number(row.total_transactions ?? 0),
  currentBalance: Number(row.current_balance ?? 0),
  createdAt: row.created_at
});

const toTransaction = (row: any): Transaction => ({
  id: row.id,
  userId: row.user_id,
  monthBankId: row.month_bank_id,
  amount: Number(row.amount ?? 0),
  notes: row.notes ?? "",
  category: row.category ?? "",
  transactionDate: row.transaction_date,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const database = {
  enabled: hasSupabaseConfig,

  async upsertProfile(profile: UserProfile) {
    requireSupabase();
    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      contact_number: profile.contactNumber
    });
    throwIfError(error);
  },

  async loadAll(userId: string) {
    requireSupabase();

    const [months, bankMasters, monthBanks, transactions] = await Promise.all([
      supabase.from("months").select("*").eq("user_id", userId).order("year", { ascending: false }).order("month", { ascending: false }),
      supabase.from("bank_masters").select("*").eq("user_id", userId).order("name"),
      supabase.from("month_banks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false })
    ]);

    const error = months.error ?? bankMasters.error ?? monthBanks.error ?? transactions.error;
    throwIfError(error);

    return {
      months: (months.data ?? []).map(toMonth),
      bankMasters: (bankMasters.data ?? []).map(toBankMaster),
      monthBanks: (monthBanks.data ?? []).map(toMonthBank),
      transactions: (transactions.data ?? []).map(toTransaction)
    };
  },

  async saveMonth(month: Month) {
    requireSupabase();
    const { error } = await supabase.from("months").upsert({
      id: month.id,
      user_id: month.userId,
      name: month.name,
      month: month.month,
      year: month.year
    });
    throwIfError(error);
  },

  async deleteMonth(id: string) {
    requireSupabase();
    const { error } = await supabase.from("months").delete().eq("id", id);
    throwIfError(error);
  },

  async saveBankMaster(bank: BankMaster) {
    requireSupabase();
    const { error } = await supabase.from("bank_masters").upsert({
      id: bank.id,
      user_id: bank.userId,
      name: bank.name
    });
    throwIfError(error);

    const { error: monthBankError } = await supabase
      .from("month_banks")
      .update({ bank_name: bank.name })
      .eq("user_id", bank.userId)
      .eq("bank_master_id", bank.id);
    throwIfError(monthBankError);
  },

  async deleteBankMaster(id: string) {
    requireSupabase();
    const { error } = await supabase.from("bank_masters").delete().eq("id", id);
    throwIfError(error);
  },

  async saveMonthBank(bank: MonthBank) {
    requireSupabase();
    const { error } = await supabase.from("month_banks").upsert({
      id: bank.id,
      user_id: bank.userId,
      month_id: bank.monthId,
      bank_master_id: bank.bankMasterId,
      bank_name: bank.bankName,
      main_balance: bank.mainBalance
    });
    throwIfError(error);
  },

  async saveTransaction(transaction: Transaction) {
    requireSupabase();
    const { error } = await supabase.from("transactions").upsert({
      id: transaction.id,
      user_id: transaction.userId,
      month_bank_id: transaction.monthBankId,
      amount: transaction.amount,
      notes: transaction.notes,
      category: transaction.category,
      transaction_date: transaction.transactionDate
    });
    throwIfError(error);
  },

  async deleteTransaction(id: string) {
    requireSupabase();
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    throwIfError(error);
  }
};
