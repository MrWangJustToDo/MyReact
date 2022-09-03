import { useTheme } from "@chakra-ui/react";

const LazyLoadTest = ({ time }: { time: string }) => {
  const theme = useTheme();

  console.log(theme);

  return <div>lazy load test {time}</div>;
};

export default LazyLoadTest;
