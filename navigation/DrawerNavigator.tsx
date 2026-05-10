import { DrawerContentScrollView, DrawerItem, createDrawerNavigator } from "@react-navigation/drawer";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Landmark, LogOut, Settings, UserRound, WalletCards } from "lucide-react-native";
import { Text, View } from "react-native";
import type { DrawerParamList } from "@/types/navigation";
import { TabNavigator } from "@/navigation/TabNavigator";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { BankMasterScreen } from "@/screens/BankMasterScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { useAppStore } from "@/store";
import { useThemeColors } from "@/hooks/useThemeColors";

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerContent(props: DrawerContentComponentProps) {
  const profile = useAppStore((state) => state.profile);
  const signOut = useAppStore((state) => state.signOut);
  const { colors } = useThemeColors();

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: colors.background }}>
      <View className="px-5 py-6">
        <View style={{ backgroundColor: colors.primary }} className="mb-4 h-14 w-14 items-center justify-center rounded-2xl">
          <WalletCards color={colors.primaryText} size={26} />
        </View>
        <Text style={{ color: colors.text }} className="text-xl font-extrabold">
          {profile?.name ?? "MonthWise"}
        </Text>
        <Text style={{ color: colors.muted }} className="mt-1 text-sm">
          {profile?.email ?? "Track every month cleanly"}
        </Text>
      </View>
      <DrawerItem
        label="Profile"
        icon={({ color, size }) => <UserRound color={color} size={size} />}
        labelStyle={{ fontWeight: "700" }}
        onPress={() => props.navigation.navigate("Profile")}
      />
      <DrawerItem
        label="Bank Master"
        icon={({ color, size }) => <Landmark color={color} size={size} />}
        labelStyle={{ fontWeight: "700" }}
        onPress={() => props.navigation.navigate("BankMaster")}
      />
      <DrawerItem
        label="Settings"
        icon={({ color, size }) => <Settings color={color} size={size} />}
        labelStyle={{ fontWeight: "700" }}
        onPress={() => props.navigation.navigate("DrawerSettings")}
      />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => <LogOut color={color} size={size} />}
        labelStyle={{ fontWeight: "700" }}
        onPress={signOut}
      />
    </DrawerContentScrollView>
  );
}

export function DrawerNavigator() {
  const { colors } = useThemeColors();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.muted,
        drawerType: "front",
        swipeEdgeWidth: 70
      }}
    >
      <Drawer.Screen name="DashboardTabs" component={TabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="BankMaster" component={BankMasterScreen} />
      <Drawer.Screen name="DrawerSettings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
