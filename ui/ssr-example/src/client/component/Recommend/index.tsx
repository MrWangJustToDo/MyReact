import { useQuery } from "@apollo/client";
import { Link, SkeletonText, Text } from "@chakra-ui/react";
import { GetRepoAboutDocument } from "@site/graphql";

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
        <Text as="span">Blog</Text>:{" "}
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
        <Text as="span">RStore</Text>:{" "}
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
        <Text as="span">SSR template</Text>:{" "}
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
        <Text as="span">Git-diff-view</Text>:{" "}
        <SkeletonText isLoaded={!loading}>
          <Text as="span" color="slategrey">
            {data?.repository?.description}
          </Text>
        </SkeletonText>
      </Link>
    </Card>
  );
};
