import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarPlus, Menu } from "lucide-react-native";
import { EmptyState } from "@/components/EmptyState";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ModalSheet } from "@/components/ModalSheet";
import { MonthCard } from "@/components/MonthCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SkeletonCard } from "@/components/SkeletonCard";
import { TextField } from "@/components/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { AppStackParamList } from "@/types/navigation";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export function MonthsScreen() {
  const navigation = useNavigation<Nav>();
  const months = useAppStore((state) => state.months);
  const dataLoading = useAppStore((state) => state.dataLoading);
  const createMonth = useAppStore((state) => state.createMonth);
  const deleteMonth = useAppStore((state) => state.deleteMonth);
  const refreshData = useAppStore((state) => state.refreshData);
  const userId = useAppStore((state) => state.session?.user?.id ?? state.profile?.id ?? "");
  const { colors } = useThemeColors();
  const [modalOpen, setModalOpen] = useState(false);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const sortedMonths = useMemo(() => [...months].sort((a, b) => b.year - a.year || b.month - a.month), [months]);

  const handleCreate = async () => {
    const monthValue = Number(month);
    const yearValue = Number(year);
    if (!Number.isInteger(monthValue) || monthValue < 1 || monthValue > 12 || !Number.isInteger(yearValue)) {
      Alert.alert("Invalid month", "Use month number 1-12 and a valid year.");
      return;
    }
    await createMonth(userId, monthValue, yearValue);
    setModalOpen(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: (typeof sortedMonths)[number] }) => (
      <MonthCard
        month={item}
        onPress={() => navigation.navigate("MonthDetails", { monthId: item.id })}
        onDelete={() =>
          Alert.alert("Delete month", `Delete ${item.name}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => deleteMonth(item.id) }
          ])
        }
      />
    ),
    [deleteMonth, navigation]
  );

  return (
    <Screen padded={false}>
      <View className="flex-1 px-5 pt-5">
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text style={{ color: colors.muted }} className="text-sm font-semibold">
              Plan and review
            </Text>
            <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
              Months
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
        <PrimaryButton title="Create Month" icon={CalendarPlus} onPress={() => setModalOpen(true)} />
        {dataLoading ? (
          <View className="mt-5">
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <FlatList
            data={sortedMonths}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            className="mt-5"
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={7}
            removeClippedSubviews
            refreshControl={<RefreshControl refreshing={dataLoading} onRefresh={() => refreshData(userId)} tintColor={colors.primary} />}
            ListEmptyComponent={<EmptyState icon={CalendarPlus} title="No months yet" message="Create your first month and start attaching bank balances." />}
            contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
          />
        )}
      </View>
      <FloatingActionButton onPress={() => setModalOpen(true)} />
      <ModalSheet visible={modalOpen} title="Create month" onClose={() => setModalOpen(false)}>
        <TextField label="Month number" value={month} onChangeText={setMonth} keyboardType="number-pad" />
        <TextField label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" />
        <PrimaryButton title="Save Month" onPress={handleCreate} />
      </ModalSheet>
    </Screen>
  );
}
