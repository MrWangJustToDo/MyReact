import { Heading, VStack, Slider, SliderFilledTrack, SliderThumb, SliderTrack, HStack, Text, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const variants = {
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0 },
};

export default function Index() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotate, setRotate] = useState(0);

  return (
    <>
      <Heading>framer animation</Heading>
      <SimpleGrid columns={2} columnGap="8">
        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          animate={{ x, y, rotate }}
          transition={{ type: "spring" }}
        />
        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          animate={{ x, y, rotate }}
          transition={{ type: "spring" }}
        />
        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          animate={{ x, y, rotate }}
          transition={{ type: "spring" }}
        />

        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, x, y, rotate }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        />

        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />

        <motion.div
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          animate={{ x, y, rotate }}
          /**
           * Setting the initial keyframe to "null" will use
           * the current value to allow for interruptable keyframes.
           */
          whileHover={{ scale: [null, 1.5, 1.4] }}
          transition={{ duration: 0.3 }}
        />

        <motion.button
          style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
          initial={{ opacity: 0.6 }}
          animate={{ x, y, rotate }}
          whileHover={{
            scale: 1.2,
            transition: { duration: 1 },
          }}
          whileTap={{ scale: 0.9 }}
          whileInView={{ opacity: 1 }}
        />

        {[1, 2, 3].map((i) => (
          <motion.div
            layout
            style={{ width: "100px", height: "100px", backgroundColor: "red", borderRadius: "6px", margin: "20px" }}
            key={i}
            custom={i}
            initial="hidden"
            transition={{ ease: "linear" }}
            animate="visible"
            variants={variants}
          />
        ))}
      </SimpleGrid>

      <VStack width="100%" spacing="2" position="relative" zIndex="dropdown" marginBottom="20">
        <HStack width="100%" spacing="5">
          <Text whiteSpace="nowrap" width="10%">
            X: {x}
          </Text>
          <Slider value={x} onChange={setX} max={200}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>

        <HStack width="100%" spacing="5">
          <Text whiteSpace="nowrap" width="10%">
            Y: {y}
          </Text>
          <Slider value={y} onChange={setY} max={400}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>

        <HStack width="100%" spacing="5">
          <Text whiteSpace="nowrap" width="10%">
            Rotate: {rotate}
          </Text>
          <Slider max={180} min={-180} value={rotate} onChange={setRotate}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </HStack>
      </VStack>
    </>
  );
}
