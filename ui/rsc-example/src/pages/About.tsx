import { Suspense } from "react";

async function loadInfo() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    version: "0.3.x",
    renderer: "@my-react/react-dom",
    flight: "@my-react/react-server + @lazarv/rsc",
    bundler: "@my-react/react-vite/rsc",
  };
}

export default function AboutPage() {
  return (
    <section className="page-block">
      <h1>About</h1>
      <p className="lede narrow">Pure server page — no client JS for this tree except shared chrome.</p>
      <Suspense fallback={<p className="loading">Loading metadata…</p>}>
        {/* @ts-expect-error async Server Component under React 18 JSX types */}
        <AboutInfo />
      </Suspense>
    </section>
  );
}

async function AboutInfo() {
  const info = await loadInfo();
  return (
    <dl className="meta-list">
      <div>
        <dt>Runtime</dt>
        <dd>{info.version}</dd>
      </div>
      <div>
        <dt>Renderer</dt>
        <dd>{info.renderer}</dd>
      </div>
      <div>
        <dt>Flight</dt>
        <dd>{info.flight}</dd>
      </div>
      <div>
        <dt>Bundler</dt>
        <dd>{info.bundler}</dd>
      </div>
    </dl>
  );
}
