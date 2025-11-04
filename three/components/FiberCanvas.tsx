import {
  createRoot,
  extend,
  RenderProps,
  RootState,
  unmountComponentAtNode,
} from "@react-three/fiber";
import { FiberProvider, useContextBridge } from "its-fine";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  GestureResponderEvent,
  GestureResponderHandlers,
  LayoutChangeEvent,
  ViewProps,
} from "react-native";
import { PanResponder, PixelRatio, StyleSheet, View } from "react-native";
import type { CanvasRef } from "react-native-wgpu";
import { Canvas } from "react-native-wgpu";
import * as THREE from "three";

import { createPointerEvents } from "./events";
import { makeWebGPURenderer, ReactNativeCanvas } from "./makeWebGPURenderer";

interface FiberCanvasProps
  extends Omit<RenderProps<HTMLCanvasElement>, "size" | "dpr"> {
  children: React.ReactNode;
  style?: ViewProps["style"];
  camera?: THREE.PerspectiveCamera;
  scene?: THREE.Scene;
}

export const CanvasImpl = ({
  children,
  style,
  scene,
  camera,
  events = (store) => createPointerEvents(store),
  frameloop,
}: FiberCanvasProps) => {
  const Bridge = useContextBridge();

  const [bind, setBind] = useState<GestureResponderHandlers>();

  const canvasRef = useRef<CanvasRef>(null);

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });

  const [canvasElement, setCanvasElement] = useState<any>(null);

  const viewRef = useRef<View>(null);
  const root = useRef<any>(null);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height, x, y } = e.nativeEvent.layout;
    setLayout({ width, height, top: y, left: x });
  }, []);

  useEffect(() => {
    extend(THREE as any);

    const context = canvasRef.current?.getContext("webgpu");

    if (context == null) {
      return;
    }

    const renderer = makeWebGPURenderer(context);

    const canvas = new ReactNativeCanvas(context.canvas);
    canvas.width = canvas.clientWidth * PixelRatio.get();
    canvas.height = canvas.clientHeight * PixelRatio.get();
    const size = {
      top: 0,
      left: 0,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    };

    // Trick controls into thinking canvas is the ownerDocument
    canvas.ownerDocument = canvas;
    root.current = createRoot(canvas as any);

    setCanvasElement(canvas);

    function handleTouch(
      gestureEvent: GestureResponderEvent,
      type: string
    ): boolean {
      canvas.dispatchEvent({
        ...gestureEvent.nativeEvent,
        type,
        offsetX: gestureEvent.nativeEvent.locationX,
        offsetY: gestureEvent.nativeEvent.locationY,
        pointerType: "touch",
        pointerId: gestureEvent.nativeEvent.identifier,
      });
      return true;
    }

    const responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => true,
      onStartShouldSetPanResponderCapture: (e) =>
        handleTouch(e, "pointercapture"),
      onPanResponderStart: (e) => handleTouch(e, "pointerdown"),
      onPanResponderMove: (e) => handleTouch(e, "pointermove"),
      onPanResponderEnd: (e, state) => {
        handleTouch(e, "pointerup");
        if (Math.hypot(state.dx, state.dy) < 20) {
          handleTouch(e, "click");
        }
      },
      onPanResponderRelease: (e) => handleTouch(e, "pointerleave"),
      onPanResponderTerminate: (e) => handleTouch(e, "lostpointercapture"),
      onPanResponderReject: (e) => handleTouch(e, "lostpointercapture"),
    });

    setBind(responder.panHandlers);

    root.current.configure({
      size,
      events,
      scene,
      camera,
      frameloop,
      gl: renderer,
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
  }, [camera, layout, scene]);

  useEffect(() => {
    if (layout.width > 0 && layout.height > 0) {
      root.current.render(<Bridge>{children ?? null}</Bridge>);
    }
  }, [Bridge, children, layout]);

  useEffect(() => {
    return () => {
      if (canvasElement != null) {
        unmountComponentAtNode(canvasElement);
      }
    };
  }, [canvasElement]);

  return (
    <View
      ref={viewRef}
      onPointerDown={() => console.log("onPointerDown")}
      style={[{ flex: 1 }, style]}
      onLayout={onLayout}
    >
      <Canvas ref={canvasRef} style={style} />
      <View style={StyleSheet.absoluteFill} {...bind} />
    </View>
  );
};

export function FiberCanvas(props: FiberCanvasProps) {
  return (
    <FiberProvider>
      <CanvasImpl {...props} />
    </FiberProvider>
  );
}
