import { Box, Text, render } from "@my-react/react-terminal";

const users = Array.from({ length: 10 })
  .fill(true)
  .map((_, index) => ({
    id: index,
    name: "张三",
    email: "123456@qq.com",
  }));

function Table() {
  return (
    <Box flexDirection="column" width={80}>
      <Box>
        <Box width="10%">
          <Text>ID</Text>
        </Box>

        <Box width="50%">
          <Text>Name</Text>
        </Box>

        <Box width="40%">
          <Text>Email</Text>
        </Box>
      </Box>

      {users.map((user) => (
        <Box key={user.id}>
          <Box width="10%">
            <Text>{user.id}</Text>
          </Box>

          <Box width="50%">
            <Text>{user.name}</Text>
          </Box>

          <Box width="40%">
            <Text>{user.email}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export const test = () => render(<Table />);
