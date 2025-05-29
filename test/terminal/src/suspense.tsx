import { Suspense } from "@my-react/react";
import { render, Text } from "@my-react/react-terminal";

let promise: Promise<void> | undefined;
let state: string | undefined;
let value: string | undefined;

const read = () => {
  if (!promise) {
    promise = new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    state = "pending";

    (async () => {
      await promise;
      state = "done";
      value = "Hello World";
    })();
  }

  if (state === "pending") {
    throw promise;
  }

  if (state === "done") {
    return value;
  }
};

function Example() {
  const message = read();
  return <Text>{message}</Text>;
}

function Fallback() {
  return <Text>Loading...</Text>;
}

export const test = () =>
  render(
    <Suspense fallback={<Fallback />}>
      <Example />
    </Suspense>
  );
