import { SimpleGrid } from "@chakra-ui/react";
import { memo } from "react";

import { DISABLE_DRAG_HANDLER_SELECTOR, DRAG_HANDLER_SELECTOR, GRID_ROW_HEIGHT } from "@client/config/gridLayout";
import { useDomSize, useGetResponseListLayout } from "@client/hooks";

import { Card } from "../Card";
import { Game } from "../Game";
import { GridCard } from "../GridCard";
import { ReactGridLayout } from "../GridLayout";
import { Reactive } from "../Reactive";

import { Item } from "./Item";

import type { GetBlogListQuery } from "@site/graphql";

const BLOG_GRID_COLS = { lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 };

const _BlogGridWithGridLayout = ({ data }: { data: GetBlogListQuery["repository"]["issues"]["nodes"] }) => {
  const layouts = useGetResponseListLayout(data);

  const { width } = useDomSize({ cssSelector: ".grid-card-list" });

  if (width === 0) return null;

  return (
    <ReactGridLayout
      width={width}
      layouts={layouts}
      cols={BLOG_GRID_COLS}
      rowHeight={GRID_ROW_HEIGHT}
      draggableHandle={`.${DRAG_HANDLER_SELECTOR}`}
      draggableCancel={`.${DISABLE_DRAG_HANDLER_SELECTOR}`}
    >
      {data.map((p, index) => {
        return (
          <GridCard key={p.id + index}>
            <Item {...p} />
          </GridCard>
        );
      })}
    </ReactGridLayout>
  );
};

const _BlogGrid = ({ data, disableGridLayout = true }: { data: GetBlogListQuery["repository"]["issues"]["nodes"]; disableGridLayout?: boolean }) => {
  console.log(disableGridLayout);

  if (disableGridLayout) {
    return (
      <SimpleGrid width="100%" padding="2" columns={{ base: 1, lg: 2, xl: 3 }} spacing={3}>
        <Card>
          <Reactive />
        </Card>
        <Card>
          <Game />
        </Card>
        {data.map((p, index) => (
          <Card key={p.id + index} maxHeight="96">
            <Item {...p} />
          </Card>
        ))}
      </SimpleGrid>
    );
  }
  return <_BlogGridWithGridLayout data={data} />;
};

export const BlogGrid = memo(_BlogGrid);
