import { useLoaderData, type MetaFunction } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Foo Page 123",
      description: "This is the foo page",
    },
  ];
};

export const loader: LoaderFunction = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  return { message: "Hello" };
};

export default function Index() {
  const data = useLoaderData();

  console.warn("loader data:", data);

  return <div>Foo page</div>;
}
