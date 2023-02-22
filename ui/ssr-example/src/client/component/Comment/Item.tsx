import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

import { mark } from "@client/utils/markdown";

import { Actor } from "../Actor";
import { Card } from "../Card";

import type { GetSingleBlogQuery } from "@site/graphql";

export const Item = (props: GetSingleBlogQuery["repository"]["issue"]["comments"]["nodes"][0]) => {
  const {
    body,
    author: { login, avatarUrl },
    updatedAt,
  } = props;
  const rendered = useMemo(() => mark.render(body), [body]);
  return (
    <Card marginY="2" padding="2" backgroundColor="initial">
      <Actor
        avatarUrl={avatarUrl}
        login={login}
        time={updatedAt}
        alignItems="flex-end"
        avatarProps={{
          width: 6,
          height: 6,
        }}
      />
      <Box marginTop="3.5" className="typo" fontSize="small" dangerouslySetInnerHTML={{ __html: rendered }} />
    </Card>
  );
};
