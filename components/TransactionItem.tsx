import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import type { Transaction } from "@/types/models";
import { useThemeColors } from "@/hooks/useThemeColors";
import { currency, friendlyDate } from "@/utils/format";

type Props = {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
};

export const TransactionItem = memo(function TransactionItem({ transaction, onEdit, onDelete }: Props) {
  const { colors } = useThemeColors();

  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border }} className="mb-3 rounded-3xl border p-4">
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text style={{ color: colors.text }} className="text-lg font-extrabold">
            {currency(transaction.amount)}
          </Text>
          <Text style={{ color: colors.muted }} numberOfLines={2} className="mt-1 text-sm">
            {transaction.notes || "No notes"}
          </Text>
          <Text style={{ color: colors.muted }} className="mt-2 text-xs">
            {friendlyDate(transaction.transactionDate)}
          </Text>
        </View>
        <View className="flex-row">
          <Pressable onPress={onEdit} style={{ backgroundColor: colors.surfaceStrong }} className="mr-2 h-10 w-10 items-center justify-center rounded-2xl">
            <Pencil color={colors.primary} size={17} />
          </Pressable>
          <Pressable onPress={onDelete} style={{ backgroundColor: colors.surfaceStrong }} className="h-10 w-10 items-center justify-center rounded-2xl">
            <Trash2 color={colors.danger} size={17} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});
