/**
 * useLynxGlobalEventListener - Hook for early event listener registration.
 *
 * This hook registers an event listener via Lynx's GlobalEventEmitter as early
 * as possible (during the commit phase via useMemo) and cleans up on unmount.
 */

import { useEffect, useMemo, useRef } from "@my-react/react";

/**
 * `useLynxGlobalEventListener` helps you `addListener` as early as possible.
 *
 * @example
 * ```tsx
 * function App() {
 *   useLynxGlobalEventListener('exposure', (e) => {
 *     console.log("exposure", e)
 *   })
 *   useLynxGlobalEventListener('disexposure', (e) => {
 *     console.log("disexposure", e)
 *   })
 *   return (
 *     <view
 *       style={{ width: 100, height: 100, backgroundColor: 'red' }}
 *       exposure-id='a'
 *     />
 *   )
 * }
 * ```
 *
 * @param eventName - Event name to listen
 * @param listener - Event handler
 * @public
 */
export function useLynxGlobalEventListener<T extends (...args: any[]) => void>(eventName: string, listener: T): void {
  "background only";

  const previousArgsRef = useRef<[string, T]>();

  useMemo(() => {
    if (previousArgsRef.current) {
      const [prevEventName, prevListener] = previousArgsRef.current;
      lynx.getJSModule("GlobalEventEmitter").removeListener(prevEventName, prevListener);
    }
    lynx.getJSModule("GlobalEventEmitter").addListener(eventName, listener);
    previousArgsRef.current = [eventName, listener];
  }, [eventName, listener]);

  useEffect(() => {
    return () => {
      if (previousArgsRef.current) {
        const [prevEventName, prevListener] = previousArgsRef.current;
        lynx.getJSModule("GlobalEventEmitter").removeListener(prevEventName, prevListener);
      }
    };
  }, []);
}
