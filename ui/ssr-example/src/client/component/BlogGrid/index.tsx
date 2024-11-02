import { SimpleGrid } from "@chakra-ui/react";
import { memo } from "react";

import { Card } from "../Card";
import { Game } from "../Game";
import { Reactive } from "../Reactive";

import { Item } from "./Item";

import type { GetBlogListQuery } from "@site/graphql";

const _BlogGrid = ({ data }: { data: GetBlogListQuery["repository"]["issues"]["nodes"] }) => {
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
};

export const BlogGrid = memo(_BlogGrid);
