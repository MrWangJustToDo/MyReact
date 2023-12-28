import { Text, Icon, Link, Flex, Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { AiFillHeart } from "react-icons/ai";

import { BLOG_SOURCE } from "@client/config/source";
import { useFoot } from "@client/hooks";
import { Time } from "@client/store";

// import { BLOG_SOURCE } from "@app/config/source";

const variants = {
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
};

const _Footer = () => {
  // const isMounted = useIsMounted();
  const state = useFoot((s) => s.state);

  if (!state) return null;

  return (
    <Box textAlign="center">
      <Flex marginTop="6" justifyContent="center" alignItems="center">
        <Text fontSize={{ base: "medium", md: "xl" }} fontWeight="semibold" noOfLines={1} display="flex" alignItems="center">
          <Link href={BLOG_SOURCE} target="_blank" color="blue.500">
            Github
          </Link>
          <Icon as={AiFillHeart} color="red.600" mx="0.2em" />
          <Link href="https://github.com/MrWangJustToDo/MyReact" target="_blank" color="blue.500">
            @my-react
          </Link>
        </Text>
      </Flex>
      <Text fontSize="sm" marginTop="2.5" marginBottom="9" color="lightTextColor">
        <Time>
          {({ time, isMount }) => {
            if (!isMount) {
              return "";
            }
            const dayTime = dayjs(time);
            const year = dayTime.year();
            const month = dayTime.month() + 1 + "";
            const date = dayTime.date() + "";
            const hour = dayTime.hour() + "";
            const minute = dayTime.minute() + "";
            const second = dayTime.second() + "";
            return (
              <Flex
                justifyContent="center"
                sx={{
                  ["& > div"]: {
                    minWidth: "1.2em",
                  },
                }}
              >
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={year}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {year}
                  </motion.div>
                </AnimatePresence>
                -
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={month}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {month.length > 1 ? month : `0${month}`}
                  </motion.div>
                </AnimatePresence>
                -
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={date}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {date.length > 1 ? date : `0${date}`}
                  </motion.div>
                </AnimatePresence>
                <div> </div>
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={hour}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {hour.length > 1 ? hour : `0${hour}`}
                  </motion.div>
                </AnimatePresence>
                :
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={minute}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {minute.length > 1 ? minute : `0${minute}`}
                  </motion.div>
                </AnimatePresence>
                :
                <AnimatePresence exitBeforeEnter>
                  <motion.div
                    key={second}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={variants}
                    transition={{
                      type: "tween",
                      duration: 0.12,
                    }}
                  >
                    {second.length > 1 ? second : `0${second}`}
                  </motion.div>
                </AnimatePresence>
              </Flex>
            );
          }}
        </Time>
        {/* {isMounted ? new Date().getFullYear() : ""} */}
      </Text>
    </Box>
  );
};

export const Footer = memo(_Footer);
