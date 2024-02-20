import { SimpleGrid } from "@chakra-ui/react";
import { memo, useEffect, useMemo } from "react";

import { DISABLE_DRAG_HANDLER_SELECTOR, DRAG_HANDLER_SELECTOR, GRID_ROW_HEIGHT } from "@client/config/gridLayout";
import { useDomSize, useGetResponseListLayout, useListLayoutStore } from "@client/hooks";

import { Card } from "../Card";
import { Game } from "../Game";
import { GridCard } from "../GridCard";
import { ReactGridLayout } from "../GridLayout";
import { Reactive } from "../Reactive";

import { Item } from "./Item";

import type { GetBlogListQuery } from "@site/graphql";

const BLOG_GRID_COLS = { lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 };

const { updateLayout, mergeLayout } = useListLayoutStore.getActions();

const _BlogGridWithGridLayout = ({ data }: { data: GetBlogListQuery["repository"]["issues"]["nodes"] }) => {
  const newLayout = useGetResponseListLayout(data);

  const layouts = useListLayoutStore((s) => s.data);

  const { width } = useDomSize({ cssSelector: ".grid-card-list" });

  useEffect(() => {
    mergeLayout(newLayout);
  }, [newLayout]);

  const mergedLayout = useMemo(() => {
    const obj = {};
    Object.keys(newLayout).forEach((key) => {
      const hasItem = layouts[key]?.length > 0;
      obj[key] = [];
      const oldValue = layouts[key] || [];
      const newValue = newLayout[key];
      newValue.forEach((item) => {
        const lastItem = oldValue.find((_i) => _i.i === item.i);
        if (lastItem) {
          obj[key].push(lastItem);
        } else {
          if (hasItem) {
            obj[key].push({ ...item, y: Infinity });
          } else {
            obj[key].push(item);
          }
        }
      });
    });
    return obj;
  }, [newLayout, layouts]);

  if (width === 0) return null;

  return (
    <ReactGridLayout
      width={width}
      layouts={mergedLayout}
      cols={BLOG_GRID_COLS}
      onLayoutChange={(_, layouts) => {
        updateLayout(layouts);
      }}
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
  console.log(data);
  return <_BlogGridWithGridLayout data={data} />;
};

export const BlogGrid = memo(_BlogGrid);
