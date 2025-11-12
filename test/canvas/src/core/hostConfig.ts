/* eslint-disable max-lines */
import { ContinuousEventPriority, DefaultEventPriority, DiscreteEventPriority } from "react-reconciler/constants";

import { renderInstance } from "./renderUtils";

import type {
  ChildSet,
  Container,
  HostContext,
  HydratableInstance,
  Instance,
  InstanceAttributes,
  NoTimeout,
  Props,
  PublicInstance,
  SuspenseInstance,
  TextInstance,
  TimeoutHandle,
  Type,
  UpdatePayload,
} from "./types";
import type { HostConfig } from "react-reconciler";

export const hostConfig: HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  NoTimeout
> = {
  // -------------------
  //        Modes
  // -------------------

  /**
   * Indicates that the renderer uses mutation mode.
   * In mutation mode, the renderer mutates the host tree directly to apply updates.
   * Since we can directly manipulate our canvas instances, mutation mode is appropriate.
   * Mutation mode is suitable for platforms that allow direct manipulation of nodes, like the DOM or Canvas.
   * We set `supportsMutation` to `true` to enable mutation mode.
   */
  supportsMutation: true,

  /**
   * Indicates that the renderer does not support persistence mode.
   * In persistence mode, the renderer creates a new tree of host instances and swaps it in place of the old one.
   * Persistence mode is used when you can't or don't want to mutate existing host instances.
   * Since we are mutating our instances directly, we set `supportsPersistence` to `false`.
   */
  supportsPersistence: false,

  /**
   * Indicates that the renderer does not support hydration.
   * Hydration is the process of attaching React's virtual tree to an existing host tree, like server-rendered HTML.
   * We set `supportsHydration` to `false`.
   */
  supportsHydration: false,

  /**
   * Determines whether the renderer is the primary renderer for the target platform.
   * The primary renderer is responsible for scheduling and batching updates.
   * Since our renderer is likely coexisting with React DOM (which is the primary renderer for web),
   * we set `isPrimaryRenderer` to `false`.
   */
  isPrimaryRenderer: false,

  /**
   * Enables warnings if updates are made outside of React's `act()` testing utility.
   * This is helpful for detecting unexpected side effects during tests.
   * We set `warnsIfNotActing` to `true` to enable these warnings.
   */
  warnsIfNotActing: true,

  // -------------------
  //    Event Priority
  // -------------------

  /**
   * Returns the priority level of the current event.
   * React uses this to prioritize updates based on user interactions.
   * We check the type of the current event and return the appropriate priority level.
   * This helps React to schedule updates efficiently, giving higher priority to user-initiated events.
   */
  getCurrentEventPriority: () => {
    const currentEvent = window.event;

    if (currentEvent) {
      switch (currentEvent.type) {
        case "click":
        case "keydown":
        case "keyup":
        case "input":
          /**
           * Discrete events represent user actions that should interrupt other work.
           * These events are intentional and should be handled immediately.
           * We return `DiscreteEventPriority` for such events.
           */
          return DiscreteEventPriority;

        case "mousemove":
        case "mouseenter":
        case "mouseleave":
        case "wheel":
          /**
           * Continuous events occur frequently and can be batched together.
           * We return `ContinuousEventPriority` for such events.
           */
          return ContinuousEventPriority;

        default:
          /**
           * For other events, we return the default event priority.
           * This means they can be handled at a lower priority.
           */
          return DefaultEventPriority;
      }
    }

    /**
     * If there is no current event (e.g., when updates are scheduled programmatically),
     * we return the default event priority.
     */
    return DefaultEventPriority;
  },

  // -------------------
  //    Core Methods
  // -------------------

  /**
   * Creates a new instance of a host component (e.g., a rectangle or circle).
   * @param type - The type of component to create.
   * @param props - The properties of the component.
   * @param rootContainerInstance - The root of the rendering tree.
   * @returns A new instance representing the component.
   *
   * In this method, we create our custom instance object, which includes:
   * - `type`: The type of the component (e.g., 'canvasRect', 'canvasCircle').
   * - `props`: The properties passed to the component.
   * - `parent`: A reference to the parent instance (initially `null`).
   * - `children`: An array to hold child instances.
   * - `attributes`: Attributes used for rendering (e.g., position).
   * - `container`: A reference to the root container.
   *
   * This method is called during the render phase and should not have side effects
   * outside of the newly created instance.
   */
  createInstance(type, props, rootContainerInstance) {
    const attributes: InstanceAttributes = {
      x: props.x,
      y: props.y,
    };

    return {
      type,
      props,
      parent: null,
      children: [],
      attributes,
      container: rootContainerInstance,
    };
  },

  /**
   * Creates a text instance for rendering text in the canvas.
   *
   * @param text - The text content to be displayed.
   * @param rootContainerInstance - The root container where the text instance will be added.
   * @returns An instance representing the text node in the canvas.
   *
   * This method is not supported in the canvas renderer because it relies on the browser's native text rendering capabilities, which are not compatible with the canvas element's rendering model.
   * The canvas renderer is designed to work with shapes and graphics, and does not have the necessary infrastructure to handle text rendering.
   * As a result, attempting to create a text instance will result in an error.
   */
  createTextInstance() {
    throw new Error("Canvas renderer does not support text instances");
  },

  /**
   * Appends a child instance to a parent instance during the initial render phase.
   * @param parentInstance - The parent instance to which the child will be added.
   * @param child - The child instance to add.
   *
   * This method mutates the `parentInstance` by adding the `child` to its `children` array.
   * It also sets the `parent` reference of the `child` to the `parentInstance`.
   * This method happens during the render phase and should not have side effects
   * outside of the parent and child instances.
   */
  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child);
    child.parent = parentInstance;
  },

  /**
   * Finalizes the initial properties of an instance before it is added to the tree.
   * @returns A boolean indicating whether additional work is needed.
   *
   * If this method returns `true`, React will call `commitMount` later.
   * Since we don't have any additional initialization to do, we return `false`.
   * This method happens during the render phase.
   */
  finalizeInitialChildren() {
    return false;
  },

  /**
   * Prepares an update payload by comparing the old props and new props.
   * @param _instance - The instance to update (unused here).
   * @param _type - The type of the instance (unused here).
   * @param oldProps - The previous properties.
   * @param newProps - The new properties.
   * @returns An object representing the changes, or `null` if there are none.
   *
   * This method runs during the render phase and should not mutate the instance.
   * We compare each property in `newProps` to `oldProps` and collect the differences.
   * If there are differences, we return an `updatePayload` object.
   * Otherwise, we return `null` to indicate no update is needed.
   */
  prepareUpdate(_instance, _type, oldProps, newProps) {
    const updatePayload: Partial<Props> = {};

    for (const key in newProps) {
      if (Object.prototype.hasOwnProperty.call(newProps, key)) {
        const typedKey = key as keyof Props;

        if (oldProps[typedKey] !== newProps[typedKey]) {
          (updatePayload as Record<keyof Props, unknown>)[typedKey] = newProps[typedKey];
        }
      }
    }

    // If there are any changes, return the updatePayload object; otherwise, return null.
    return Object.keys(updatePayload).length > 0 ? updatePayload : null;
  },

  /**
   * Determines whether the renderer should set text content for a given type and props.
   * @returns A boolean indicating whether to set text content.
   *
   * Since we handle text within our canvas shapes and don't have text nodes, we return `false`.
   * This method happens during the render phase.
   */
  shouldSetTextContent() {
    return false;
  },

  /**
   * Returns the root host context, which can be used to store information about the root.
   * @returns The root host context object.
   *
   * In our case, we don't need any host context, so we return an empty object.
   * Host context is used to pass information down the tree during rendering.
   * This method happens during the render phase.
   */
  getRootHostContext() {
    return {};
  },

  /**
   * Returns the child host context, which can be used to pass information down the tree.
   * @returns The child host context object.
   *
   * Since we don't use host context, we return the same empty object.
   * This method happens during the render phase.
   */
  getChildHostContext() {
    return {};
  },

  /**
   * Returns the public instance that will be exposed via refs.
   * @param instance - The internal instance.
   * @returns The public instance.
   *
   * We return the `attributes` of our instance (e.g., position).
   * This allows users to access instance attributes through refs.
   */
  getPublicInstance(instance) {
    return instance.attributes;
  },

  /**
   * Called before React makes changes to the tree on the screen.
   * @returns An object or `null`.
   *
   * Can be used to save the current state or perform preparations before the commit phase.
   * We don't need to do anything here, so we return `null`.
   */
  prepareForCommit() {
    return null;
  },

  /**
   * Called after React has made changes to the tree.
   *
   * Can be used to restore state saved in `prepareForCommit`.
   * We don't need to do anything here, so we leave it empty.
   */
  resetAfterCommit() {},

  /**
   * Called when a portal is being prepared to mount.
   *
   * We don't use portals in our renderer, so this is a no-op.
   */
  preparePortalMount() {},

  /**
   * Schedules a timeout. Used by React for time-based updates.
   * @param fn - The callback function to execute.
   * @param delay - The delay in milliseconds.
   * @returns A timeout handle.
   *
   * We implement it using the browser's `setTimeout` function.
   */
  scheduleTimeout(fn, delay) {
    return setTimeout(fn, delay);
  },

  /**
   * Cancels a timeout scheduled with `scheduleTimeout`.
   * @param id - The timeout handle.
   *
   * We implement it using the browser's `clearTimeout` function.
   */
  cancelTimeout(id) {
    clearTimeout(id);
  },

  /**
   * Represents a value that can never be a valid timeout handle.
   *
   * Used by React as a sentinel value to represent no timeout.
   */
  noTimeout: -1 as const,

  // -------------------
  //  Mutation Methods
  // -------------------

  /**
   * Adds a child instance to a parent instance during the commit phase.
   *
   * This method appends the `child` to the `parentInstance`'s `children` array,
   * sets the child's `parent` reference to the `parentInstance`, and calls `renderInstance`
   * to draw the child onto the canvas relative to its parent.
   *
   * @param parentInstance - The parent instance to which the child will be appended.
   * @param child - The child instance to add to the parent.
   *
   * By updating the tree structure and rendering the child, this ensures that
   * the canvas accurately reflects the current state of the virtual tree.
   */
  appendChild(parentInstance, child) {
    parentInstance.children.push(child);
    child.parent = parentInstance;

    const container = parentInstance.container;
    const parentX = parentInstance.props.x ?? 0;
    const parentY = parentInstance.props.y ?? 0;

    renderInstance(child, container, parentX, parentY);
  },

  /**
   * Appends a child instance directly to the root container.
   * @param container - The root container.
   * @param child - The child instance to append.
   *
   * Used when adding a child to the root of the tree.
   * Mutates the container's `children` array and renders the child.
   * This method happens during the commit phase.
   */
  appendChildToContainer(container, child) {
    container.children.push(child);
    renderInstance(child, container);
  },

  /**
   * Inserts a child instance before another child in a parent instance.
   * @param parentInstance - The parent instance.
   * @param child - The child instance to insert.
   * @param beforeChild - The child before which to insert.
   *
   * Used for reordering or inserting nodes.
   * Mutates the `parentInstance`'s `children` array.
   * This method happens during the commit phase.
   */
  insertBefore(parentInstance, child, beforeChild) {
    const index = parentInstance.children.indexOf(beforeChild);
    if (index !== -1) {
      parentInstance.children.splice(index, 0, child);
      child.parent = parentInstance;
      parentInstance.container.invalidate();
    }
  },

  /**
   * Inserts a child instance before another child in the root container.
   * @param container - The root container.
   * @param child - The child instance to insert.
   * @param beforeChild - The child before which to insert.
   *
   * Used when inserting at the root level.
   * Mutates the container's `children` array.
   * This method happens during the commit phase.
   */
  insertInContainerBefore(container, child, beforeChild) {
    const index = container.children.indexOf(beforeChild);
    if (index !== -1) {
      container.children.splice(index, 0, child);
      container.invalidate();
    }
  },

  /**
   * Removes a child instance from its parent instance.
   * @param parentInstance - The parent instance.
   * @param child - The child instance to remove.
   *
   * Mutates the `parentInstance`'s `children` array and sets the child's `parent` to `null`.
   * Also invalidates the container to trigger a re-render.
   * This method happens during the commit phase.
   */
  removeChild(parentInstance, child) {
    if (child) {
      parentInstance.children = parentInstance.children.filter((x) => x !== child);
      child.parent = null;
      parentInstance.container.invalidate();
    }
  },

  /**
   * Removes a child instance from the root container.
   * @param container - The root container.
   * @param child - The child instance to remove.
   *
   * Mutates the container's `children` array and invalidates the container.
   * This method happens during the commit phase.
   */
  removeChildFromContainer(container, child) {
    const index = container.children.indexOf(child);
    if (index !== -1) {
      container.children.splice(index, 1);
      container.invalidate();
    }
  },

  /**
   * Commits an update to an instance based on the `updatePayload` returned from `prepareUpdate`.
   * @param instance - The instance to update.
   * @param updatePayload - The object representing the changes.
   *
   * Mutates the instance's `props` and `attributes`, and invalidates the container to trigger a re-render.
   * This method happens during the commit phase.
   */
  commitUpdate(instance, updatePayload) {
    instance.props = {
      ...instance.props,
      ...(updatePayload as Props),
    };

    instance.attributes = {
      ...instance.attributes,
      ...updatePayload,
    };
    instance.container.invalidate();
  },

  /**
   * Commits a text update.
   * @throws An error because text instances are not supported.
   *
   * Since we don't support text instances, we throw an error.
   */
  commitTextUpdate() {
    throw new Error("Canvas renderer does not support text instances");
  },

  /**
   * Clears all children from the container and clears the canvas.
   * @param container - The root container.
   *
   * Used when the container needs to be reset.
   * This method happens during the commit phase.
   */
  clearContainer(container) {
    container.children = [];
    container.ctx.clearRect(0, 0, container.canvas.width, container.canvas.height);
  },

  /**
   * Called when an instance is deleted.
   *
   * Can be used to perform cleanup or release resources.
   * We don't have any resources to clean up, so we leave it empty.
   */
  detachDeletedInstance() {},

  /**
   * Called before an active instance (e.g., one with focus) loses focus.
   *
   * We don't need to handle focus management, so we leave it empty.
   */
  beforeActiveInstanceBlur() {},

  /**
   * Called after an active instance has lost focus.
   *
   * We don't need to handle focus management, so we leave it empty.
   */
  afterActiveInstanceBlur() {},

  /**
   * Called when a scope is updated.
   *
   * Scope in React is a concept used for managing event handling and propagation.
   * It's particularly useful in custom renderers for defining how events should
   * bubble up through the component tree. However, in this canvas renderer,
   * we don't utilize scopes for event handling.
   *
   * Scopes are used for event propagation in some renderers.
   * Since we don't use scopes, this is a no-op.
   */
  prepareScopeUpdate() {},

  /**
   * Gets an instance from a scope.
   * @returns `null` because we don't use scopes.
   *
   * We don't use scopes, so we return `null`.
   */
  getInstanceFromScope() {
    return null;
  },

  /**
   * Gets an instance from a node (e.g., DOM node).
   * @returns `null` because we don't have host nodes.
   *
   * Since we don't have host nodes, we return `null`.
   */
  getInstanceFromNode() {
    return null;
  },
};
