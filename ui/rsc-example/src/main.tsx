/**
 * RSC Example - Entry Point
 *
 * This example demonstrates React Server Components with MyReact.
 * - Server components run on the server and return serialized data
 * - Client components handle interactivity with "use client" directive
 * - Server actions handle form submissions with "use server" directive
 */

import { createRoot } from "@my-react/react-dom/client";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
