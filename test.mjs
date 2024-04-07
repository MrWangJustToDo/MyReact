import { createElement, useEffect, useState } from "@my-react/react";
import { Text, render, Box } from "@my-react/react-terminal";

const App = () => {
  const [a, setA] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setA((i) => i + 1);
    }, 2000);
  }, []);

  return createElement(Box, { borderStyle: "round", borderColor: "green" }, createElement(Text, {}, a));
};

const run = () => {
  const test = "hello world";

  // render(createElement(Text, {}, test));

  // render(createElement(Box, { borderStyle: "round", borderColor: "green" }, createElement(Text, {}, test)));

  render(createElement(App));
};

run();
