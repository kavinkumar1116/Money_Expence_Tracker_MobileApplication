import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AppStackParamList } from "@/types/navigation";
import { DrawerNavigator } from "@/navigation/DrawerNavigator";
import { MonthDetailsScreen } from "@/screens/MonthDetailsScreen";
import { BankTransactionsScreen } from "@/screens/BankTransactionsScreen";
import { useThemeColors } from "@/hooks/useThemeColors";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const { colors } = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen name="AppDrawer" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MonthDetails" component={MonthDetailsScreen} options={{ title: "Month Details" }} />
      <Stack.Screen name="BankTransactions" component={BankTransactionsScreen} options={{ title: "Transactions" }} />
    </Stack.Navigator>
  );
}
