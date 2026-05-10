import type { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Months: undefined;
  Settings: undefined;
};

export type DrawerParamList = {
  DashboardTabs: NavigatorScreenParams<TabParamList> | undefined;
  Profile: undefined;
  BankMaster: undefined;
  DrawerSettings: undefined;
};

export type AppStackParamList = {
  AppDrawer: NavigatorScreenParams<DrawerParamList> | undefined;
  MonthDetails: { monthId: string };
  BankTransactions: { monthBankId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  App: NavigatorScreenParams<AppStackParamList> | undefined;
};
