import { HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
// import { generateFetchWithTimeout } from "@site/axios";
import { fetch } from "cross-fetch";

const BLOG_API = "https://api.github.com/graphql";

const isBrowser = typeof window !== "undefined";

export const httpLink = new HttpLink({
  uri: BLOG_API,
  fetch,
});

export const onErrorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    console.error(`network error \n[message]: ${networkError.message}  \n[stack]: ${networkError.stack}`);
  }
  if (graphQLErrors?.length) {
    graphQLErrors.forEach((error) => {
      console.error(`graphql error \n[message]: ${error.message} \n[stack]: ${error.stack}`);
    });
  }
});

export const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `token ${
        isBrowser
          ? atob("Z2hwX2JMeHRuN2N4dGZjc0M5OXBVTlgzZmJ5dHFBejI2RjFEUHZ5TA==")
          : Buffer.from("Z2hwX2JMeHRuN2N4dGZjc0M5OXBVTlgzZmJ5dHFBejI2RjFEUHZ5TA==", "base64").toString()
      }`,
    },
  };
});
