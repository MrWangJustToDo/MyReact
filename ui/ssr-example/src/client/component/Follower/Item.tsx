import { Tooltip, Box, Text, Flex, Avatar, Icon, VStack, StackDivider, useDisclosure } from "@chakra-ui/react";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";

import { Hover } from "../Hover";

type FollowerProps = {
  id: string;
  name: string;
  email?: string;
  isFirst: boolean;
  bioHTML?: string;
  avatarUrl: string;
};

export const Follower = ({ isFirst, name, email, avatarUrl, bioHTML }: FollowerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Hover>
      <Tooltip
        label={
          <VStack divider={<StackDivider borderColor="cardBorderColor" />} alignItems="flex-start" spacing="1">
            <Flex alignItems="center" width="100%">
              <Icon as={AiOutlineUser} />
              <Text fontWeight="semibold" marginLeft="1" noOfLines={1}>
                {name}
              </Text>
            </Flex>
            {email && (
              <Flex alignItems="center" width="100%">
                <Icon as={AiOutlineMail} />
                <Text marginLeft="1" noOfLines={1}>
                  {email}
                </Text>
              </Flex>
            )}
            {bioHTML && <Box dangerouslySetInnerHTML={{ __html: bioHTML }} />}
          </VStack>
        }
        maxWidth={{ base: "200px", md: "240px" }}
        isOpen={isOpen}
        borderRadius="4"
        placement="right"
        boxShadow="md"
        offset={[0, 8]}
        hasArrow
      >
        <Avatar
          src={avatarUrl}
          onTouchStart={onOpen}
          onTouchEnd={onClose}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
          border="4px solid white"
          boxShadow="md"
          marginTop={!isFirst ? "-3" : "0"}
        />
      </Tooltip>
    </Hover>
  );
};
