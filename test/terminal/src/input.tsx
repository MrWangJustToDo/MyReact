import { useState } from "@my-react/react";
import { render, useInput, useApp, Box, Text } from "@my-react/react-terminal";

function Robot() {
  const { exit } = useApp();
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  useInput((input, key) => {
    if (input === "q") {
      exit();
    }

    if (key.leftArrow) {
      setX(Math.max(1, x - 1));
    }

    if (key.rightArrow) {
      setX(Math.min(20, x + 1));
    }

    if (key.upArrow) {
      setY(Math.max(1, y - 1));
    }

    if (key.downArrow) {
      setY(Math.min(10, y + 1));
    }
  });

  return (
    <Box flexDirection="column">
      <Text>Use arrow keys to move the face. Press “q” to exit.</Text>
      <Box height={12} paddingLeft={x} paddingTop={y}>
        <Text>^_^</Text>
      </Box>
    </Box>
  );
}

export const test = () => render(<Robot />);
