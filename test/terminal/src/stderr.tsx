import { useEffect } from "@my-react/react";
import { render, Text, useStderr } from "@my-react/react-terminal";

function Example() {
  const { write } = useStderr();

  useEffect(() => {
    const timer = setInterval(() => {
      write("Hello from Ink to stderr\n");
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Text>Hello World</Text>;
}

export const test = () => render(<Example />);
