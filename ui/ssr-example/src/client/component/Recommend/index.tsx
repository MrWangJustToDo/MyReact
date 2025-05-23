import { useQuery } from "@apollo/client";
import { Badge, Icon, Link, SkeletonText, Text } from "@chakra-ui/react";
import { GetRepoAboutDocument } from "@site/graphql";
import { StarIcon as VscStarFull } from "lucide-react";

import { Card } from "../Card";

export const Blog = () => {
  const { data, loading } = useQuery(GetRepoAboutDocument, { variables: { owner: "mrwangjusttodo", name: "MrWangJustToDo.io" } });

  return (
    <Card
      backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
      width="100%"
      padding="4px"
      paddingX="6px"
      paddingBottom="8px"
      _firstLetter={{ fontSize: "2em" }}
      boxShadow="sm"
    >
      <Link href={data?.repository?.url} target="_blank" fontWeight="500" textDecoration="underline">
        <Text as="span">Blog</Text>:
        <Badge colorScheme="orange" float="right" display="flex" alignItems="center">
          <Icon as={VscStarFull} marginRight="1" fill="currentcolor" />
          {data?.repository?.stargazerCount}
        </Badge>
        <SkeletonText isLoaded={!loading}>
          <Text as="span" color="slategrey">
            {data?.repository?.description}
          </Text>
        </SkeletonText>
      </Link>
    </Card>
  );
};

export const RStore = () => {
  const { data, loading } = useQuery(GetRepoAboutDocument, { variables: { owner: "mrwangjusttodo", name: "reactivity-store" } });

  return (
    <Card
      backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
      width="100%"
      padding="4px"
      paddingX="6px"
      paddingBottom="8px"
      _firstLetter={{ fontSize: "2em" }}
      boxShadow="sm"
    >
      <Link href={data?.repository?.url} target="_blank" fontWeight="500" textDecoration="underline">
        <Text as="span">RStore</Text>:
        <Badge colorScheme="orange" float="right" display="flex" alignItems="center">
          <Icon as={VscStarFull} marginRight="1" fill="currentcolor" />
          {data?.repository?.stargazerCount}
        </Badge>
        <SkeletonText isLoaded={!loading}>
          <Text as="span" color="slategrey">
            {data?.repository?.description}
          </Text>
        </SkeletonText>
      </Link>
    </Card>
  );
};

export const SSR = () => {
  const { data, loading } = useQuery(GetRepoAboutDocument, { variables: { owner: "mrwangjusttodo", name: "react-ssr-setup" } });

  return (
    <Card
      backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
      width="100%"
      padding="4px"
      paddingX="6px"
      paddingBottom="8px"
      _firstLetter={{ fontSize: "2em" }}
      boxShadow="sm"
    >
      <Link href={data?.repository?.url} target="_blank" fontWeight="500" textDecoration="underline">
        <Text as="span">SSR template</Text>:
        <Badge colorScheme="orange" float="right" display="flex" alignItems="center">
          <Icon as={VscStarFull} marginRight="1" fill="currentcolor" />
          {data?.repository?.stargazerCount}
        </Badge>
        <SkeletonText isLoaded={!loading}>
          <Text as="span" color="slategrey">
            {data?.repository?.description}
          </Text>
        </SkeletonText>
      </Link>
    </Card>
  );
};

export const GitDiffView = () => {
  const { data, loading } = useQuery(GetRepoAboutDocument, { variables: { owner: "mrwangjusttodo", name: "git-diff-view" } });

  return (
    <Card
      backgroundColor={{ base: "mobileCardBackgroundColor", sm: "transparent" }}
      width="100%"
      padding="4px"
      paddingX="6px"
      paddingBottom="8px"
      _firstLetter={{ fontSize: "2em" }}
      boxShadow="sm"
    >
      <Link href={data?.repository?.url} target="_blank" fontWeight="500" textDecoration="underline">
        <Text as="span">Git-diff-view</Text>:
        <Badge colorScheme="orange" float="right" display="flex" alignItems="center">
          <Icon as={VscStarFull} marginRight="1" fill="currentcolor" />
          {data?.repository?.stargazerCount}
        </Badge>
        <SkeletonText isLoaded={!loading}>
          <Text as="span" color="slategrey">
            {data?.repository?.description}
          </Text>
        </SkeletonText>
      </Link>
    </Card>
  );
};
