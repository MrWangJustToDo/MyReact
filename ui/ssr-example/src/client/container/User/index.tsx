import { useQuery } from "@apollo/client";
import {
  Avatar,
  AvatarBadge,
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { GetViewerDocument } from "@site/graphql";
import { memo } from "react";
import { AiOutlineGithub, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { SiLeetcode } from "react-icons/si";

import { Chart } from "@client/component/Chart";
import { ErrorCom } from "@client/component/Error";
import { Followers } from "@client/component/Follower";
import { momentTo } from "@client/utils/time";

const ITEM_FOLLOWER = 10;

const UserLoading = () => (
  <Box padding="3">
    <SkeletonCircle />
    <Skeleton marginY="2" />
    <SkeletonText noOfLines={6} marginY="2" />
  </Box>
);

const _User = () => {
  const { data, loading, error } = useQuery(GetViewerDocument, {
    variables: {
      first: ITEM_FOLLOWER,
    },
  });

  if (loading) return <UserLoading />;

  if (error) return <ErrorCom error={error} />;

  return (
    <Flex flexDirection="column" padding="3" height={{ md: "100%" }} className="tour_about">
      <Flex padding="2" alignItems="flex-end">
        <Avatar name={data.viewer.name} src={data.viewer.avatarUrl} size="xl">
          <AvatarBadge bg="green.500" boxSize="0.8em" />
        </Avatar>
      </Flex>
      <Chart marginY="2" className="tour_commit" />
      <Divider marginY="2" />
      <HStack divider={<StackDivider />} spacing="2">
        <IconButton aria-label="github" variant="link" icon={<Icon as={AiOutlineGithub} fontSize="xl" />} as="a" href="https://github.com/MrWangJustToDo/" />
        <IconButton aria-label="leetcode" variant="link" icon={<Icon as={SiLeetcode} fontSize="xl" />} as="a" href="https://leetcode.com/MrWangSay/" />
      </HStack>
      {/* <Text fontWeight="semibold">{data.viewer.login}</Text> */}
      <Box fontSize="sm" marginY="2">
        <Text fontWeight="semibold">Recommend:</Text>
        <Link
          target="_blank"
          color="red.400"
          href="https://mrwangjusttodo.github.io/MrWangJustToDo.io"
          title="https://mrwangjusttodo.github.io/MrWangJustToDo.io"
        >
          Blog
        </Link>
      </Box>
      <Flex alignItems="center" marginTop="1">
        <Icon as={AiOutlineUser} />
        <Text fontSize="small" marginLeft="2">
          {data.viewer.login}
        </Text>
      </Flex>
      <Flex alignItems="center" marginTop="1" color="lightTextColor">
        <Icon as={AiOutlineMail} />
        <Text fontSize="small" marginLeft="2">
          {data.viewer.email}
        </Text>
      </Flex>
      <Text fontSize="x-small" marginY="1">
        {momentTo(data.viewer.createdAt)}
      </Text>
      <Divider marginY="2" />
      <Flex overflow={{ md: "auto" }} flexDirection="column">
        <Flex justifyContent="space-between" marginBottom="2">
          <Flex flexDirection="column" alignItems="center">
            <Flex alignItems="center" marginBottom="3">
              <Text textTransform="capitalize" fontSize="sm">
                followers :
              </Text>
            </Flex>
            <Followers data={data.viewer.followers.nodes} />
          </Flex>
          <Flex flexDirection="column" alignItems="center">
            <Flex alignItems="center" marginBottom="3">
              <Text textTransform="capitalize" fontSize="sm">
                following :
              </Text>
            </Flex>
            <Followers data={data.viewer.following.nodes} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const User = memo(_User);
