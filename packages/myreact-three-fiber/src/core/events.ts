/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/namespace */
/* eslint-disable max-lines */
import * as THREE from "three";

import { type Properties, getRootState } from "./utils";

import type { Instance } from "./reconciler";
import type { RootState, RootStore } from "./store";

export interface Intersection extends THREE.Intersection {
  /** The event source (the object which registered the handler) */
  eventObject: THREE.Object3D;
}

export interface IntersectionEvent<TSourceEvent> extends Intersection {
  /** The event source (the object which registered the handler) */
  eventObject: THREE.Object3D;
  /** An array of intersections */
  intersections: Intersection[];
  /** vec3.set(pointer.x, pointer.y, 0).unproject(camera) */
  unprojectedPoint: THREE.Vector3;
  /** Normalized event coordinates */
  pointer: THREE.Vector2;
  /** Delta between first click and this event */
  delta: number;
  /** The ray that pierced it */
  ray: THREE.Ray;
  /** The camera that was used by the raycaster */
  camera: Camera;
  /** stopPropagation will stop underlying handlers from firing */
  stopPropagation: () => void;
  /** The original host event */
  nativeEvent: TSourceEvent;
  /** If the event was stopped by calling stopPropagation */
  stopped: boolean;
}

export type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera;
export type ThreeEvent<TEvent> = IntersectionEvent<TEvent> & Properties<TEvent>;
export type DomEvent = PointerEvent | MouseEvent | WheelEvent;

export interface Events {
  onClick: EventListener;
  onContextMenu: EventListener;
  onDoubleClick: EventListener;
  onWheel: EventListener;
  onPointerDown: EventListener;
  onPointerUp: EventListener;
  onPointerLeave: EventListener;
  onPointerMove: EventListener;
  onPointerCancel: EventListener;
  onLostPointerCapture: EventListener;
}

export interface EventHandlers {
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  onContextMenu?: (event: ThreeEvent<MouseEvent>) => void;
  onDoubleClick?: (event: ThreeEvent<MouseEvent>) => void;
  onPointerUp?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerEnter?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerLeave?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMissed?: (event: MouseEvent) => void;
  onPointerCancel?: (event: ThreeEvent<PointerEvent>) => void;
  onWheel?: (event: ThreeEvent<WheelEvent>) => void;
  onLostPointerCapture?: (event: ThreeEvent<PointerEvent>) => void;
}

export type FilterFunction = (items: THREE.Intersection[], state: RootState) => THREE.Intersection[];
export type ComputeFunction = (event: DomEvent, root: RootState, previous?: RootState) => void;

export interface EventManager<TTarget> {
  /** Determines if the event layer is active */
  enabled: boolean;
  /** Event layer priority, higher prioritized layers come first and may stop(-propagate) lower layer  */
  priority: number;
  /** The compute function needs to set up the raycaster and an xy- pointer  */
  compute?: ComputeFunction;
  /** The filter can re-order or re-structure the intersections  */
  filter?: FilterFunction;
  /** The target node the event layer is tied to */
  connected?: TTarget;
  /** All the pointer event handlers through which the host forwards native events */
  handlers?: Events;
  /** Allows re-connecting to another target */
  connect?: (target: TTarget) => void;
  /** Removes all existing events handlers from the target */
  disconnect?: () => void;
  /** Triggers a onPointerMove with the last known event. This can be useful to enable raycasting without
   *  explicit user interaction, for instance when the camera moves a hoverable object underneath the cursor.
   */
  update?: () => void;
}

export interface PointerCaptureTarget {
  intersection: Intersection;
  target: Element;
}

function makeId(event: Intersection) {
  return (event.eventObject || event.object).uuid + "/" + event.index + event.instanceId;
}

/**
 * Release pointer captures.
 * This is called by releasePointerCapture in the API, and when an object is removed.
 */
function releaseInternalPointerCapture(
  capturedMap: Map<number, Map<THREE.Object3D, PointerCaptureTarget>>,
  obj: THREE.Object3D,
  captures: Map<THREE.Object3D, PointerCaptureTarget>,
  pointerId: number
): void {
  const captureData: PointerCaptureTarget | undefined = captures.get(obj);
  if (captureData) {
    captures.delete(obj);
    // If this was the last capturing object for this pointer
    if (captures.size === 0) {
      capturedMap.delete(pointerId);
      captureData.target.releasePointerCapture(pointerId);
    }
  }
}

export function removeInteractivity(store: RootStore, object: THREE.Object3D) {
  const { internal } = store.getState();
  // Removes every trace of an object from the data store
  internal.interaction = internal.interaction.filter((o) => o !== object);
  internal.initialHits = internal.initialHits.filter((o) => o !== object);
  internal.hovered.forEach((value, key) => {
    if (value.eventObject === object || value.object === object) {
      // Clear out intersects, they are outdated by now
      internal.hovered.delete(key);
    }
  });
  internal.capturedMap.forEach((captures, pointerId) => {
    releaseInternalPointerCapture(internal.capturedMap, object, captures, pointerId);
  });
}

export function createEvents(store: RootStore) {
  /** Calculates delta */
  function calculateDistance(event: DomEvent) {
    const { internal } = store.getState();
    const dx = event.offsetX - internal.initialClick[0];
    const dy = event.offsetY - internal.initialClick[1];
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  }

  /** Returns true if an instance has a valid pointer-event registered, this excludes scroll, clicks etc */
  function filterPointerEvents(objects: THREE.Object3D[]) {
    return objects.filter((obj) =>
      ["Move", "Over", "Enter", "Out", "Leave"].some(
        (name) => (obj as Instance<THREE.Object3D>["object"]).__r3f?.handlers[("onPointer" + name) as keyof EventHandlers]
      )
    );
  }

  function intersect(event: DomEvent, filter?: (objects: THREE.Object3D[]) => THREE.Object3D[]) {
    const state = store.getState();
    const duplicates = new Set<string>();
    const intersections: Intersection[] = [];
    // Allow callers to eliminate event objects
    const eventsObjects = filter ? filter(state.internal.interaction) : state.internal.interaction;
    // Reset all raycaster cameras to undefined
    for (let i = 0; i < eventsObjects.length; i++) {
      const state = getRootState(eventsObjects[i]);
      if (state) {
        state.raycaster.camera = undefined!;
      }
    }

    if (!state.previousRoot) {
      // Make sure root-level pointer and ray are set up
      state.events.compute?.(event, state);
    }

    function handleRaycast(obj: THREE.Object3D) {
      const state = getRootState(obj);
      // Skip event handling when noEvents is set, or when the raycasters camera is null
      if (!state || !state.events.enabled || state.raycaster.camera === null) return [];

      // When the camera is undefined we have to call the event layers update function
      if (state.raycaster.camera === undefined) {
        state.events.compute?.(event, state, state.previousRoot?.getState());
        // If the camera is still undefined we have to skip this layer entirely
        if (state.raycaster.camera === undefined) state.raycaster.camera = null!;
      }

      // Intersect object by object
      return state.raycaster.camera ? state.raycaster.intersectObject(obj, true) : [];
    }

    // Collect events
    let hits: THREE.Intersection<THREE.Object3D>[] = eventsObjects
      // Intersect objects
      .flatMap(handleRaycast)
      // Sort by event priority and distance
      .sort((a, b) => {
        const aState = getRootState(a.object);
        const bState = getRootState(b.object);
        if (!aState || !bState) return a.distance - b.distance;
        return bState.events.priority - aState.events.priority || a.distance - b.distance;
      })
      // Filter out duplicates
      .filter((item) => {
        const id = makeId(item as Intersection);
        if (duplicates.has(id)) return false;
        duplicates.add(id);
        return true;
      });

    // https://github.com/mrdoob/three.js/issues/16031
    // Allow custom userland intersect sort order, this likely only makes sense on the root filter
    if (state.events.filter) hits = state.events.filter(hits, state);

    // Bubble up the events, find the event source (eventObject)
    for (const hit of hits) {
      let eventObject: THREE.Object3D | null = hit.object;
      // Bubble event up
      while (eventObject) {
        if ((eventObject as Instance<THREE.Object3D>["object"]).__r3f?.eventCount) intersections.push({ ...hit, eventObject });
        eventObject = eventObject.parent;
      }
    }

    // If the interaction is captured, make all capturing targets part of the intersect.
    if ("pointerId" in event && state.internal.capturedMap.has(event.pointerId)) {
      for (const captureData of state.internal.capturedMap.get(event.pointerId)!.values()) {
        if (!duplicates.has(makeId(captureData.intersection))) intersections.push(captureData.intersection);
      }
    }
    return intersections;
  }

  /**  Handles intersections by forwarding them to handlers */
  function handleIntersects(intersections: Intersection[], event: DomEvent, delta: number, callback: (event: ThreeEvent<DomEvent>) => void) {
    // If anything has been found, forward it to the event listeners
    if (intersections.length) {
      const localState = { stopped: false };
      for (const hit of intersections) {
        let state = getRootState(hit.object);

        // If the object is not managed by R3F, it might be parented to an element which is.
        // Traverse upwards until we find a managed parent and use its state instead.
        if (!state) {
          hit.object.traverseAncestors((obj) => {
            const parentState = getRootState(obj);
            if (parentState) {
              state = parentState;
              return false;
            }
          });
        }

        if (state) {
          const { raycaster, pointer, camera, internal } = state;
          const unprojectedPoint = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera);

          const hasPointerCapture = (id: number) => internal.capturedMap.get(id)?.has(hit.eventObject) ?? false;

          const setPointerCapture = (id: number) => {
            const captureData = { intersection: hit, target: event.target as Element };
            if (internal.capturedMap.has(id)) {
              // if the pointerId was previously captured, we add the hit to the
              // event capturedMap.
              internal.capturedMap.get(id)!.set(hit.eventObject, captureData);
            } else {
              // if the pointerId was not previously captured, we create a map
              // containing the hitObject, and the hit. hitObject is used for
              // faster access.
              internal.capturedMap.set(id, new Map([[hit.eventObject, captureData]]));
            }
            // Call the original event now
            (event.target as Element).setPointerCapture(id);
          };

          const releasePointerCapture = (id: number) => {
            const captures = internal.capturedMap.get(id);
            if (captures) {
              releaseInternalPointerCapture(internal.capturedMap, hit.eventObject, captures, id);
            }
          };

          // Add native event props
          const extractEventProps: any = {};
          // This iterates over the event's properties including the inherited ones. Native PointerEvents have most of their props as getters which are inherited, but polyfilled PointerEvents have them all as their own properties (i.e. not inherited). We can't use Object.keys() or Object.entries() as they only return "own" properties; nor Object.getPrototypeOf(event) as that *doesn't* return "own" properties, only inherited ones.
          for (const prop in event) {
            const property = event[prop as keyof DomEvent];
            // Only copy over atomics, leave functions alone as these should be
            // called as event.nativeEvent.fn()
            if (typeof property !== "function") extractEventProps[prop] = property;
          }

          const raycastEvent: ThreeEvent<DomEvent> = {
            ...hit,
            ...extractEventProps,
            pointer,
            intersections,
            stopped: localState.stopped,
            delta,
            unprojectedPoint,
            ray: raycaster.ray,
            camera: camera,
            // Hijack stopPropagation, which just sets a flag
            stopPropagation() {
              // https://github.com/pmndrs/react-three-fiber/issues/596
              // Events are not allowed to stop propagation if the pointer has been captured
              const capturesForPointer = "pointerId" in event && internal.capturedMap.get(event.pointerId);

              // We only authorize stopPropagation...
              if (
                // ...if this pointer hasn't been captured
                !capturesForPointer ||
                // ... or if the hit object is capturing the pointer
                capturesForPointer.has(hit.eventObject)
              ) {
                raycastEvent.stopped = localState.stopped = true;
                // Propagation is stopped, remove all other hover records
                // An event handler is only allowed to flush other handlers if it is hovered itself
                if (internal.hovered.size && Array.from(internal.hovered.values()).find((i) => i.eventObject === hit.eventObject)) {
                  // Objects cannot flush out higher up objects that have already caught the event
                  const higher = intersections.slice(0, intersections.indexOf(hit));
                  cancelPointer([...higher, hit]);
                }
              }
            },
            // there should be a distinction between target and currentTarget
            target: { hasPointerCapture, setPointerCapture, releasePointerCapture },
            currentTarget: { hasPointerCapture, setPointerCapture, releasePointerCapture },
            nativeEvent: event,
          };

          // Call subscribers
          callback(raycastEvent);
          // Event bubbling may be interrupted by stopPropagation
          if (localState.stopped === true) break;
        }
      }
    }
    return intersections;
  }

  function cancelPointer(intersections: Intersection[]) {
    const { internal } = store.getState();
    for (const hoveredObj of internal.hovered.values()) {
      // When no objects were hit or the the hovered object wasn't found underneath the cursor
      // we call onPointerOut and delete the object from the hovered-elements map
      if (
        !intersections.length ||
        !intersections.find((hit) => hit.object === hoveredObj.object && hit.index === hoveredObj.index && hit.instanceId === hoveredObj.instanceId)
      ) {
        const eventObject = hoveredObj.eventObject;
        const instance = (eventObject as Instance<THREE.Object3D>["object"]).__r3f;
        internal.hovered.delete(makeId(hoveredObj));
        if (instance?.eventCount) {
          const handlers = instance.handlers;
          // Clear out intersects, they are outdated by now
          const data = { ...hoveredObj, intersections };
          handlers.onPointerOut?.(data as ThreeEvent<PointerEvent>);
          handlers.onPointerLeave?.(data as ThreeEvent<PointerEvent>);
        }
      }
    }
  }

  function pointerMissed(event: MouseEvent, objects: THREE.Object3D[]) {
    for (let i = 0; i < objects.length; i++) {
      const instance = (objects[i] as Instance<THREE.Object3D>["object"]).__r3f;
      instance?.handlers.onPointerMissed?.(event);
    }
  }

  function handlePointer(name: string) {
    // Deal with cancelation
    switch (name) {
      case "onPointerLeave":
      case "onPointerCancel":
        return () => cancelPointer([]);
      case "onLostPointerCapture":
        return (event: DomEvent) => {
          const { internal } = store.getState();
          if ("pointerId" in event && internal.capturedMap.has(event.pointerId)) {
            // If the object event interface had onLostPointerCapture, we'd call it here on every
            // object that's getting removed. We call it on the next frame because onLostPointerCapture
            // fires before onPointerUp. Otherwise pointerUp would never be called if the event didn't
            // happen in the object it originated from, leaving components in a in-between state.
            requestAnimationFrame(() => {
              // Only release if pointer-up didn't do it already
              if (internal.capturedMap.has(event.pointerId)) {
                internal.capturedMap.delete(event.pointerId);
                cancelPointer([]);
              }
            });
          }
        };
    }

    // Any other pointer goes here ...
    return function handleEvent(event: DomEvent) {
      const { onPointerMissed, internal } = store.getState();

      // prepareRay(event)
      // @ts-ignore
      internal.lastEvent.current = event;

      // Get fresh intersects
      const isPointerMove = name === "onPointerMove";
      const isClickEvent = name === "onClick" || name === "onContextMenu" || name === "onDoubleClick";
      const filter = isPointerMove ? filterPointerEvents : undefined;

      const hits = intersect(event, filter);
      const delta = isClickEvent ? calculateDistance(event) : 0;

      // Save initial coordinates on pointer-down
      if (name === "onPointerDown") {
        internal.initialClick = [event.offsetX, event.offsetY];
        internal.initialHits = hits.map((hit) => hit.eventObject);
      }

      // If a click yields no results, pass it back to the user as a miss
      // Missed events have to come first in order to establish user-land side-effect clean up
      if (isClickEvent && !hits.length) {
        if (delta <= 2) {
          pointerMissed(event, internal.interaction);
          if (onPointerMissed) onPointerMissed(event);
        }
      }
      // Take care of unhover
      if (isPointerMove) cancelPointer(hits);

      function onIntersect(data: ThreeEvent<DomEvent>) {
        const eventObject = data.eventObject;
        const instance = (eventObject as Instance<THREE.Object3D>["object"]).__r3f;

        // Check presence of handlers
        if (!instance?.eventCount) return;
        const handlers = instance.handlers;

        /*
        MAYBE TODO, DELETE IF NOT: 
          Check if the object is captured, captured events should not have intersects running in parallel
          But wouldn't it be better to just replace capturedMap with a single entry?
          Also, are we OK with straight up making picking up multiple objects impossible?
          
        const pointerId = (data as ThreeEvent<PointerEvent>).pointerId        
        if (pointerId !== undefined) {
          const capturedMeshSet = internal.capturedMap.get(pointerId)
          if (capturedMeshSet) {
            const captured = capturedMeshSet.get(eventObject)
            if (captured && captured.localState.stopped) return
          }
        }*/

        if (isPointerMove) {
          // Move event ...
          if (handlers.onPointerOver || handlers.onPointerEnter || handlers.onPointerOut || handlers.onPointerLeave) {
            // When enter or out is present take care of hover-state
            const id = makeId(data);
            const hoveredItem = internal.hovered.get(id);
            if (!hoveredItem) {
              // If the object wasn't previously hovered, book it and call its handler
              internal.hovered.set(id, data);
              handlers.onPointerOver?.(data as ThreeEvent<PointerEvent>);
              handlers.onPointerEnter?.(data as ThreeEvent<PointerEvent>);
            } else if (hoveredItem.stopped) {
              // If the object was previously hovered and stopped, we shouldn't allow other items to proceed
              data.stopPropagation();
            }
          }
          // Call mouse move
          handlers.onPointerMove?.(data as ThreeEvent<PointerEvent>);
        } else {
          // All other events ...
          const handler = handlers[name as keyof EventHandlers] as (event: ThreeEvent<PointerEvent>) => void;
          if (handler) {
            // Forward all events back to their respective handlers with the exception of click events,
            // which must use the initial target
            if (!isClickEvent || internal.initialHits.includes(eventObject)) {
              // Missed events have to come first
              pointerMissed(
                event,
                internal.interaction.filter((object) => !internal.initialHits.includes(object))
              );
              // Now call the handler
              handler(data as ThreeEvent<PointerEvent>);
            }
          } else {
            // Trigger onPointerMissed on all elements that have pointer over/out handlers, but not click and weren't hit
            if (isClickEvent && internal.initialHits.includes(eventObject)) {
              pointerMissed(
                event,
                internal.interaction.filter((object) => !internal.initialHits.includes(object))
              );
            }
          }
        }
      }

      handleIntersects(hits, event, delta, onIntersect);
    };
  }

  return { handlePointer };
}
