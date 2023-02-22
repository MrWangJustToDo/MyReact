import { FetchTimeOutError } from "./error";

export const generateFetchWithTimeout = (timeout?: number) => {
  return async (...props: Parameters<typeof fetch>) => {
    const promiseChain = [fetch(...props)];

    if (timeout) {
      promiseChain.push(
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new FetchTimeOutError(`${timeout} ms timeout to fetch`));
          }, timeout);
        }),
      );
    }

    return await Promise.race(promiseChain);
  };
};
