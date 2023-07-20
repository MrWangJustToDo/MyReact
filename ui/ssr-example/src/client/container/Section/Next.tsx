import { Box, Code, Container, Flex, Heading, Text } from "@chakra-ui/react";

import { CONTAINER_WIDTH } from "@client/config/container";
import { mark } from "@client/utils/markdown";

const shellMd = `
\`\`\`bash
// 1. 正常安装Next.js项目

// 2. 安装@my-react
pnpm add @my-react/react @my-react/react-dom

pnpm add -D @my-react/react-refresh @my-react/react-refresh-tools

// 3. 配置next.config.js

const withNext = require('@my-react/react-refresh-tools/withNext');

module.exports = withNext(nextConfig);

// 4. 启动
pnpm run dev

\`\`\`
`;

const renderBody = mark.render(shellMd);

export const NextSection = () => {
  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh">
      <Flex justifyContent="space-between" marginTop="4%" flexDirection={{ base: "column", md: "row" }}>
        <Box
          alignSelf="flex-start"
          marginLeft={{ base: "4%", md: "6%", lg: "8%" }}
          marginRight={{ base: "1%", md: "0" }}
          maxWidth={{ base: "100%", md: "40%" }}
        >
          <Heading as="h1" fontSize={{ base: "xl", md: "3xl", lg: "4xl" }} marginTop="6">
            在 <Code fontSize="inherit">Next.js</Code> 项目中快速体验
          </Heading>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            目前还不支持Next 13版本，也不支持RSC等React新推出的功能，遇到任何问题欢迎联系。
          </Text>
          <Text fontSize="sm" color="lightTextColor" marginY="2" lineHeight="180%">
            本项目由作者一人开发，本质上是一个学习项目，强烈不建议您使用在任何生产环境中。
          </Text>
        </Box>
        <Box
          className="typo"
          overflow={{ base: "hidden", lg: "auto" }}
          border="1px solid"
          borderColor="cardBorderColor"
          marginRight={{ base: "4%", md: "16%" }}
          marginTop={{ base: "10%", md: "0" }}
          marginLeft={{ base: "4%", md: "1%" }}
          marginBottom={{ base: "6%" }}
          borderRadius="0.8em"
          fontSize={{ base: "sm", lg: "medium" }}
          sx={{
            ["pre"]: {
              margin: "0",
            },
          }}
          dangerouslySetInnerHTML={{ __html: renderBody }}
        />
      </Flex>
    </Container>
  );
};
