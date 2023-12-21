import { Text, Icon, Link, Flex, Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { AiFillHeart } from "react-icons/ai";

import { BLOG_SOURCE } from "@client/config/source";
// import { useIsMounted } from "@client/hooks";
import { Time } from "@client/store";

// import { BLOG_SOURCE } from "@app/config/source";

const _Footer = () => {
  // const isMounted = useIsMounted();

  return (
    <Box textAlign="center">
      <Flex marginTop="6" justifyContent="center" alignItems="center">
        <Text fontSize={{ base: "medium", md: "xl" }} fontWeight="semibold" noOfLines={1} display="flex" alignItems="center">
          <Link href={BLOG_SOURCE} target="_blank" color="blue.500" textDecoration="none" paddingLeft="0.2em">
            github
          </Link>
          <Icon as={AiFillHeart} color="red.600" mx="0.2em" />
          <Text as="span">@my-react</Text>
        </Text>
      </Flex>
      <Text fontSize="sm" marginTop="2.5" marginBottom="9" color="lightTextColor">
        <Time>
          {({ time, isMount }) => {
            if (!isMount) {
              return "";
            }
            return (
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={time}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={{
                    initial: {
                      opacity: 0.2,
                      translateY: -14,
                    },
                    in: {
                      opacity: 1,
                      translateY: 0,
                    },
                    out: {
                      opacity: 0.2,
                      translateY: 14,
                    },
                  }}
                  transition={{
                    type: 'tween',
                    duration: 0.12,
                  }}
                >
                  {time}
                </motion.div>
              </AnimatePresence>
            );
          }}
        </Time>
        {/* {isMounted ? new Date().getFullYear() : ""} */}
      </Text>
    </Box>
  );
};

export const Footer = memo(_Footer);
