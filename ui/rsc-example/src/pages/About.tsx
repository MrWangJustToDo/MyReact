import { Suspense } from "react";

async function loadInfo() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    version: "0.3.x",
    renderer: "@my-react/react-dom",
    runtime: "MyReact",
  };
}

export default function AboutPage() {
  return (
    <div className="page">
      <h1>About</h1>
      <p className="muted">This page is a server component with async data.</p>

      <div className="card">
        <Suspense fallback={<p className="loading">Loading metadata...</p>}>
          <AboutInfo />
        </Suspense>
      </div>
    </div>
  );
}

async function AboutInfo() {
  const info = await loadInfo();
  return (
    <ul>
      <li>Version: {info.version}</li>
      <li>Renderer: {info.renderer}</li>
      <li>Runtime: {info.runtime}</li>
    </ul>
  );
}
