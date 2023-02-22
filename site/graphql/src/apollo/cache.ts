import { InMemoryCache } from "@apollo/client";

export const autoMergeCache = new InMemoryCache({
  typePolicies: {
    Repository: {
      fields: {
        issues: {
          keyArgs: false,
          merge(existing = { nodes: [] }, incoming) {
            if (existing?.pageInfo?.startCursor === incoming?.pageInfo?.startCursor) return existing;
            return {
              ...existing,
              ...incoming,
              nodes: [...existing.nodes, ...incoming.nodes],
            };
          },
        },
      },
    },
    Issue: {
      fields: {
        comments: {
          keyArgs: false,
          merge(existing = { nodes: [] }, incoming) {
            if (existing?.pageInfo?.startCursor === incoming?.pageInfo?.startCursor) return existing;
            return {
              ...existing,
              ...incoming,
              nodes: [...existing.nodes, ...incoming.nodes],
            };
          },
        },
      },
    },
  },
});

export const plainCache = new InMemoryCache();
