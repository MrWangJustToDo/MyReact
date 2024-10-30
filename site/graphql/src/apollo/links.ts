import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { fetch } from "cross-fetch";

const BLOG_API = "https://api.github.com/graphql";

const isBrowser = typeof window !== "undefined";

const token = [
  180, 100, 208, 238, 176, 100, 230, 96, 172, 140, 156, 194, 154, 100, 156, 178, 174, 172, 198, 98, 196, 220, 132, 166, 198, 100, 148, 194, 156, 140, 224, 230,
  200, 96, 172, 174, 200, 244, 148, 172, 166, 144, 180, 242, 166, 168, 148, 228, 156, 140, 172, 208, 168, 206, 122, 122,
];

const tokenString = token
  .map((i) => i >> 1)
  .map((s) => String.fromCharCode(s))
  .join("");

const generateFetchWithTimeout = (timeout: number) => {
  return (input: RequestInfo, init: RequestInit) => {
    return new Promise<Response>((resolve, reject) => {
      const controller = new AbortController();
      const { signal } = controller;

      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error("Request timed out"));
      }, timeout);

      fetch(input, { ...init, signal })
        .then((response) => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };
};

export const httpLink = new HttpLink({
  uri: BLOG_API,
  fetch: typeof fetch === "function" ? generateFetchWithTimeout(5000) : fetch,
});

export const onErrorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    console.error(`network error \n[message]: ${networkError.message}  \n[stack]: ${networkError.stack}`);
  }
  if (graphQLErrors?.length) {
    graphQLErrors.forEach((error) => {
      console.error(`graphql error \n[message]: ${error.message} \n[stack]: ${error.path}`);
    });
  }
});

export const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `token ${isBrowser ? atob(tokenString) : Buffer.from(tokenString, "base64").toString()}`,
    },
  };
});
