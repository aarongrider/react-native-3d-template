import { WebGPURenderer } from "three";

export class ReactNativeCanvas {
  constructor(private canvas: HTMLCanvasElement | OffscreenCanvas) {}

  private listeners: Map<string, EventListener[]> = new Map();

  public ownerDocument = this;

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  set width(width: number) {
    this.canvas.width = width;
  }

  set height(height: number) {
    this.canvas.height = height;
  }

  get clientWidth() {
    return this.canvas.width;
  }

  get clientHeight() {
    return this.canvas.height;
  }

  set clientWidth(width: number) {
    this.canvas.width = width;
  }

  set clientHeight(height: number) {
    this.canvas.height = height;
  }

  addEventListener(type: string, _listener: EventListener) {
    const cbs = this.listeners.get(type) || [];
    cbs.push(_listener);
    this.listeners.set(type, cbs);
  }

  removeEventListener(type: string, _listener: EventListener) {
    const cbs = this.listeners.get(type) || [];
    this.listeners.set(
      type,
      cbs.filter((cb) => cb !== _listener)
    );
  }

  dispatchEvent(event: any) {
    event.target = this;
    const cbs = this.listeners.get(event.type);
    if (cbs) {
      cbs.forEach((cb) => cb(event));
    }
  }

  getRootNode() {
    return this;
  }

  setPointerCapture() {}

  releasePointerCapture() {}
}

export const makeWebGPURenderer = (
  context: GPUCanvasContext,
  { antialias = true }: { antialias?: boolean } = {}
) =>
  new WebGPURenderer({
    antialias,
    // @ts-expect-error
    canvas: new ReactNativeCanvas(context.canvas),
    context,
  });
