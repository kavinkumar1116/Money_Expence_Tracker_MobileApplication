import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Landmark, Menu, Pencil, Plus, Search, Trash2 } from "lucide-react-native";
import { EmptyState } from "@/components/EmptyState";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { GlassCard } from "@/components/GlassCard";
import { ModalSheet } from "@/components/ModalSheet";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SwipeableRow } from "@/components/SwipeableRow";
import { TextField } from "@/components/TextField";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store";
import type { BankMaster } from "@/types/models";

export function BankMasterScreen() {
  const navigation = useNavigation();
  const bankMasters = useAppStore((state) => state.bankMasters);
  const addBankMaster = useAppStore((state) => state.addBankMaster);
  const updateBankMaster = useAppStore((state) => state.updateBankMaster);
  const deleteBankMaster = useAppStore((state) => state.deleteBankMaster);
  const userId = useAppStore((state) => state.session?.user?.id ?? state.profile?.id ?? "");
  const { colors } = useThemeColors();
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BankMaster | null>(null);
  const [name, setName] = useState("");

  const filtered = useMemo(
    () => bankMasters.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => a.name.localeCompare(b.name)),
    [bankMasters, query]
  );

  const openCreate = () => {
    setEditing(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (bank: BankMaster) => {
    setEditing(bank);
    setName(bank.name);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Bank name required", "Enter a reusable bank name.");
      return;
    }
    if (editing) {
      await updateBankMaster(editing.id, name);
    } else {
      await addBankMaster(userId, name);
    }
    setModalOpen(false);
  };

  const renderItem = useCallback(
    ({ item }: { item: BankMaster }) => (
      <SwipeableRow onDelete={() => deleteBankMaster(item.id)}>
        <GlassCard className="mb-4 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View style={{ backgroundColor: colors.primary }} className="h-12 w-12 items-center justify-center rounded-2xl">
                <Landmark color={colors.primaryText} size={22} />
              </View>
              <Text style={{ color: colors.text }} className="ml-3 text-lg font-extrabold">
                {item.name}
              </Text>
            </View>
            <View className="flex-row">
              <Pressable onPress={() => openEdit(item)} style={{ backgroundColor: colors.surfaceStrong }} className="mr-2 h-10 w-10 items-center justify-center rounded-2xl">
                <Pencil color={colors.primary} size={17} />
              </Pressable>
              <Pressable
                onPress={() =>
                  Alert.alert("Delete bank", `Delete ${item.name}?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteBankMaster(item.id) }
                  ])
                }
                style={{ backgroundColor: colors.surfaceStrong }}
                className="h-10 w-10 items-center justify-center rounded-2xl"
              >
                <Trash2 color={colors.danger} size={17} />
              </Pressable>
            </View>
          </View>
        </GlassCard>
      </SwipeableRow>
    ),
    [colors.danger, colors.primary, colors.primaryText, colors.surfaceStrong, colors.text, deleteBankMaster]
  );

  return (
    <Screen padded={false}>
      <View className="flex-1 px-5 pt-5">
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text style={{ color: colors.muted }} className="text-sm font-semibold">
              Reusable accounts
            </Text>
            <Text style={{ color: colors.text }} className="mt-1 text-3xl font-black">
              Bank Master
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
        <TextField label="Search bank" icon={Search} value={query} onChangeText={setQuery} />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={8}
          removeClippedSubviews
          ListEmptyComponent={<EmptyState icon={Landmark} title="No bank names" message="Add SBI, HDFC, ICICI, Cash Wallet, or any reusable account name." />}
          contentContainerStyle={{ paddingBottom: 110, flexGrow: 1 }}
        />
      </View>
      <FloatingActionButton onPress={openCreate} />
      <ModalSheet visible={modalOpen} title={editing ? "Edit bank" : "Add bank"} onClose={() => setModalOpen(false)}>
        <TextField label="Bank name" value={name} onChangeText={setName} autoFocus />
        <PrimaryButton title={editing ? "Update Bank" : "Save Bank"} icon={editing ? Pencil : Plus} onPress={handleSave} />
      </ModalSheet>
    </Screen>
  );
}
