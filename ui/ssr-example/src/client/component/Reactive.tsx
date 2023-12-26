import { Code, Heading, Button, HStack, VStack } from "@chakra-ui/react";
import { createReactive, ref, onMounted, reactive, onUnmounted, watch, computed } from "@my-react/react-reactive";
import throttle from "lodash/throttle";

export const Reactive = __REACT__
  ? () => <div>123</div>
  : createReactive({
      setup: () => {
        const countRef = ref(0);
        const changeRef = ref(0);
        const reactiveObj = reactive({ x: 0, y: 0 });
        const positionChange = throttle((e: MouseEvent) => ((reactiveObj.x = e.clientX), (reactiveObj.y = e.clientY)), 20);

        watch(
          () => reactiveObj.x,
          () => changeRef.value++
        );

        const reactiveObjXChangeCount = computed(() => "position.x has changed:" + changeRef.value + " counts");

        onMounted(() => {
          console.log("reactive mounted");
          window.addEventListener("mousemove", positionChange);
        });

        onUnmounted(() => {
          console.log("reactive unmount");
          window.removeEventListener("mousemove", positionChange);
        });

        const changeCount = (c: number) => (countRef.value = c);

        return { reactiveObj, countRef, changeCount, reactiveObjXChangeCount };
      },

      render: ({ reactiveObj, countRef, changeCount, reactiveObjXChangeCount }) => {
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
            <Code>{reactiveObjXChangeCount}</Code>
          </VStack>
        );

        return Element;
      },
    }) as () => JSX.Element;
