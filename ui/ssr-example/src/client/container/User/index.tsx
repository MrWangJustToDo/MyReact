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
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GetViewerDocument } from "@site/graphql";
import { memo } from "react";
import { AiOutlineGithub, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { SiLeetcode } from "react-icons/si";

import { Chart } from "@client/component/Chart";
import { ErrorCom } from "@client/component/Error";
import { Followers } from "@client/component/Follower";
import { Blog, GitDiffView, RStore, SSR } from "@client/component/Recommend";
import { useEffectOnce } from "@client/hooks";
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
  const { data, loading, error, refetch } = useQuery(GetViewerDocument, {
    variables: {
      first: ITEM_FOLLOWER,
    },
  });

  useEffectOnce(refetch);

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
        <IconButton
          as="a"
          color="gray"
          variant="outline"
          aria-label="github"
          href="https://github.com/MrWangJustToDo/"
          icon={<Icon as={AiOutlineGithub} fontSize="xl" />}
        />
        <IconButton
          as="a"
          color="gray"
          variant="outline"
          aria-label="leetcode"
          href="https://leetcode.com/MrWangSay/"
          icon={<Icon as={SiLeetcode} fontSize="xl" />}
        />
      </HStack>
      {/* <Text fontWeight="semibold">{data.viewer.login}</Text> */}
      <Box fontSize="sm" marginY="2">
        <Text fontWeight="semibold">Recommend:</Text>
        <VStack divider={<StackDivider />} spacing="2" marginTop="1">
          <RStore />
          <Blog />
          <SSR />
          <GitDiffView />
        </VStack>
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
