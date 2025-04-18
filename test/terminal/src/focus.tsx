import { Box, Text, render, useFocus } from "@my-react/react-terminal";

function Focus() {
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text>Press Tab to focus next element, Shift+Tab to focus previous element, Esc to reset focus.</Text>
      </Box>
      <Item label="First" />
      <Item label="Second" />
      <Item label="Third" />
    </Box>
  );
}

function Item({ label }) {
  const { isFocused } = useFocus();
  return (
    <Text>
      {label} {isFocused && <Text color="green">(focused)</Text>}
    </Text>
  );
}

export const test = () => render(<Focus />);
