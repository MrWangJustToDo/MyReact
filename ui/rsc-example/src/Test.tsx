"use server";

// Simulated async data fetching
async function fetchGreeting(): Promise<string> {
  // In a real app, this would fetch from a database or API
  await new Promise((resolve) => setTimeout(resolve, 100));
  return "Welcome to MyReact RSC!";
}

// Async server component
export async function Greeting() {
  const greeting = await fetchGreeting();
  return <p>{greeting}</p>;
}
