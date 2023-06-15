import { Text, Flex, Box, Icon, IconButton, Divider } from "@chakra-ui/react";
import { useMemo } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { VscLinkExternal } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router";

import { markNOLineNumber } from "@client/utils/markdown";
import { noBase } from "@shared";

import { Actor } from "../Actor";
import { Hover } from "../Hover";

import type { GetBlogListQuery } from "@site/graphql";

const ItemHeader = ({ title, externalUrl, detailNumber }: { title: string; externalUrl: string; detailNumber: number }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = () => {
    const search = new URLSearchParams(location.search);
    search.append("overlay", "open");
    search.append("detailId", detailNumber + "");
    navigate(`${noBase ? "/Blog" : `/${__BASENAME__}/Blog`}?${search.toString()}`)
  };

  const openExternal = () => window.open(externalUrl, "_blank");

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize={{ base: "18", md: "20", lg: "22" }} width="85%" fontWeight="medium" title={title} noOfLines={1}>
        {title}
      </Text>
      <Hover display="flex" alignItems="center">
        <IconButton aria-label="detail" onClick={openModal} variant="link" size="sm" icon={<Icon as={AiOutlineRight} userSelect="none" />} />
      </Hover>
      <Hover display="flex" alignItems="center">
        <IconButton size="sm" variant="link" aria-label="open" icon={<Icon as={VscLinkExternal} />} onClick={openExternal} />
      </Hover>
    </Flex>
  );
};

export const Item = (props: GetBlogListQuery["repository"]["issues"]["nodes"][0]) => {
  const { title, number, body, publishedAt, author, url } = props;
  const renderedBody = useMemo(() => markNOLineNumber.render(body), [body]);
  return (
    <Flex flexDirection="column" height="100%">
      <Box padding="2" backgroundColor="cardBackgroundColor" borderTopRadius="md">
        <ItemHeader title={title} externalUrl={url} detailNumber={number} />
        <Actor
          avatarUrl={author?.avatarUrl}
          login={author?.login}
          time={publishedAt}
          marginTop="2"
          alignItems="center"
          avatarProps={{
            width: 6,
            height: 6,
          }}
        />
      </Box>
      <Divider />
      <Box
        className="typo"
        overflow={{ base: "hidden", lg: "auto" }}
        padding="2"
        fontSize="sm"
        borderBottomRadius="md"
        backgroundColor="cardBackgroundColor"
        dangerouslySetInnerHTML={{ __html: renderedBody }}
      />
    </Flex>
  );
};
