import { NetworkStatus, useQuery } from "@apollo/client";
import {
  Flex,
  Box,
  SimpleGrid,
  SkeletonCircle,
  SkeletonText,
  Portal,
  useCallbackRef,
  Center,
  Spinner,
  Button,
  ButtonGroup,
  useBreakpointValue,
} from "@chakra-ui/react";
import { GetBlogListDocument, IssueOrderField, IssueState, OrderDirection } from "@site/graphql";
import { throttle } from "lodash-es";
import { memo, useMemo, useRef, useState } from "react";

import { BlogGrid } from "@client/component/BlogGrid";
import { ErrorCom } from "@client/component/Error";
import { BLOG_REPOSITORY, BLOG_REPOSITORY_OWNER } from "@client/config/source";
import { useEffectOnce } from "@client/hooks";

import { BlogModal } from "../BlogModal";

const ITEM_PER_PAGE = 15;

const BlogListLoading = () => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} padding="6" height="100%" overflow="hidden">
    {[1, 2, 3, 4, 5].map((i) => (
      <Box key={i}>
        <SkeletonCircle marginY="2" />
        <SkeletonText noOfLines={6} marginY="2" />
      </Box>
    ))}
  </SimpleGrid>
);

export const BASIC_VARIABLE = {
  name: __CLIENT__ ? localStorage.getItem("blog_name") || BLOG_REPOSITORY : BLOG_REPOSITORY,
  owner: __CLIENT__ ? localStorage.getItem("blog_owner") || BLOG_REPOSITORY_OWNER : BLOG_REPOSITORY_OWNER,
  orderBy: {
    field: IssueOrderField.CreatedAt,
    direction: OrderDirection.Desc,
  },
};

const _BlogListWithInfinityScroll = () => {
  const ref = useRef<HTMLDivElement>();

  const [disableGridLayout, setDisableGridLayout] = useState(true);

  const isMobileWidth = useBreakpointValue({ base: true, md: false });

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(GetBlogListDocument, {
    variables: {
      ...BASIC_VARIABLE,
      first: ITEM_PER_PAGE,
      states: IssueState.Open
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffectOnce(refetch)

  const fetchMoreCallback = useCallbackRef(() => {
    if (data?.repository?.issues?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: { after: data.repository.issues.pageInfo.endCursor },
      });
    }
  }, []);

  const onThrottleScroll = useMemo(
    () =>
      throttle(() => {
        const node = ref.current;
        if (node) {
          if (node.scrollTop + node.clientHeight >= node.scrollHeight * 0.85) {
            fetchMoreCallback();
          }
        }
      }, 200),
    [fetchMoreCallback]
  );

  if (loading && networkStatus !== NetworkStatus.fetchMore) return <BlogListLoading />;

  if (error)
    return (
      <>
        <ErrorCom error={error} />
        <Portal>
          <ButtonGroup variant="solid" position="fixed" bottom="4" right="4" className="tour_buttons">
            <Button color="red" textTransform="capitalize" onClick={() => refetch()}>
              refresh
            </Button>
            <Button color="red" textTransform="capitalize" display={{ base: "none", lg: "block" }} onClick={() => setDisableGridLayout((last) => !last)}>
              {!disableGridLayout ? "disable gridLayout" : "enable gridLayout"}
            </Button>
          </ButtonGroup>
        </Portal>
      </>
    );

  return (
    <Flex flexDirection="column" height="100%">
      <Box ref={ref} overflow="auto" paddingRight="4" onScroll={onThrottleScroll} className="tour_blogList">
        <BlogGrid data={data.repository.issues.nodes} disableGridLayout={disableGridLayout || isMobileWidth} />
        {loading && data.repository.issues.nodes.length && (
          <Center height="100px">
            <Spinner />
          </Center>
        )}
      </Box>
      <Portal>
        <ButtonGroup variant="solid" position="fixed" bottom="4" right="4" className="tour_buttons">
          <Button color="red" textTransform="capitalize" onClick={() => refetch()}>
            refresh
          </Button>
          <Button color="red" textTransform="capitalize" display={{ base: "none", lg: "block" }} onClick={() => setDisableGridLayout((last) => !last)}>
            {!disableGridLayout ? "disable gridLayout" : "enable gridLayout"}
          </Button>
        </ButtonGroup>
      </Portal>
      <BlogModal />
    </Flex>
  );
};

export const BlogGridWithInfinityScroll = memo(_BlogListWithInfinityScroll);
