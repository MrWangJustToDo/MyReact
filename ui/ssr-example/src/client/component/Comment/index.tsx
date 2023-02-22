import { Divider } from "@chakra-ui/react";

import { Item } from "./Item";

import type { GetSingleBlogQuery } from "@site/graphql";

export const Comment = ({ data }: { data: GetSingleBlogQuery["repository"]["issue"]["comments"]["nodes"] }) => {
  return (
    <>
      {data.length > 0 && <Divider marginY="2" />}
      {data.map((p) => (
        <Item key={p.id} {...p} />
      ))}
    </>
  );
};
