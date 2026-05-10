export type ID = string;

export type ThemeMode = "system" | "light" | "dark";

export type UserProfile = {
  id: ID;
  name: string;
  email: string;
  contactNumber?: string;
  createdAt: string;
};

export type Month = {
  id: ID;
  userId: ID;
  name: string;
  month: number;
  year: number;
  totalExpenses: number;
  totalBanks: number;
  createdAt: string;
};

export type BankMaster = {
  id: ID;
  userId: ID;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

export type MonthBank = {
  id: ID;
  userId: ID;
  monthId: ID;
  bankMasterId: ID;
  bankName: string;
  mainBalance: number;
  totalTransactions: number;
  currentBalance: number;
  createdAt: string;
};

export type Transaction = {
  id: ID;
  userId: ID;
  monthBankId: ID;
  amount: number;
  notes: string;
  category: string;
  transactionDate: string;
  createdAt: string;
  updatedAt?: string;
};
