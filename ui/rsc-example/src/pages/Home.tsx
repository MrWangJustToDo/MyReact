import { lazy, Suspense } from "react";

import Guestbook from "../components/client/Guestbook";
import ThemeToggle from "../components/client/ThemeToggle";
import Counter from "../components/Counter";
import ServerStats from "../components/server/ServerStats";
import TodoList from "../components/TodoList";

const LazyCom = lazy(() => import("../components/client/LazyCom"));

async function getGreeting() {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return "Server Component finished fetching on the server.";
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">React Server Components</p>
        <h1>MyReact RSC</h1>
        <p className="lede">One page to exercise Flight streaming, Suspense, client islands, and server actions — without a framework router.</p>
      </section>

      <section className="feature" aria-labelledby="sc-heading">
        <div className="feature-copy">
          <h2 id="sc-heading">Server Components</h2>
          <p>Async data stays on the server. HTML arrives with the first paint; no client fetch waterfall.</p>
        </div>
        <div className="feature-demo">
          <Suspense fallback={<p className="loading">Fetching greeting…</p>}>
            {/* @ts-expect-error async Server Component under React 18 JSX types */}
            <Greeting />
          </Suspense>
          <Suspense fallback={<p className="loading">Loading stats…</p>}>
            {/* @ts-expect-error async Server Component under React 18 JSX types */}
            <ServerStats />
          </Suspense>
          <Suspense fallback={<p className="loading">Loading lazy slot…</p>}>
            <LazyCom />
          </Suspense>
        </div>
      </section>

      <section className="feature feature-alt" aria-labelledby="cc-heading">
        <div className="feature-copy">
          <h2 id="cc-heading">Client Components</h2>
          <p>
            Marked with <code>&quot;use client&quot;</code>. Hydrate only where interactivity is needed.
          </p>
        </div>
        <div className="feature-demo feature-demo-row">
          <ThemeToggle />
          <Counter initialCount={2} />
        </div>
      </section>

      <section className="feature" aria-labelledby="sa-heading">
        <div className="feature-copy">
          <h2 id="sa-heading">Server Actions</h2>
          <p>
            Mutations via <code>&quot;use server&quot;</code> — form POST and client <code>callServer</code> both hit <code>/__rsc_action</code>.
          </p>
        </div>
        <div className="feature-demo feature-demo-stack">
          <Guestbook />
          <TodoList />
        </div>
      </section>
    </>
  );
}

async function Greeting() {
  const greeting = await getGreeting();
  return <p className="stat-line">{greeting}</p>;
}
