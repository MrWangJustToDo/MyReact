import { useEffect, useState } from "@my-react/react";
import { Text, render } from "@my-react/react-terminal";

function Counter() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Text color="green">{counter} tests passed</Text>;
}

export const test = () => render(<Counter />);
