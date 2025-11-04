import { StyleSheet, View } from "react-native";

import { Boxes } from "./components/Boxes";
import { FiberCanvas } from "./components/FiberCanvas";
import { Ion } from "./components/Ion";
import useControls from "./components/OrbitControls";

export const Fiber = () => {
  const [OrbitControls, events] = useControls();
  return (
    <View style={{ flex: 1 }}>
      <FiberCanvas style={{ flex: 1 }}>
        <OrbitControls />
        <Boxes />
        <Ion />
      </FiberCanvas>
      <View style={StyleSheet.absoluteFill} {...events} />
    </View>
  );
};
