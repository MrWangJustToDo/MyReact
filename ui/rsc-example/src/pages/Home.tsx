import { lazy, Suspense } from "react";

import Guestbook from "../components/client/Guestbook";
import ThemeToggle from "../components/client/ThemeToggle";
import Counter from "../components/Counter";
import ServerStats from "../components/server/ServerStats";
import TodoList from "../components/TodoList";

const LazyCom = lazy(() => import("../components/client/LazyCom"));

async function getGreeting() {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return "Welcome to the MyReact RSC + SSR demo";
}

export default function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-meta">
          <span className="hero-pill">RSC + SSR</span>
          <span>MyReact demo workspace</span>
        </div>
        <h1 className="hero-title">RSC + SSR workspace</h1>
        <p className="muted">Server components render instantly, client components hydrate in place.</p>
      </section>

      <div className="card">
        <h2>Server Data + Suspense</h2>
        <div className="card-grid">
          <Suspense fallback={<p className="loading">Fetching greeting...</p>}>
            <Greeting />
          </Suspense>
          <Suspense fallback={<p className="loading">Loading stats...</p>}>
            <ServerStats />
          </Suspense>
          <Suspense fallback={<p className="loading">Loading lazy...</p>}>
            <LazyCom />
          </Suspense>
        </div>
      </div>

      <div className="card">
        <h2>Client Interop</h2>
        <p>Client state + effects inside a server page.</p>
        <ThemeToggle />
        <Counter initialCount={2} />
      </div>

      <div className="card">
        <h2>Server Actions</h2>
        <Guestbook />
      </div>

      <div className="card">
        <h2>Todo List</h2>
        <TodoList />
      </div>
    </div>
  );
}

async function Greeting() {
  const greeting = await getGreeting();
  return <p>{greeting}</p>;
}
