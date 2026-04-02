# RSC Example

This example demonstrates React Server Components (RSC) with MyReact using Vite.

## What it includes

- RSC endpoint (Flight stream)
- SSR HTML rendering that consumes the Flight stream
- Client hydration using the injected Flight stream
- Server Actions support
- Multi-page routing (Home/About/Profile)
- Client navigation that refetches RSC
- Suspense streaming sections

## Key files

- `src/entry-rsc.tsx` – produces the Flight stream
- `src/entry-ssr.tsx` – decodes Flight and renders HTML
- `src/entry-client.tsx` – bootstraps the client
- `src/main.tsx` – client hydration and fallback CSR
- `vite.config.ts` – wires SSR + RSC in dev

## Run

```bash
pnpm install
pnpm build
pnpm dev
```

Open `http://localhost:3000`.

## Routes

- `/` Home (server data + client widgets)
- `/about` About (server data)
- `/profile/:id` Profile (client card)

## Notes

- Client components must include a `"use client"` directive.
- Server actions must include a `"use server"` directive inside the async function body.
- SSR uses the real module source by requesting `?rsc-original` to bypass RSC transforms.
