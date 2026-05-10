import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, CalendarDays, Settings } from "lucide-react-native";
import type { TabParamList } from "@/types/navigation";
import { HomeScreen } from "@/screens/HomeScreen";
import { MonthsScreen } from "@/screens/MonthsScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { useThemeColors } from "@/hooks/useThemeColors";

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  const { colors } = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          backgroundColor: colors.tab,
          borderTopColor: colors.border,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: "700", fontSize: 12 }
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color }) => <Home color={color} size={21} /> }} />
      <Tab.Screen name="Months" component={MonthsScreen} options={{ tabBarIcon: ({ color }) => <CalendarDays color={color} size={21} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <Settings color={color} size={21} /> }} />
    </Tab.Navigator>
  );
}
