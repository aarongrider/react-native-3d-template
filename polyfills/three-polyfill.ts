if (typeof globalThis.VideoFrame == "undefined") {
  //@ts-expect-error
  globalThis.VideoFrame = class {};
}
