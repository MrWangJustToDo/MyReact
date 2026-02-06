import { Box, Container, Flex, Heading, Text, SimpleGrid, Icon, VStack, Badge, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CodeIcon, LayersIcon, ZapIcon, PackageIcon, MonitorIcon, RefreshCwIcon, ServerIcon, PaletteIcon } from "lucide-react";

import { CONTAINER_WIDTH } from "@client/config/container";

import type { ReactNode } from "react";

const MotionBox = motion(Box);

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  delay?: number;
};

const FeatureCard = ({ icon, title, description, badge, badgeColor = "purple", delay = 0 }: FeatureCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBorderColor = useColorModeValue("purple.300", "purple.500");
  const iconBg = useColorModeValue("purple.50", "purple.900");
  const iconColor = useColorModeValue("purple.600", "purple.300");

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Box
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        padding={{ base: "5", md: "6" }}
        height="100%"
        transition="all 0.3s ease"
        _hover={{
          borderColor: hoverBorderColor,
          transform: "translateY(-4px)",
          boxShadow: "lg",
        }}
        cursor="default"
      >
        <VStack align="start" spacing="4">
          <Flex align="center" justify="space-between" width="100%">
            <Box bg={iconBg} borderRadius="lg" padding="3" color={iconColor}>
              {icon}
            </Box>
            {badge && (
              <Badge colorScheme={badgeColor} fontSize="xs" borderRadius="full" px="2">
                {badge}
              </Badge>
            )}
          </Flex>
          <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="600">
            {title}
          </Heading>
          <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" lineHeight="1.7">
            {description}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  );
};

const features = [
  {
    icon: <Icon as={CodeIcon} boxSize="6" />,
    title: "React Compatible",
    description: "Drop-in replacement for React with the same API. Use your existing React code and libraries without modification.",
    badge: "Core",
    badgeColor: "purple",
  },
  {
    icon: <Icon as={LayersIcon} boxSize="6" />,
    title: "Custom Reconciler",
    description: "Build custom renderers with our compact reconciler API. Support for Ink (Terminal), React Three Fiber, and more.",
    badge: "Advanced",
    badgeColor: "blue",
  },
  {
    icon: <Icon as={ZapIcon} boxSize="6" />,
    title: "Vite Integration",
    description: "First-class Vite plugin support with HMR and fast refresh. Works with Remix and React Router v7 out of the box.",
    badge: "Popular",
    badgeColor: "green",
  },
  {
    icon: <Icon as={ServerIcon} boxSize="6" />,
    title: "Next.js Support",
    description: "Run your Next.js applications with @my-react. Full SSR/SSG support with optimized hydration.",
    badge: "SSR",
    badgeColor: "orange",
  },
  {
    icon: <Icon as={MonitorIcon} boxSize="6" />,
    title: "DevTools",
    description: "Powerful debugging with our custom DevTools extension. Inspect component trees, state, and performance in real-time.",
    badge: "Beta",
    badgeColor: "red",
  },
  {
    icon: <Icon as={RefreshCwIcon} boxSize="6" />,
    title: "Hot Refresh",
    description: "Preserve component state during development with our hot refresh implementation for webpack, Vite, and Rspack.",
  },
  {
    icon: <Icon as={PackageIcon} boxSize="6" />,
    title: "Rich Ecosystem",
    description: "Support for webpack, Vite, Rspack, Next.js, Remix, and React Router. Integrate with your favorite build tools.",
  },
  {
    icon: <Icon as={PaletteIcon} boxSize="6" />,
    title: "Three.js & Canvas",
    description: "Render 3D graphics with React Three Fiber and 2D canvas UI. Perfect for interactive visualizations and games.",
    badge: "Experimental",
    badgeColor: "cyan",
  },
];

export const FeaturesSection = () => {
  const sectionBg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box bg={sectionBg} py={{ base: "16", md: "24" }} minHeight="100vh">
      <Container maxWidth={CONTAINER_WIDTH}>
        <VStack spacing={{ base: "12", md: "16" }}>
          {/* Section Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            textAlign="center"
            maxWidth="2xl"
            mx="auto"
            px="4"
          >
            <Badge colorScheme="purple" fontSize="sm" fontWeight="600" borderRadius="full" px="4" py="1" mb="4">
              Features
            </Badge>
            <Heading
              as="h2"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              mb="4"
              bgGradient="linear(to-r, purple.500, pink.500)"
              bgClip="text"
            >
              Everything You Need
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8">
              A complete React alternative with powerful features for building modern web applications. From simple SPAs to complex 3D visualizations.
            </Text>
          </MotionBox>

          {/* Features Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: "4", md: "6" }} width="100%" px={{ base: "4", md: "8", lg: "12" }}>
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </SimpleGrid>

          {/* Stats Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            width="100%"
            px={{ base: "4", md: "8", lg: "12" }}
          >
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={{ base: "6", md: "8" }}
              bg={useColorModeValue("white", "gray.800")}
              borderRadius="2xl"
              padding={{ base: "6", md: "10" }}
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <StatItem number="10+" label="Packages" />
              <StatItem number="100%" label="React API Coverage" />
              <StatItem number="5+" label="Build Tool Integrations" />
              <StatItem number="3+" label="Custom Renderers" />
            </SimpleGrid>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <VStack spacing="1">
    <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold" bgGradient="linear(to-r, purple.500, pink.500)" bgClip="text">
      {number}
    </Text>
    <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm" textAlign="center">
      {label}
    </Text>
  </VStack>
);
