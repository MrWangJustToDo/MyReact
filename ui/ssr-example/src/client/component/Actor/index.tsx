import { Avatar, Box, Flex, forwardRef, Text } from "@chakra-ui/react";

import { momentTo } from "@client/utils/time";

import type { AvatarProps, FlexProps } from "@chakra-ui/react";

interface ActorProps extends FlexProps {
  avatarUrl: string;
  login?: string;
  time: string;
  avatarProps?: Omit<AvatarProps, "avatarUrl">;
}

export const Actor = forwardRef<ActorProps, "div">(({ avatarUrl, login, time, avatarProps, children, ...resProps }, ref) => {
  return (
    <Flex {...resProps} ref={ref}>
      <Flex alignItems="center">
        <Avatar src={avatarUrl} title={login} name={login} size="sm" {...avatarProps} />
        <Box marginLeft="2">
          <Text fontWeight="semibold" fontSize="sm">
            {login}
          </Text>
          <Text fontSize="x-small" color="lightTextColor">
            {momentTo(time)}
          </Text>
        </Box>
      </Flex>
      {children}
    </Flex>
  );
});
