import type { PropsWithChildren } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { X } from "lucide-react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>;

export function ModalSheet({ visible, title, onClose, children }: Props) {
  const { colors } = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/45">
        <Animated.View entering={FadeInDown.duration(240)} style={{ backgroundColor: colors.surfaceStrong }} className="rounded-t-[32px] p-5 pb-8">
          <Pressable onPress={(event) => event.stopPropagation()}>
            <View className="mb-5 flex-row items-center justify-between">
              <Text style={{ color: colors.text }} className="text-xl font-extrabold">
                {title}
              </Text>
              <Pressable onPress={onClose} style={{ backgroundColor: colors.surface }} className="h-10 w-10 items-center justify-center rounded-2xl">
                <X color={colors.text} size={20} />
              </Pressable>
            </View>
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
