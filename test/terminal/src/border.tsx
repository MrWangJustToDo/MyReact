import { render, Box, Text } from "@my-react/react-terminal";

function Borders() {
  return (
    <Box flexDirection="column" padding={2}>
      <Box>
        <Box borderStyle="single" marginRight={2}>
          <Text>single</Text>
        </Box>

        <Box borderStyle="double" marginRight={2}>
          <Text>double</Text>
        </Box>

        <Box borderStyle="round" marginRight={2}>
          <Text>round</Text>
        </Box>

        <Box borderStyle="bold">
          <Text>bold</Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Box borderStyle="singleDouble" marginRight={2}>
          <Text>singleDouble</Text>
        </Box>

        <Box borderStyle="doubleSingle" marginRight={2}>
          <Text>doubleSingle</Text>
        </Box>

        <Box borderStyle="classic">
          <Text>classic</Text>
        </Box>
      </Box>
    </Box>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Test() {
  return (
    <Text>
      <Text>123</Text>
    </Text>
  );
}

export const test = () => render(<Test />);
