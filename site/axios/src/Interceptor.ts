import { AxiosError } from "axios";

import { __SERVER__ } from "./env";

export const serverLog = (error: AxiosError | Error | unknown) => {
  if (__SERVER__ || __DEV__) {
    if (error instanceof AxiosError) {
      const { config, status } = error;
      console.error(`[axios]: request error, url: ${config?.baseURL}${config?.url}, statusCode: ${status}, error: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`[axios]: request error, message: ${error.message}`);
    } else {
      console.error(`[axios]: request error`);
    }
  }
  throw error;
};
