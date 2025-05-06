import { NetworkStatus, useApolloClient, useQuery } from "@apollo/client";
import { Box, Text, SkeletonText, SkeletonCircle, useCallbackRef, Icon, IconButton } from "@chakra-ui/react";
import { GetSingleBlogDocument } from "@site/graphql";
import { throttle } from "lodash-es";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Actor } from "@client/component/Actor";
import { Card } from "@client/component/Card";
import { Comment } from "@client/component/Comment";
import { ErrorCom } from "@client/component/Error";
import { Hover } from "@client/component/Hover";
import { BLOG_REPOSITORY, BLOG_REPOSITORY_OWNER } from "@client/config/source";
import { mark } from "@client/utils/markdown";

import type { GetSingleBlogQuery } from "@site/graphql";

const COMMENT_LENGTH = 15;

const RenderWrapper = ({ data, Render }: { data: GetSingleBlogQuery; Render: ({ data }: { data: GetSingleBlogQuery }) => JSX.Element }) => {
  return Render({ data });
};

export const DetailModal = ({
  id,
  Render,
  RenderLoading,
}: {
  id: string;
  RenderLoading: JSX.Element;
  Render: ({ data }: { data: GetSingleBlogQuery }) => JSX.Element;
}) => {
  const { data, loading, error, fetchMore, networkStatus } = useQuery(GetSingleBlogDocument, {
    variables: {
      name: BLOG_REPOSITORY,
      owner: BLOG_REPOSITORY_OWNER,
      number: Number(id),
      first: COMMENT_LENGTH,
    },
    skip: id === undefined,
    notifyOnNetworkStatusChange: true,
  });

  const fetchMoreCallback = useCallbackRef(() => {
    if (data?.repository?.issue?.comments?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data.repository.issue.comments.pageInfo.endCursor },
      });
    }
  }, []);

  const onThrottleScroll = useMemo(
    () =>
      throttle((e: Event) => {
        const node = e.target as HTMLDivElement;
        if (node) {
          if (node.scrollTop + node.clientHeight >= node.scrollHeight * 0.85) {
            fetchMoreCallback();
          }
        }
      }, 500),
    [fetchMoreCallback]
  );

  useEffect(() => {
    const scrollElement = document.querySelector("#modal-scroll-box") as HTMLDivElement;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", onThrottleScroll);
      return () => scrollElement.removeEventListener("scroll", onThrottleScroll);
    }
  }, [onThrottleScroll]);

  if (loading && networkStatus !== NetworkStatus.fetchMore) return RenderLoading;

  if (error) return <ErrorCom error={error} />;

  return <RenderWrapper data={data} Render={Render} />;
};

export const DetailModalBody = ({ id }: { id: string }) => (
  <DetailModal
    id={id}
    RenderLoading={
      <Box padding="2">
        <SkeletonText marginTop="4" noOfLines={8} />
      </Box>
    }
    Render={({ data }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const rendered = useMemo(() => mark.render(data?.repository?.issue?.body || ""), [data]);

      return (
        <>
          <Card padding="2" borderColor="Highlight" backgroundColor="initial">
            <Actor
              marginTop="2"
              alignItems="center"
              time={data?.repository?.issue?.publishedAt}
              login={data?.repository?.issue?.author?.login}
              avatarUrl={data?.repository?.issue?.author?.avatarUrl}
              avatarProps={{
                width: 6,
                height: 6,
              }}
            />
            <Box className="typo" marginTop="3.5" fontSize={{ base: "sm", lg: "md" }} dangerouslySetInnerHTML={{ __html: rendered }} />
          </Card>
          <Comment data={data.repository.issue.comments.nodes} />
        </>
      );
    }}
  />
);

export const DetailModalHeader = ({ id }: { id: string }) => (
  <DetailModal
    id={id}
    RenderLoading={
      <Box padding="2">
        <SkeletonText noOfLines={1} paddingRight="6" />
        <SkeletonCircle marginY="3" />
        <SkeletonText noOfLines={1} spacing="4" />
      </Box>
    }
    Render={({ data }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const client = useApolloClient();

      const refetch = () =>
        client.refetchQueries({
          include: [GetSingleBlogDocument],
        });

      return (
        <Box paddingRight="3em">
          <Text as="h1" fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
            {data?.repository?.issue?.title}
            <Hover marginLeft="2" display="inline-flex" alignItems="center">
              <IconButton size="sm" variant="link" aria-label="reload" onClick={() => refetch()} icon={<Icon as={LoaderCircleIcon} />} />
            </Hover>
          </Text>
        </Box>
      );
    }}
  />
);
