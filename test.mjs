import { createElement, useEffect, useState } from "@my-react/react";
import { Text, render, Box } from "@my-react/react-terminal";

const App = () => {
  const [a, setA] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setA((i) => i + 1);
    }, 1000);
  }, []);

  return createElement(
    Box,
    { borderStyle: "round", borderColor: a % 2 === 0 ? "green" : "red" },
    createElement(Text, { backgroundColor: a % 2 === 0 ? "yellow" : "blue", strikethrough: true, underline: true, italic: true }, a)
    // a % 2 === 0
    // ? createElement(Box, { borderStyle: "round", borderColor: "green" }, createElement(Text, {}, "test"))
    // : createElement(Text, { backgroundColor: "red" }, "test")
    // :createElement(Box, { borderStyle: "round", borderColor: "red" }, createElement(Text, {}, "test red"))
    // a
  );
};

const run = () => {
  const test = "hello world";

  // render(createElement(Text, {}, test));

  // render(createElement(Box, { borderStyle: "round", borderColor: "green" }, createElement(Text, {}, test)));

  render(createElement(App));
};

run();
