import type { StateCreator } from "zustand";
import { database } from "@/services/database";
import type { BankMaster, Month, MonthBank, Transaction } from "@/types/models";
import { createId } from "@/utils/ids";
import { monthName } from "@/utils/format";

export type ExpenseSlice = {
  months: Month[];
  bankMasters: BankMaster[];
  monthBanks: MonthBank[];
  transactions: Transaction[];
  dataLoading: boolean;
  refreshData: (userId: string) => Promise<void>;
  createMonth: (userId: string, month: number, year: number) => Promise<void>;
  deleteMonth: (id: string) => Promise<void>;
  addBankMaster: (userId: string, name: string) => Promise<void>;
  updateBankMaster: (id: string, name: string) => Promise<void>;
  deleteBankMaster: (id: string) => Promise<void>;
  addMonthBank: (userId: string, monthId: string, bankMaster: BankMaster, mainBalance?: number) => Promise<void>;
  updateMonthBankBalance: (id: string, mainBalance: number) => Promise<void>;
  addTransaction: (userId: string, monthBankId: string, input: { amount: number; notes: string; category: string; transactionDate: string }) => Promise<void>;
  updateTransaction: (id: string, input: { amount: number; notes: string; category: string; transactionDate: string }) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

const recalculate = (months: Month[], monthBanks: MonthBank[], transactions: Transaction[]) => {
  const nextBanks = monthBanks.map((bank) => {
    const bankTransactions = transactions.filter((item) => item.monthBankId === bank.id);
    
    // Calculate expenses (category "1") - subtract from balance
    const expenses = bankTransactions
      .filter((item) => String(item.category) === "1")
      .reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate credits (category "2") - add to balance
    const credits = bankTransactions
      .filter((item) => String(item.category) === "2")
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalTransactions = expenses + credits; // Total for display
    const currentBalance = bank.mainBalance - expenses + credits; // Balance calculation
    
    return {
      ...bank,
      totalTransactions,
      currentBalance
    };
  });

  const nextMonths = months.map((month) => {
    const banks = nextBanks.filter((bank) => bank.monthId === month.id);
    return {
      ...month,
      totalBanks: banks.length,
      totalExpenses: banks.reduce((sum, bank) => sum + bank.totalTransactions, 0)
    };
  });

  return { months: nextMonths, monthBanks: nextBanks };
};

export const createExpenseSlice: StateCreator<any, [], [], ExpenseSlice> = (set, get) => ({
  months: [],
  bankMasters: [],
  monthBanks: [],
  transactions: [],
  dataLoading: false,

  refreshData: async (userId) => {
    set({ dataLoading: true });
    try {
      const remote = await database.loadAll(userId);
      const calculated = recalculate(remote.months, remote.monthBanks, remote.transactions);
      set({ ...remote, ...calculated });
    } finally {
      set({ dataLoading: false });
    }
  },

  createMonth: async (userId, month, year) => {
    const item: Month = {
      id: createId("month"),
      userId,
      name: monthName(month, year),
      month,
      year,
      totalExpenses: 0,
      totalBanks: 0,
      createdAt: new Date().toISOString()
    };
    await database.saveMonth(item);
    set((state: ExpenseSlice) => ({ months: [item, ...state.months] }));
  },

  deleteMonth: async (id) => {
    await database.deleteMonth(id);
    set((state: ExpenseSlice) => {
      const bankIds = state.monthBanks.filter((bank) => bank.monthId === id).map((bank) => bank.id);
      const transactions = state.transactions.filter((item) => !bankIds.includes(item.monthBankId));
      return {
        months: state.months.filter((item) => item.id !== id),
        monthBanks: state.monthBanks.filter((item) => item.monthId !== id),
        transactions
      };
    });
  },

  addBankMaster: async (userId, name) => {
    const item: BankMaster = { id: createId("bank-master"), userId, name: name.trim(), createdAt: new Date().toISOString() };
    await database.saveBankMaster(item);
    set((state: ExpenseSlice) => ({ bankMasters: [item, ...state.bankMasters] }));
  },

  updateBankMaster: async (id, name) => {
    const updatedAt = new Date().toISOString();
    const existing = (get() as ExpenseSlice).bankMasters.find((item) => item.id === id);
    if (!existing) return;
    const updated = { ...existing, name: name.trim(), updatedAt };
    await database.saveBankMaster(updated);
    set((state: ExpenseSlice) => ({
      bankMasters: state.bankMasters.map((item) => (item.id === id ? updated : item)),
      monthBanks: state.monthBanks.map((item) => (item.bankMasterId === id ? { ...item, bankName: updated.name } : item))
    }));
  },

  deleteBankMaster: async (id) => {
    await database.deleteBankMaster(id);
    set((state: ExpenseSlice) => ({ bankMasters: state.bankMasters.filter((item) => item.id !== id) }));
  },

  addMonthBank: async (userId, monthId, bankMaster, mainBalance = 0) => {
    const item: MonthBank = {
      id: createId("month-bank"),
      userId,
      monthId,
      bankMasterId: bankMaster.id,
      bankName: bankMaster.name,
      mainBalance,
      totalTransactions: 0,
      currentBalance: mainBalance,
      createdAt: new Date().toISOString()
    };
    await database.saveMonthBank(item);
    set((state: ExpenseSlice) => recalculate(state.months, [item, ...state.monthBanks], state.transactions));
  },

  updateMonthBankBalance: async (id, mainBalance) => {
    console.log("==updateMonthBankBalance==", id, mainBalance); 
    const existing = (get() as ExpenseSlice).monthBanks.find((item) => item.id === id);
    if (!existing) return;
    const updated = { ...existing, mainBalance };
    await database.saveMonthBank(updated);
    set((state: ExpenseSlice) => recalculate(state.months, state.monthBanks.map((item) => (item.id === id ? updated : item)), state.transactions));
  },

  addTransaction: async (userId, monthBankId, input) => {
    const item: Transaction = {
      id: createId("txn"),
      userId,
      monthBankId,
      amount: input.amount,
      notes: input.notes.trim(),
      category: input.category,
      transactionDate: input.transactionDate,
      createdAt: new Date().toISOString()
    };
    await database.saveTransaction(item);
    set((state: ExpenseSlice) => {
      const transactions = [item, ...state.transactions];
      return { transactions, ...recalculate(state.months, state.monthBanks, transactions) };
    });
  },

  updateTransaction: async (id, input) => {
    const existing = (get() as ExpenseSlice).transactions.find((item) => item.id === id);
    if (!existing) return;
    const updated = { ...existing, ...input, notes: input.notes.trim(), category: input.category, updatedAt: new Date().toISOString() };
    await database.saveTransaction(updated);
    set((state: ExpenseSlice) => {
      const transactions = state.transactions.map((item) => (item.id === id ? updated : item));
      return { transactions, ...recalculate(state.months, state.monthBanks, transactions) };
    });
  },

  deleteTransaction: async (id) => {
    await database.deleteTransaction(id);
    set((state: ExpenseSlice) => {
      const transactions = state.transactions.filter((item) => item.id !== id);
      return { transactions, ...recalculate(state.months, state.monthBanks, transactions) };
    });
  }
});
