import type { Cancel, Delay, KeyMap, ReJectMap, TimeoutMap } from "@client/types/util";

const timeoutMap: TimeoutMap = {};
const rejectMap: ReJectMap = {};
const keyMap: KeyMap = {};
let keyLength = 0;
const maxKeyLength = 200;

const cancel: Cancel = (key) => {
  if (timeoutMap[key]) {
    const length = timeoutMap[key].length;
    timeoutMap[key] = timeoutMap[key].map((id) => id && clearTimeout(id)).slice(length);
    rejectMap[key] = rejectMap[key].map((reject) => reject && reject()).slice(length);
  }
  if (keyLength > maxKeyLength) {
    const keys = Object.keys(keyMap).sort((key1, key2) => (keyMap[key1] > keyMap[key2] ? 1 : -1));
    for (const keyItem of keys) {
      if (keyItem !== key && !rejectMap[keyItem].length) {
        delete keyMap[keyItem];
        delete timeoutMap[keyItem];
        delete rejectMap[keyItem];
        keyLength--;
      }
    }
  }
};

const delay: Delay = (time, action, key) => {
  if (key === undefined) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    }).then(() => {
      if (action) return action();
    });
  } else {
    if (!(key in keyMap)) {
      keyMap[key] = 1;
      timeoutMap[key] = [];
      rejectMap[key] = [];
      keyLength++;
    } else {
      keyMap[key]++;
    }
    cancel(key);
    return new Promise<void>((resolve, reject) => {
      rejectMap[key].push(reject);
      timeoutMap[key].push(
        setTimeout(() => {
          resolve();
        }, time)
      );
    })
      .then(() => {
        if (action) return action();
      })
      .catch(() => void 0);
  }
};

export { delay, cancel };
