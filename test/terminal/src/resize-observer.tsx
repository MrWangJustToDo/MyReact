import React, { useState, useEffect, useRef, forwardRef } from "@my-react/react";
import { render, Box, Text, StaticRender, ResizeObserver, type ResizeObserverEntry, type DOMElement } from "@my-react/react-terminal";

const Child = forwardRef<DOMElement>((_, reference) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setExpanded((previous) => !previous);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box ref={reference} flexDirection="column" borderStyle="single" borderColor="green">
      <Text>I am the child component.</Text>
      {expanded && (
        <>
          <Text>Extra line 1</Text>
          <Text>Extra line 2</Text>
          <Text>Extra line 3</Text>
        </>
      )}
    </Box>
  );
});

function App() {
  const childReference = useRef<DOMElement>(null);
  const parentReference = useRef<DOMElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

  const [parentDimensions, setParentDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

  const [logMessages, setLogMessages] = useState<Array<{ id: string; msg: string }>>([]);

  useEffect(() => {
    if (!childReference.current || !parentReference.current) {
      return;
    }

    let counter = 0;
    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        const isChild = entry.target === childReference.current;
        const isParent = entry.target === parentReference.current;
        const message = `${isChild ? "Child" : "Parent"} Resized: ${entry.contentRect.width}x${entry.contentRect.height}`;
        const id = `${isChild ? "child" : "parent"}-${counter++}`;

        if (isChild) {
          setDimensions(entry.contentRect);
        } else if (isParent) {
          setParentDimensions(entry.contentRect);
        }

        setLogMessages((previous) => {
          // Keep max 3 log messages to avoid expanding the parent height infinitely
          const next = [...previous, { id, msg: message }];
          if (next.length > 3) {
            return next.slice(-3);
          }

          return next;
        });
      }
    });

    observer.observe(childReference.current);
    observer.observe(parentReference.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box ref={parentReference} flexDirection="column" borderStyle="single" borderColor="blue" width="50%">
      <Box flexDirection="column" padding={1} borderStyle="round" borderColor="yellow">
        <Text color="yellow">Resize Observer Event Log:</Text>
        {logMessages.map((item) => (
          <Text key={item.id}>{item.msg}</Text>
        ))}
      </Box>

      <StaticRender width={80}>
        <Box padding={1} borderStyle="single" borderColor="magenta">
          <Text>I am a StaticRender block to test layout sizing.</Text>
        </Box>
      </StaticRender>

      <Text>Parent ({parentDimensions ? `${parentDimensions.width}x${parentDimensions.height}` : "..."})</Text>
      {dimensions && (
        <Text>
          Child size: {dimensions.width}x{dimensions.height}
        </Text>
      )}
      <Child ref={childReference} />
    </Box>
  );
}

export const test = () => render(<App />);
