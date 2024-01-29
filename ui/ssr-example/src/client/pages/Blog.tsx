import { Container } from "@chakra-ui/react";
import { GetBlogListDocument, GetViewerDocument, IssueState, getApolloClient } from "@site/graphql";

import { GridCard } from "@client/component/GridCard";
import { StyledResponsiveReactGridLayout } from "@client/component/GridLayout";
import { CONTAINER_WIDTH } from "@client/config/container";
import { DISABLE_DRAG_HANDLER_SELECTOR, DRAG_HANDLER_SELECTOR, GRID_ROW_HEIGHT } from "@client/config/gridLayout";
import { BASIC_VARIABLE, BlogGridWithInfinityScroll } from "@client/container/BlogList";
import { User } from "@client/container/User";
import { useMainCard } from "@client/hooks/useMainCard";

import type { GetInitialStateType } from "@client/types/common";

const GRID_COLS = { lg: 12, md: 12, sm: 12, xs: 2, xxs: 2 };
const GRID_LAYOUTS = {
  lg: [
    { i: "a", x: 0, y: 0, w: 3, h: 50, minW: 2, maxW: 5, minH: 25 },
    {
      i: "b",
      x: 3,
      y: 0,
      w: 9,
      h: 50,
      minW: 6,
      minH: 50,
    },
  ],
  md: [
    { i: "a", x: 0, y: 0, w: 4, h: 40, minW: 2, maxW: 6, minH: 20 },
    {
      i: "b",
      x: 4,
      y: 0,
      w: 8,
      h: 40,
      minW: 6,
      minH: 40,
    },
  ],
  sm: [
    { i: "a", x: 0, y: 0, w: 5, h: 40, minW: 2, maxW: 8, minH: 15 },
    {
      i: "b",
      x: 5,
      y: 0,
      w: 7,
      h: 40,
      minW: 6,
      minH: 40,
    },
  ],
  xs: [
    { i: "a", x: 0, y: 0, w: 2, h: 30, minW: 1, minH: 10, static: true },
    { i: "b", x: 2, y: 0, w: 2, h: 30, minW: 2, minH: 30, static: true },
  ],
  xxs: [
    { i: "a", x: 0, y: 0, w: 2, h: 30, minW: 2, minH: 10, static: true },
    { i: "b", x: 2, y: 0, w: 2, h: 30, minW: 2, minH: 30, static: true },
  ],
};

const Page = () => {
  const { drag, onDragEnd, onDragStart } = useMainCard();

  return (
    <Container maxWidth={CONTAINER_WIDTH}>
      <StyledResponsiveReactGridLayout
        className="layout"
        cols={GRID_COLS}
        position="relative"
        layouts={GRID_LAYOUTS}
        rowHeight={GRID_ROW_HEIGHT}
        draggableHandle={`.${DRAG_HANDLER_SELECTOR}`}
        draggableCancel={`.${DISABLE_DRAG_HANDLER_SELECTOR}`}
        onDragStart={onDragStart}
        onDragStop={onDragEnd}
      >
        <GridCard key="a" contentProps={{ overflow: "auto" }}>
          <User />
        </GridCard>
        <GridCard key="b" className="grid-card-list" enableBlur={drag}>
          <BlogGridWithInfinityScroll />
        </GridCard>
      </StyledResponsiveReactGridLayout>
    </Container>
  );
};

export default Page;

export const getInitialState: GetInitialStateType = async () => {
  if (__CLIENT__) {
    const client = getApolloClient(null, false);

    await Promise.all([
      client.query({
        query: GetViewerDocument,
        variables: {
          first: 10,
        },
      }),
      client.query({
        query: GetBlogListDocument,
        variables: {
          ...BASIC_VARIABLE,
          states: IssueState.Open,
          first: 15,
        },
      }),
    ]);

    return { props: { ["$$__apollo__$$"]: client.cache.extract() } };
  }
};

export const isStatic = true;
