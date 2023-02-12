import { Box, Code, Heading } from "@chakra-ui/react";
import { createReactive, __my_react_reactive__ } from "@my-react/react";
// import { reactive, ref } from "@my-react/react-reactive";
import { Button } from "antd";

import type { MyReactElement } from "@my-react/react";

const { onMounted, onUnmounted, reactiveApi } = __my_react_reactive__;

const { reactive, ref } = reactiveApi;

const Reactive = createReactive({
  name: "testReactive",
  setup: () => {
    const reactiveObj = reactive({ x: 0, y: 0 });
    const countRef = ref(0);
    const positionChange = (e: MouseEvent) => ((reactiveObj.x = e.clientX), (reactiveObj.y = e.clientY));

    onMounted(() => {
      console.log("reactive mounted");
      window.addEventListener("mousemove", positionChange);
    });

    onUnmounted(() => {
      console.log("reactive unmount");
      window.removeEventListener("mousemove", positionChange);
    });

    const changeCount = (c: number) => (countRef.value = c);

    return { reactiveObj, countRef, changeCount };
  },

  render: ({ reactiveObj, countRef, changeCount }) => {
    const Element = (
      <Box>
        <Heading>Reactive</Heading>
        <br />
        <Box>
          <Heading as="h3">count</Heading>
          <Code>{countRef}</Code>
          <Button onClick={() => changeCount(countRef + 1)}>add</Button>
          <Button onClick={() => changeCount(countRef - 1)}>del</Button>
        </Box>
        <Box>
          <Heading as="h3">position</Heading>
          <Code>
            x: {reactiveObj.x}, y: {reactiveObj.y}
          </Code>
        </Box>
      </Box>
    );

    return Element as MyReactElement;
  },
});

export default Reactive;
