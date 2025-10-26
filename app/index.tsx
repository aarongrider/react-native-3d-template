import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/themed-view";
import { Fiber } from "@/three/Fiber";

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <Fiber />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});
