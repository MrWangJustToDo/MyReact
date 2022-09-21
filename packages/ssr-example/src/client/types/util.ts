/* delay */
interface Cancel {
  (key: string): void;
}
interface Delay {
  <T>(time: number, action?: () => T, key?: string): Promise<T | void>;
}
interface TimeoutMap {
  [props: string]: Array<NodeJS.Timeout | void>;
}
interface ReJectMap {
  [props: string]: Array<(() => void) | void>;
}
interface KeyMap {
  [props: string]: number;
}

export type { Cancel, Delay, TimeoutMap, ReJectMap, KeyMap };
