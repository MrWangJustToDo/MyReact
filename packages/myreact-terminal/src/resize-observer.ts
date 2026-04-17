import { type DOMElement } from "./dom.js";

export type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

export class ResizeObserverEntry {
  constructor(
    readonly target: DOMElement,
    readonly contentRect: { width: number; height: number }
  ) {}
}

export default class ResizeObserver {
  private readonly observedElements = new Set<DOMElement>();

  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(element: DOMElement): void {
    if (this.observedElements.has(element)) {
      return;
    }

    this.observedElements.add(element);
    element.resizeObservers ||= new Set();
    element.resizeObservers.add(this);

    let lastMeasuredSize = element.internal_lastMeasuredSize;
    if (lastMeasuredSize === undefined && element.yogaNode) {
      const width = Math.round(element.yogaNode.getComputedWidth());
      const height = Math.round(element.yogaNode.getComputedHeight());
      if (!Number.isNaN(width) && !Number.isNaN(height)) {
        lastMeasuredSize = { width, height };
        element.internal_lastMeasuredSize = lastMeasuredSize;
      }
    }

    if (lastMeasuredSize) {
      const entry = new ResizeObserverEntry(element, lastMeasuredSize);
      try {
        this.callback([entry], this);
      } catch (error) {
        console.error(error);
      }
    }
  }

  unobserve(element: DOMElement): void {
    this.observedElements.delete(element);
    element.resizeObservers?.delete(this);
  }

  disconnect(): void {
    for (const element of this.observedElements) {
      element.resizeObservers?.delete(this);
    }

    this.observedElements.clear();
  }

  // Internal method called by Ink during layout
  internalTrigger(entries: ResizeObserverEntry[]): void {
    try {
      this.callback(entries, this);
    } catch (error) {
      console.error(error);
    }
  }
}

export function measureAndExtractObservers(node: DOMElement, observerEntries: Map<ResizeObserver, ResizeObserverEntry[]>, forceCache = false): void {
  const hasObservers = node.resizeObservers && node.resizeObservers.size > 0;
  if ((hasObservers || forceCache) && node.yogaNode) {
    const width = Math.round(node.yogaNode.getComputedWidth());
    const height = Math.round(node.yogaNode.getComputedHeight());

    if (!Number.isNaN(width) && !Number.isNaN(height)) {
      const lastSize = node.internal_lastMeasuredSize;

      if (!lastSize || lastSize.width !== width || lastSize.height !== height) {
        node.internal_lastMeasuredSize = { width, height };

        if (hasObservers) {
          const entry = new ResizeObserverEntry(node, { width, height });

          for (const observer of node.resizeObservers!) {
            if (!observerEntries.has(observer)) {
              observerEntries.set(observer, []);
            }

            observerEntries.get(observer)!.push(entry);
          }
        }
      }
    }
  }
}

export function triggerResizeObservers(node: DOMElement, forceCache = false): void {
  const observerEntries = new Map<ResizeObserver, ResizeObserverEntry[]>();

  function traverse(n: DOMElement) {
    measureAndExtractObservers(n, observerEntries, forceCache);

    if (n.internal_static || (n.nodeName === "ink-static-render" && n !== node)) {
      return;
    }

    for (const child of n.childNodes) {
      if (child.nodeName !== "#text") {
        traverse(child);
      }
    }
  }

  traverse(node);

  for (const [observer, entries] of observerEntries) {
    observer.internalTrigger(entries);
  }
}
