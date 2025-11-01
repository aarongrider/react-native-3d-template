import type { ReconcilerRoot, RootState } from "@react-three/fiber";
import {
  createRoot,
  events,
  extend,
  unmountComponentAtNode,
} from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import type { ViewProps } from "react-native";
import { PixelRatio } from "react-native";
import type { CanvasRef } from "react-native-wgpu";
import { Canvas } from "react-native-wgpu";
import * as THREE from "three";

import { makeWebGPURenderer, ReactNativeCanvas } from "./makeWebGPURenderer";

interface FiberCanvasProps {
  children: React.ReactNode;
  style?: ViewProps["style"];
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
}

export const FiberCanvas = ({
  children,
  style,
  scene,
  camera,
}: FiberCanvasProps) => {
  const root = useRef<ReconcilerRoot<OffscreenCanvas>>(null);

  const canvasRef = useRef<CanvasRef>(null);

  useEffect(() => {
    extend(THREE as any);

    const context = canvasRef.current?.getContext("webgpu");

    if (context == null) {
      return;
    }

    const renderer = makeWebGPURenderer(context);

    // @ts-expect-error
    const canvas = new ReactNativeCanvas(context.canvas) as HTMLCanvasElement;
    canvas.width = canvas.clientWidth * PixelRatio.get();
    canvas.height = canvas.clientHeight * PixelRatio.get();
    const size = {
      top: 0,
      left: 0,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    };

    if (!root.current) {
      root.current = createRoot(canvas);
    }
    root.current.configure({
      size,
      events,
      scene,
      camera,
      gl: renderer,
      frameloop: "always",
      dpr: 1,
      onCreated: async (state: RootState) => {
        await state.gl.init();
        const renderFrame = state.gl.render.bind(state.gl);
        state.gl.render = (s: THREE.Scene, c: THREE.Camera) => {
          renderFrame(s, c);
          context?.present();
        };
      },
    });
    root.current.render(children);
    return () => {
      if (canvas != null) {
        unmountComponentAtNode(canvas);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Canvas ref={canvasRef} style={style} />;
};
