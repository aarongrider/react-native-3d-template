import { useEffect, useState } from "react";
import { Image, ImageSourcePropType } from "react-native";
import * as THREE from "three";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { HDRLoader } from "three/addons/loaders/HDRLoader";

type AssetSource = ImageSourcePropType;

export interface GLTF {
  animations: THREE.AnimationClip[];
  scene: THREE.Group;
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  asset: {
    copyright?: string | undefined;
    generator?: string | undefined;
    version?: string | undefined;
    minVersion?: string | undefined;
    extensions?: any;
    extras?: any;
  };
  parser: any;
  userData: Record<string, any>;
}

export const resolveAsset = (source: AssetSource) => {
  return Image.resolveAssetSource(source).uri;
};

export const debugManager = new THREE.LoadingManager();

debugManager.onStart = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Started loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

debugManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  console.log(
    "Loading file: " +
      url +
      ".\nLoaded " +
      itemsLoaded +
      " of " +
      itemsTotal +
      " files."
  );
};

debugManager.onError = function (url) {
  console.error("There was an error loading " + url);
};

export const useGeometry = (uri: string) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    const loader = new THREE.BufferGeometryLoader();
    loader.load(uri, function (geo) {
      setGeometry(geo);
    });
  }, [uri]);
  return geometry;
};

export const useHDR = (asset: AssetSource) => {
  const url = resolveAsset(asset);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new HDRLoader();
    loader.load(url, function (tex: THREE.Texture) {
      setTexture(tex);
    });
  }, [url]);
  return texture;
};

export const useGLTF = (asset: AssetSource) => {
  const [GLTF, setGLTF] = useState<GLTF | null>(null);
  const url = resolveAsset(asset);
  useEffect(() => {
    const loader = new GLTFLoader(debugManager);
    const dracoLoader = new DRACOLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(url, (model: GLTF) => {
      setGLTF(model);
    });
  }, [url]);
  return GLTF;
};
