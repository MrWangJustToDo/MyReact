/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import * as React from "react";
// import { ConcurrentRoot } from 'react-reconciler/constants'
import * as THREE from "three";
import { createWithEqualityFn } from "zustand/traditional";

import { useStore } from "./hooks";
import { invalidate, advance } from "./loop";
import { reconciler } from "./reconciler";
import { createStore, isRenderer, context } from "./store";
import { is, dispose, calculateDpr, watchDpr, useIsomorphicLayoutEffect, updateCamera, applyProps, prepare, useMutableCallback } from "./utils";

import type { EventManager, ComputeFunction } from "./events";
import type { Renderer, RootState, Size, Dpr, Performance, Frameloop, RootStore } from "./store";
import type { EquConfig, Camera, Properties } from "./utils";
import type { ThreeElement } from "../three-types";
import type ReactReconciler from "react-reconciler";

// Shim for OffscreenCanvas since it was removed from DOM types
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/54988
interface OffscreenCanvas extends EventTarget {}

export type RootStateMachine = { status: "open" } | { status: "closing"; token: symbol } | { status: "disposed" };

type RootEvent = { type: "use" } | { type: "unmount"; token: symbol } | { type: "dispose"; token: symbol };

/** What a root has applied, so its next configuration applies only what changed */
export interface AppliedConfiguration {
  /** The last configuration applied in full */
  previous?: RenderProps<HTMLCanvasElement | OffscreenCanvas>;
  /** The camera prop that set the current camera */
  camera?: RenderProps<HTMLCanvasElement | OffscreenCanvas>["camera"];
}

export interface Root {
  fiber: ReactReconciler.FiberRoot;
  store: RootStore;
  state: RootStateMachine;
  configuration: AppliedConfiguration;
  /** Whether R3F built `gl` (from defaults, props or a factory) and so disposes it on unmount */
  ownsRenderer: boolean;
  /** Stops following devicePixelRatio changes */
  unwatchDpr?: () => void;
  /** Settles once all accepted configuration has been applied */
  ready?: Promise<void>;
}

export const _roots = new Map<HTMLCanvasElement | OffscreenCanvas, Root>();

const shallow = { objects: "shallow" } as EquConfig;

/**
 * open -> closing -> disposed
 *          | use
 *          v
 *         open
 *
 * Only closing can be cancelled. Each unmount carries a token, so only the latest one can dispose.
 */
function transitionRoot(root: Root, event: RootEvent): boolean {
  const state = root.state;
  switch (event.type) {
    case "use":
      if (state.status === "disposed") return false;
      root.state = { status: "open" };
      return true;
    case "unmount":
      if (state.status === "disposed") return false;
      root.state = { status: "closing", token: event.token };
      return true;
    case "dispose":
      if (state.status !== "closing" || state.token !== event.token) return false;
      root.state = { status: "disposed" };
      return true;
  }
  return false;
}

function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  return typeof (value as PromiseLike<T> | undefined)?.then === "function";
}

function attempt<T>(step: () => T): T | undefined {
  try {
    return step();
  } catch (error) {
    console.warn("[R3F] Error while unmounting root; teardown may be incomplete:", error);
  }
}

export type DefaultGLProps = Omit<THREE.WebGLRendererParameters, "canvas"> & {
  canvas: HTMLCanvasElement | OffscreenCanvas;
};

export type GLProps =
  | Renderer
  | ((defaultProps: DefaultGLProps) => Renderer)
  | ((defaultProps: DefaultGLProps) => Promise<Renderer>)
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>;

export type CameraProps = (
  | Camera
  | Partial<ThreeElement<typeof THREE.Camera> & ThreeElement<typeof THREE.PerspectiveCamera> & ThreeElement<typeof THREE.OrthographicCamera>>
) & {
  /** Flags the camera as manual, putting projection into your own hands */
  manual?: boolean;
};

export interface RenderProps<TCanvas extends HTMLCanvasElement | OffscreenCanvas> {
  /** A threejs renderer instance or props that go into the default renderer */
  gl?: GLProps;
  /** Dimensions to fit the renderer to. Will measure canvas dimensions if omitted */
  size?: Size;
  /**
   * Enables shadows (by default PCFsoft). Can accept `gl.shadowMap` options for fine-tuning,
   * but also strings: 'basic' | 'percentage' | 'soft' | 'variance'.
   * @see https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap
   */
  shadows?: boolean | "basic" | "percentage" | "soft" | "variance" | Partial<THREE.WebGLShadowMap>;
  /**
   * Disables three r139 color management.
   * @see https://threejs.org/docs/#manual/en/introduction/Color-management
   */
  legacy?: boolean;
  /** Switch off automatic sRGB encoding and gamma correction */
  linear?: boolean;
  /** Use `THREE.NoToneMapping` instead of `THREE.ACESFilmicToneMapping` */
  flat?: boolean;
  /** Creates an orthographic camera */
  orthographic?: boolean;
  /**
   * R3F's render mode. Set to `demand` to only render on state change or `never` to take control.
   * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#on-demand-rendering
   */
  frameloop?: Frameloop;
  /**
   * R3F performance options for adaptive performance.
   * @see https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#movement-regression
   */
  performance?: Partial<Omit<Performance, "regress">>;
  /** Target pixel ratio. Can clamp between a range: `[min, max]` */
  dpr?: Dpr;
  /** Props that go into the default raycaster */
  raycaster?: Partial<THREE.Raycaster>;
  /** A `THREE.Scene` instance or props that go into the default scene */
  scene?: THREE.Scene | Partial<THREE.Scene>;
  /** A `THREE.Camera` instance or props that go into the default camera */
  camera?: CameraProps;
  /** An R3F event manager to manage elements' pointer events */
  events?: (store: RootStore) => EventManager<HTMLElement>;
  /** Callback after the canvas has rendered (but not yet committed) */
  onCreated?: (state: RootState) => void;
  /** Response for pointer clicks that have missed any target */
  onPointerMissed?: (event: MouseEvent) => void;
}

export interface ReconcilerRoot<TCanvas extends HTMLCanvasElement | OffscreenCanvas> {
  configure: (config?: RenderProps<TCanvas>) => Promise<ReconcilerRoot<TCanvas>>;
  render: (element: React.ReactNode) => RootStore;
  unmount: () => void;
}

/** The renderer to configure, or a promise for one from an async factory */
function createRenderer(canvas: HTMLCanvasElement | OffscreenCanvas, glConfig?: GLProps): Renderer | PromiseLike<Renderer> {
  const defaults: DefaultGLProps = { canvas, powerPreference: "high-performance", antialias: true, alpha: true };
  if (typeof glConfig === "function") return (glConfig as (defaultProps: DefaultGLProps) => Renderer | Promise<Renderer>)(defaults);
  if (isRenderer(glConfig)) return glConfig as Renderer;
  return new THREE.WebGLRenderer({ ...defaults, ...(glConfig as object) });
}

/**
 * Frees a renderer R3F built. WebGLRenderer.dispose() releases programs and caches but keeps its
 * context until garbage collection, and browsers cap live WebGL contexts, so the context is lost
 * after it. A WebGPURenderer (from a factory) releases its device and context inside dispose().
 */
function disposeRenderer(gl: THREE.WebGLRenderer): void | Promise<void> {
  // Avoid starting initialization through three's dispose(). A factory must await init()
  // before returning its renderer so readiness includes initialization and teardown can wait.
  if ((gl as { hasInitialized?: () => boolean }).hasInitialized?.() === false) return;
  const disposed: unknown = attempt(() => (gl.dispose ? gl.dispose() : gl.renderLists?.dispose?.()));
  // WebGPURenderer.dispose() is async from three r186
  if (isPromiseLike(disposed)) {
    return Promise.resolve(disposed)
      .catch((error) => console.warn("[R3F] Error disposing renderer", error))
      .then(() => attempt(() => gl.forceContextLoss?.()));
  }
  attempt(() => gl.forceContextLoss?.());
}

/** Owned renderers are disposed. Caller-provided renderers release caches and their context. */
function releaseRenderer(gl: THREE.WebGLRenderer | undefined, owned: boolean): void | Promise<void> {
  if (!gl) return;
  if (owned) return disposeRenderer(gl);
  attempt(() => gl.renderLists?.dispose?.());
  attempt(() => gl.forceContextLoss?.());
}

function computeInitialSize(canvas: HTMLCanvasElement | OffscreenCanvas, size?: Size): Size {
  if (!size && typeof HTMLCanvasElement !== "undefined" && canvas instanceof HTMLCanvasElement && canvas.parentElement) {
    const { width, height, top, left } = canvas.parentElement.getBoundingClientRect();
    return { width, height, top, left };
  } else if (!size && typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) {
    return {
      width: canvas.width,
      height: canvas.height,
      top: 0,
      left: 0,
    };
  }

  return { width: 0, height: 0, top: 0, left: 0, ...size };
}

/**
 * Applies the inputs that changed since the last configuration applied in full, to a root whose
 * renderer is installed. A runtime change, such as setFrameloop or an edit to gl.shadowMap, lasts
 * until its input changes. The pixel ratio instead follows the device on every call. Objects and
 * arrays compare shallowly, so an equal inline value is unchanged.
 */
function applyRootConfiguration(
  root: { store: RootStore; configuration: AppliedConfiguration },
  canvas: HTMLCanvasElement | OffscreenCanvas,
  props: RenderProps<HTMLCanvasElement | OffscreenCanvas>
) {
  const {
    gl: glConfig,
    scene: sceneOptions,
    camera: cameraOptions,
    shadows = false,
    linear = false,
    flat = false,
    legacy = false,
    frameloop = "always",
    dpr = [1, 2],
    performance,
    onPointerMissed,
  } = props;
  const size = computeInitialSize(canvas, props.size);
  const next: RenderProps<HTMLCanvasElement | OffscreenCanvas> = { ...props, shadows, linear, flat, legacy, frameloop, size };

  const state = root.store.getState();
  const gl = state.gl;
  const last = root.configuration.previous;
  const changed = (key: keyof RenderProps<HTMLCanvasElement | OffscreenCanvas>) => !last || !is.equ(next[key], last[key], shallow);
  // A failure can leave inputs partly applied, so the next configuration applies all of them
  root.configuration.previous = undefined;

  // Set up raycaster (one time only!)
  let raycaster = state.raycaster;
  if (!raycaster) state.set({ raycaster: (raycaster = new THREE.Raycaster()) });
  if (changed("raycaster")) {
    const { params, ...options } = props.raycaster ?? {};
    applyProps(raycaster, { ...options, params: { ...raycaster.params, ...params } } as any);
  }

  // Create default camera, don't overwrite any user-set state
  if (!state.camera || (state.camera === root.configuration.camera && changed("camera"))) {
    root.configuration.camera = cameraOptions;
    const isCamera = (cameraOptions as unknown as THREE.Camera | undefined)?.isCamera;
    const camera = isCamera
      ? (cameraOptions as Camera)
      : props.orthographic
        ? new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000)
        : new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
    if (!isCamera) {
      camera.position.z = 5;
      if (cameraOptions) {
        applyProps(camera, cameraOptions as any);
        // Preserve user-defined frustum if possible
        // https://github.com/pmndrs/react-three-fiber/issues/3160
        if (!(camera as any).manual) {
          if ("aspect" in cameraOptions || "left" in cameraOptions || "right" in cameraOptions || "bottom" in cameraOptions || "top" in cameraOptions) {
            (camera as any).manual = true;
            camera.updateProjectionMatrix();
          }
        }
      }
      // Always look at center by default
      if (!state.camera && !cameraOptions?.rotation) camera.lookAt(0, 0, 0);
    }
    state.set({ camera });

    // Configure raycaster
    // https://github.com/pmndrs/react-xr/issues/300
    raycaster.camera = camera;
  }

  // Set up scene (one time only!)
  if (!state.scene) {
    let scene: THREE.Scene;

    if ((sceneOptions as unknown as THREE.Scene | undefined)?.isScene) {
      scene = sceneOptions as THREE.Scene;
      prepare(scene, root.store, "", {});
    } else {
      scene = new THREE.Scene();
      prepare(scene, root.store, "", {});
      if (sceneOptions) applyProps(scene as any, sceneOptions as any);
    }

    state.set({ scene });
  }

  // Store events internally
  if (props.events && !state.events.handlers) state.set({ events: props.events(root.store) });
  if (changed("size")) state.setSize(size.width, size.height, size.top, size.left);
  // Check pixelratio
  if (state.viewport.dpr !== calculateDpr(dpr)) state.setDpr(dpr);
  if (changed("frameloop")) state.setFrameloop(frameloop);
  if (changed("onPointerMissed")) state.set({ onPointerMissed });
  // Performance options merge, so removing them keeps the current settings
  if (performance && changed("performance")) {
    state.set((state) => ({ performance: { ...state.performance, ...performance } }));
  }

  // Set up XR (one time only!)
  if (!state.xr) {
    // Handle frame behavior in WebXR
    const handleXRFrame: XRFrameRequestCallback = (timestamp: number, frame?: XRFrame) => {
      const state = root.store.getState();
      if (state.frameloop === "never") return;
      advance(timestamp, true, state, frame);
    };

    // Toggle render switching on session
    const handleSessionChange = () => {
      const state = root.store.getState();
      state.gl.xr.enabled = state.gl.xr.isPresenting;

      state.gl.xr.setAnimationLoop(state.gl.xr.isPresenting ? handleXRFrame : null);
      if (!state.gl.xr.isPresenting) invalidate(state);
    };

    // WebXR session manager
    const xr = {
      connect() {
        const gl = root.store.getState().gl;
        gl.xr.addEventListener("sessionstart", handleSessionChange);
        gl.xr.addEventListener("sessionend", handleSessionChange);
      },
      disconnect() {
        const gl = root.store.getState().gl;
        gl.xr.removeEventListener("sessionstart", handleSessionChange);
        gl.xr.removeEventListener("sessionend", handleSessionChange);
      },
    };

    // Subscribe to WebXR session events
    if (typeof gl.xr?.addEventListener === "function") xr.connect();
    state.set({ xr });
  }

  // Set shadowmap
  if (gl.shadowMap && changed("shadows")) {
    const oldEnabled = gl.shadowMap.enabled;
    const oldType = gl.shadowMap.type;
    gl.shadowMap.enabled = !!shadows;

    if (is.boo(shadows)) {
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    } else if (is.str(shadows)) {
      const types = {
        basic: THREE.BasicShadowMap,
        percentage: THREE.PCFShadowMap,
        soft: THREE.PCFSoftShadowMap,
        variance: THREE.VSMShadowMap,
      };
      gl.shadowMap.type = types[shadows] ?? THREE.PCFSoftShadowMap;
    } else if (is.obj(shadows)) {
      Object.assign(gl.shadowMap, shadows);
    }

    if (oldEnabled !== gl.shadowMap.enabled || oldType !== gl.shadowMap.type) gl.shadowMap.needsUpdate = true;
  }

  // Explicit renderer options take precedence over the color shorthands
  const glProps = glConfig && !is.fun(glConfig) && !isRenderer(glConfig) ? (glConfig as Partial<THREE.WebGLRenderer>) : undefined;
  if (changed("legacy")) {
    THREE.ColorManagement.enabled = !legacy;
    state.set({ legacy });
  }
  if (changed("linear")) {
    if (glProps?.outputColorSpace === undefined) {
      gl.outputColorSpace = linear ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace;
    }
    state.set({ linear });
  }
  if (changed("flat")) {
    if (glProps?.toneMapping === undefined) gl.toneMapping = flat ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    state.set({ flat });
  }

  // Set gl props
  if (glProps && changed("gl")) applyProps(gl, glProps as any);

  root.configuration.previous = next;
}

/**
 * Moving to another display or zooming changes window.devicePixelRatio without resizing the canvas,
 * so nothing configures the root again. Resolves the ratio the way configuration does, from the last
 * applied dpr. Returns the function that stops following.
 */
function followDpr(root: { store: RootStore; configuration: AppliedConfiguration }): () => void {
  const xr = () => root.store.getState().gl?.xr;
  const follow = (): void => {
    const state = root.store.getState();
    // three doesn't resize during XR and restores its own pixel ratio once the session ends. It holds
    // the session before it sets isPresenting. Listeners are deduplicated, so this waits once
    if (xr()?.isPresenting || xr()?.getSession?.()) {
      xr()!.addEventListener("sessionend", follow);
      return;
    }
    xr()?.removeEventListener?.("sessionend", follow);
    // A failed configuration applies everything on the next one
    const last = root.configuration.previous;
    if (!last) return;
    const dpr = last.dpr ?? [1, 2];
    if (state.viewport.dpr !== calculateDpr(dpr)) state.setDpr(dpr);
  };
  const unwatch = watchDpr(follow);
  return () => {
    unwatch();
    xr()?.removeEventListener?.("sessionend", follow);
  };
}

export function createRoot<TCanvas extends HTMLCanvasElement | OffscreenCanvas>(canvas: TCanvas): ReconcilerRoot<TCanvas> {
  // Check against mistaken use of createRoot
  const prevRoot = _roots.get(canvas);
  const prevFiber = prevRoot?.fiber;
  const prevStore = prevRoot?.store;

  if (prevRoot) console.warn("R3F.createRoot should only be called once!");

  // Report when an error was detected in a previous render
  // https://github.com/pmndrs/react-three-fiber/pull/2261
  const logRecoverableError =
    typeof reportError === "function"
      ? // In modern browsers, reportError will dispatch an error event,
        // emulating an uncaught JavaScript error.
        reportError
      : // In older browsers and test environments, fallback to console.error.
        console.error;

  // Create store
  const store = prevStore || createStore(invalidate, advance);
  // Create renderer
  const fiber =
    prevFiber ||
    reconciler.createContainer(
      store, // container
      // ConcurrentRoot, // tag
      1,
      null, // hydration callbacks
      false, // isStrictMode
      null, // concurrentUpdatesByDefaultOverride
      "", // identifierPrefix
      logRecoverableError, // onUncaughtError
      null,
      logRecoverableError, // onCaughtError
      logRecoverableError, // onRecoverableError
      null // transitionCallbacks
    );
  // A reused root (for example a StrictMode remount) keeps its store, fiber and applied configuration
  const root: Root = prevRoot || { fiber, store, state: { status: "open" }, configuration: {}, ownsRenderer: false };
  // Map it
  if (!prevRoot) _roots.set(canvas, root);

  // Locals
  let onCreated: ((state: RootState) => void) | undefined;
  let configureError: unknown;
  let configured = false;
  let pending: Promise<void> | null = null;

  return {
    configure(props: RenderProps<TCanvas> = {}): Promise<ReconcilerRoot<TCanvas>> {
      if (!transitionRoot(root, { type: "use" })) {
        return Promise.reject(new Error("R3F: Cannot configure a root after disposal has started."));
      }

      // Configuration applies in call order. Publishing first queues calls made while this one runs
      const previous = pending;
      let settle!: () => void;
      const ready = new Promise<void>((resolve) => (settle = resolve));
      pending = ready;
      root.ready = ready;

      const apply = async () => {
        try {
          configureError = undefined;
          const { gl: glConfig, onCreated: onCreatedCallback } = props;
          const state = store.getState();
          // Set up renderer (one time only!)
          if (!state.gl) {
            const renderer = await createRenderer(canvas, glConfig);
            // R3F owns what it builds, a factory's result included, since it calls the factory once per root
            root.ownsRenderer = !isRenderer(glConfig);
            state.set({ gl: renderer as THREE.WebGLRenderer });
          }
          applyRootConfiguration(root, canvas, props as RenderProps<HTMLCanvasElement | OffscreenCanvas>);
          // Only a range, including the default one, follows the display: a fixed dpr never touches matchMedia
          if (!root.unwatchDpr && (props.dpr === undefined || Array.isArray(props.dpr))) root.unwatchDpr = followDpr(root);
          // Set locals
          onCreated = onCreatedCallback;
          configured = true;
        } catch (error) {
          configureError = error;
          throw error;
        } finally {
          settle();
          // Only clear the slot this call published, a queued call may have replaced it
          if (root.ready === ready) root.ready = undefined;
        }
      };

      return (previous ? previous.then(apply, apply) : apply()).then(() => this);
    },
    render(children: React.ReactNode): RootStore {
      if (!transitionRoot(root, { type: "use" })) return store;

      // The root has to be configured before it can be rendered
      if (!configured && !pending) this.configure();

      const commit = () => {
        // A root that was unmounted while configuring never renders
        if (root.state.status !== "open") return;
        if (configureError) {
          logRecoverableError(configureError);
          return;
        }
        reconciler.updateContainer(<Provider store={store} children={children} onCreated={onCreated} rootElement={canvas} />, fiber, null, () => undefined);
      };

      if (pending) pending.then(commit);
      else commit();

      return store;
    },
    unmount(): void {
      if (_roots.get(canvas) === root) unmountComponentAtNode(canvas);
    },
  };
}

interface ProviderProps<TCanvas extends HTMLCanvasElement | OffscreenCanvas> {
  onCreated?: (state: RootState) => void;
  store: RootStore;
  children: React.ReactNode;
  rootElement: TCanvas;
}

function Provider<TCanvas extends HTMLCanvasElement | OffscreenCanvas>({ store, children, onCreated, rootElement }: ProviderProps<TCanvas>): React.JSX.Element {
  useIsomorphicLayoutEffect(() => {
    const state = store.getState();
    // Flag the canvas active, rendering will now begin
    state.set((state) => ({ internal: { ...state.internal, active: true } }));
    // Notify that init is completed, the scene graph exists, but nothing has yet rendered
    if (onCreated) onCreated(state);
    // Connect events to the targets parent, this is done to ensure events are registered on
    // a shared target, and not on the canvas itself
    if (!store.getState().events.connected) state.events.connect?.(rootElement);
  }, []);
  return <context.Provider value={store}>{children}</context.Provider>;
}

export function unmountComponentAtNode<TCanvas extends HTMLCanvasElement | OffscreenCanvas>(canvas: TCanvas, callback?: (canvas: TCanvas) => void): void {
  const root = _roots.get(canvas);
  const token = Symbol("unmount");
  if (!root || !transitionRoot(root, { type: "unmount", token })) return;

  const teardown = () => {
    // Configuration accepted before the unmount finishes first, so a renderer it creates is released too
    if (root.ready) {
      const ready = root.ready;
      ready.then(teardown, teardown);
      return;
    }
    // Refused when the root was used again since this unmount
    if (!transitionRoot(root, { type: "dispose", token })) return;
    // Close the gates before invoking user cleanup code
    _roots.delete(canvas);

    const state = root.store.getState();
    state.internal.active = false;

    // Release what uses the renderer before the renderer itself
    attempt(() => root.unwatchDpr?.());
    attempt(() => state.events.disconnect?.());
    if (state.gl?.xr) attempt(() => state.xr.disconnect());
    if (state.scene) attempt(() => dispose(state.scene));

    const disposal = attempt(() => releaseRenderer(state.gl, root.ownsRenderer));

    if (isPromiseLike(disposal))
      Promise.resolve(disposal).then(
        () => callback?.(canvas),
        () => callback?.(canvas)
      );
    else callback?.(canvas);
  };

  reconciler.updateContainer(null, root.fiber, null, () => {
    // A root used again since the unmount keeps its new children
    if (root.state.status !== "closing" || root.state.token !== token) return;
    // Effect cleanups flush before the next update
    reconciler.updateContainer(null, root.fiber, null, teardown);
  });
}

export type InjectState = Partial<
  Omit<RootState, "events"> & {
    events?: {
      enabled?: boolean;
      priority?: number;
      compute?: ComputeFunction;
      connected?: any;
    };
  }
>;

export function createPortal(children: React.ReactNode, container: THREE.Object3D, state?: InjectState): React.JSX.Element {
  return <Portal children={children} container={container} state={state} />;
}

interface PortalProps {
  children: React.ReactNode;
  state?: InjectState;
  container: THREE.Object3D;
}

interface PortalOptions {
  parentStore: RootStore;
  container: THREE.Object3D;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  events: InjectState["events"];
  size: InjectState["size"];
}

function inject(parentState: RootState, portalState: RootState, options: PortalOptions): RootState {
  const { parentStore, container, raycaster, pointer, events, size } = options;
  let viewport = undefined;

  if (portalState.camera && size) {
    const camera = portalState.camera;
    // Calculate the override viewport, if present
    viewport = parentState.viewport.getCurrentViewport(camera, new THREE.Vector3(), size);
    // Update the portal camera, if it differs from the previous layer
    if (camera !== parentState.camera) updateCamera(camera, size);
  }

  return {
    // Inherit parent values and preserve the portal's own state
    ...parentState,
    ...portalState,
    // Portals have their own scene, raycaster and pointer
    scene: container as THREE.Scene,
    raycaster,
    pointer,
    mouse: pointer,
    // Their previous root is the layer before it
    previousRoot: parentStore,
    // Events, size and viewport can be overridden by the inject layer
    events: { ...parentState.events, ...portalState.events, ...events },
    size: { ...parentState.size, ...size },
    viewport: { ...parentState.viewport, ...viewport },
  } as RootState;
}

function initializePortal(options: PortalOptions, initialState: Partial<RootState>) {
  const { parentStore, container } = options;
  const portalStore = createWithEqualityFn<RootState>(
    (set, get) =>
      ({
        ...initialState,
        set,
        get,
        // Create once with the store's setter, without retaining a state snapshot
        setEvents: (events: Partial<EventManager<any>>) => set((state) => ({ ...state, events: { ...state.events, ...events } })),
      }) as RootState
  );
  const parentStateRef = { current: parentStore.getState() };
  portalStore.setState((portalState) => inject(parentStateRef.current, portalState, options));

  return { parentStore, container, portalStore, parentStateRef };
}

function Portal({ state = {}, children, container }: PortalProps): React.JSX.Element {
  /** This has to be a component because it would not be able to call useThree/useStore otherwise since
   *  if this is our environment, then we are not in r3f's renderer but in react-dom, it would trigger
   *  the "R3F hooks can only be used within the Canvas component!" warning:
   *  <Canvas>
   *    {createPortal(...)} */
  const parentStore = useStore();
  const { events, size, ...rest } = state;
  const [raycaster] = React.useState(() => new THREE.Raycaster());
  const [pointer] = React.useState(() => new THREE.Vector2());
  const options = { parentStore, container, raycaster, pointer, events, size };
  const injectRef = useMutableCallback((parentState: RootState, portalState: RootState) => inject(parentState, portalState, options));

  // Create a mirrored store, based on the previous root with a few overrides ...
  const portal = React.useMemo(() => initializePortal(options, rest), [parentStore, container]);
  const { portalStore, parentStateRef } = portal;

  // Subscribe to previous root-state and copy changes over to the mirrored portal-state
  useIsomorphicLayoutEffect(() => {
    const update = (parentState: RootState) => {
      parentStateRef.current = parentState;
      portalStore.setState((portalState) => injectRef.current!(parentState, portalState));
    };
    const unsubscribe = parentStore.subscribe(update);

    // Catch up on changes made before subscribing
    const parentState = parentStore.getState();
    if (parentState !== parentStateRef.current) update(parentState);

    // Clean up when unmounted or switching stores
    return unsubscribe;
  }, [parentStore, portalStore, parentStateRef]);

  return <>{reconciler.createPortal(<context.Provider value={portalStore}>{children}</context.Provider>, portalStore, null)}</>;
}

/**
 * Force React to flush any updates inside the provided callback synchronously and immediately.
 * All the same caveats documented for react-dom's `flushSync` apply here (see https://react.dev/reference/react-dom/flushSync).
 * Nevertheless, sometimes one needs to render synchronously, for example to keep DOM and 3D changes in lock-step without
 * having to revert to a non-React solution.
 */
export function flushSync<R>(fn: () => R): R {
  return reconciler.flushSync(fn);
}
