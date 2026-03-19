/**
 * App Component - Server Component (default)
 *
 * This is a server component by default (no "use client" directive).
 * It can fetch data and render on the server.
 */

import { Suspense } from "@my-react/react";

import Counter from "./components/Counter";
import TodoList from "./components/TodoList";

// Simulated async data fetching
async function fetchGreeting(): Promise<string> {
  // In a real app, this would fetch from a database or API
  await new Promise((resolve) => setTimeout(resolve, 100));
  return "Welcome to MyReact RSC!";
}

// This is a server component - it can be async
export default function App() {
  return (
    <div className="container">
      <h1>MyReact RSC Example</h1>

      <div className="card">
        <h2>Server Component</h2>
        <p>This component renders on the server and sends HTML to the client.</p>
        <Suspense fallback={<p className="loading">Loading greeting...</p>}>
          <Greeting />
        </Suspense>
      </div>

      <div className="card">
        <h2>Client Component (use client)</h2>
        <p>This component has interactivity and runs on the client.</p>
        <Counter initialCount={0} />
      </div>

      <div className="card">
        <h2>Server Action (use server)</h2>
        <p>This form uses a server action for submission.</p>
        <TodoList />
      </div>
    </div>
  );
}

// Async server component
async function Greeting() {
  const greeting = await fetchGreeting();
  return <p>{greeting}</p>;
}
