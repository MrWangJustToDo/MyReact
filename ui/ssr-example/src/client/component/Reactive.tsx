import { Code, Heading, Button, HStack, VStack } from "@chakra-ui/react";
import { createReactive, __my_react_reactive__ } from "@my-react/react";
import throttle from "lodash/throttle";

import type { MyReactElement } from "@my-react/react";
import type { FunctionComponent } from "react";

const { onMounted, onUnmounted, reactiveApi } = __my_react_reactive__;

const { reactive, ref } = reactiveApi;

const _Reactive = createReactive({
  name: "testReactive",
  setup: () => {
    const countRef = ref(0);
    const reactiveObj = reactive({ x: 0, y: 0 });
    const positionChange = throttle((e: MouseEvent) => ((reactiveObj.x = e.clientX), (reactiveObj.y = e.clientY)), 20);

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
      <VStack margin="10px" spacing="20px">
        <Heading>@my-react Reactive</Heading>
        <Heading as="h3">count</Heading>
        <HStack spacing="10px">
          <Code>{countRef}</Code>
          <Button onClick={() => changeCount(countRef + 1)}>add</Button>
          <Button onClick={() => changeCount(countRef - 1)}>del</Button>
        </HStack>
        <Heading as="h3">position</Heading>
        <HStack>
          <Code>position x: {reactiveObj.x}</Code>
          <Code>position y: {reactiveObj.y}</Code>
        </HStack>
      </VStack>
    );

    return Element as MyReactElement;
  },
});

export const Reactive = _Reactive as unknown as FunctionComponent;
