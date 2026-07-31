import { Link, useLoaderData, type MetaFunction } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Loader demo · Remix + MyReact" }];
};

export const loader: LoaderFunction = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 400);
  });

  return { message: "Hello from Remix loader", at: new Date().toISOString() };
};

export default function Foo() {
  const data = useLoaderData<typeof loader>();

  return (
    <section className="panel">
      <h1>Loader</h1>
      <p className="muted">Server loader data after a short delay.</p>
      <pre className="code">{JSON.stringify(data, null, 2)}</pre>
      <Link className="ghost" to="/">
        Back home
      </Link>
    </section>
  );
}
