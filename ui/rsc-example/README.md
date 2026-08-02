# RSC Example

React Server Components with MyReact + Vite, aligned with `@vitejs/plugin-rsc` conventions.

## Layout

| Path                                                | Role                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/framework/entry.rsc.tsx`                       | **Request handler** — `default export handler(Request)` routes HTML / `/__rsc` / `/__rsc_action` |
| `src/framework/entry.ssr.tsx`                       | Decodes Flight → HTML (`renderHTML`)                                                             |
| `src/framework/entry.browser.tsx`                   | Client hydrate + client-side navigation                                                          |
| `src/root.tsx`, `pages/`, `components/`, `actions/` | Application / demo UI                                                                            |
| `server.mjs`                                        | **Production only** — pure Node, `import(dist/rsc)` + static `dist/client` (no Vite)             |

## Run

```bash
pnpm install
pnpm --filter rsc-example dev
pnpm --filter rsc-example build
pnpm --filter rsc-example start
```

Open `http://localhost:3000`.

## Routes

- `/` Feature demo (server components, client islands, server actions)
- `/about` Async server metadata
- `/profile/:id` Server shell + client profile island

## Notes

- Client components need `"use client"`.
- Server actions need `"use server"`.
- HTML SSR expects `<div id="root"></div>` in `index.html`.
- Prod `server.mjs` installs a CJS resolve hook so `@my-react/react-dom`'s `require("react")` hits `@my-react/react`.
