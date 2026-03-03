import { styled } from "@chakra-ui/react";
import { WidthProvider, Responsive } from "react-grid-layout/legacy";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const StyledResponsiveReactGridLayout = styled(ResponsiveReactGridLayout);

export const ReactGridLayout = Responsive;
