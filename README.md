# React Native 3D Template

A minimal yet powerful starting point for building 3D experiences in React Native

**_Powered by React Three Fiber and react-native-wgpu_**

![Image](https://github.com/user-attachments/assets/b3f9dd8a-25a6-4bbd-a168-3a1ece42e5bd)

## Overview

This template brings modern 3D graphics to React Native via the DAWN implementation of WebGPU. It provides a zero-setup entry point to experiment with Three.js, React Three Fiber, and WebGPU directly on iOS and Android.

Whether you want to prototype real-time visualizations, experiment with physics and shading, or push React Native rendering to the limit, this template gives you a clean foundation to start.

### 🧩 Tech Stack

- React Native + Expo — cross-platform runtime
- React Three Fiber — declarative 3D scene management
- react-native-wgpu — native WebGPU bindings for iOS & Android
- Three.js (WebGPURenderer) — running on the DAWN WebGPU backend
- TypeScript — for type-safe, editor-friendly development

### ⚙️ Getting Started

Clone and run:

- `npx degit aarongrider/react-native-3d-template my-3d-app`
- `cd my-3d-app`
- `npm install && npm run prebuild`
- `npm run start`

Open the app on iOS or Android, and you’ll see a simple rotating mesh rendered via WebGPU. Even the simulator is supported!

## 🧠 What’s Included

✅ Working WebGPU context via react-native-wgpu

✅ Minimal React Three Fiber scene setup

✅ Pre-configured Expo + Metro bundler

✅ TypeScript + ESLint base config

✅ Hot reload support for rapid iteration

## 🧵 Roadmap & Upcoming Features

This project is still early-stage — expect rapid iteration. Planned work includes:

🔹 Improved orbit controls + reusable components and utilities

🔹 Threaded rendering: run Three.js on separate threads via Reanimated Worklets

🔹 Scene management examples: lights, post-processing, shadows

🔹 Material & shader playground

🔹 Integration demos: Reanimated, gesture handlers, and UI overlays

🔹 WebGPU performance profiling tools

If you’re experimenting with any of these ideas — contributions and discussion are welcome.

## 🧱 Philosophy

This repo aims to:

- Prove that React Native can run true GPU workloads efficiently
- Offer a familiar Three.js developer experience on mobile
- Explore next-generation graphics threading in JS runtimes
- Serve as a foundation for advanced experiments: AR, visualization, simulation, and beyond

## 🧪 Status

Currently experimental.
React-native-wgpu is still under active development.
Expect breaking changes, missing features, and the occasional driver-level quirk, but that’s part of the fun.

If you’re here early, you’re exploring the frontier. 🛰️

## 📚 Learn More

[WebGPU specification](https://www.w3.org/TR/webgpu/)

[react-native-wgpu](https://github.com/wcandillon/react-native-webgpu)

[React Three Fiber](https://github.com/pmndrs/react-three-fiber)

## 🤝 Contributing

Contributions, bug reports, and discussions are welcome.
Open a PR or start a conversation! Especially around threading, performance, and multi-pass rendering.

## 🪐 License

MIT © 2025 Aaron Grider
