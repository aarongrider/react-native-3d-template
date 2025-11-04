import { useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useHDR } from "./AssetManager";

const HDR = require("../assets/shop.hdr");
const GLTF = require("../assets/ion.glb");

function SceneEnv() {
  const { scene } = useThree();
  const texture = useHDR(HDR);

  useMemo(() => {
    if (!texture) return;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    // Enable showing the HDRI as a background
    //scene.background = texture;
  }, [texture, scene]);

  return null;
}

function Model() {
  const gltf = useGLTF(GLTF);
  if (!gltf) return null;
  return <primitive object={gltf.scene} />;
}

export const Ion = () => {
  return (
    <Suspense fallback={null}>
      <SceneEnv />
      <Model />
    </Suspense>
  );
};
