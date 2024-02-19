import { Code, Container, Heading, Img, LinkBox, LinkOverlay, Spacer, Text } from "@chakra-ui/react";

import { Table } from "@client/component";
import { CONTAINER_WIDTH } from "@client/config/container";

const { Column } = Table;

const data = [
  {
    "@my-react/react (hook)": "useState",
    "@my-react/react": "createELement",
    "@my-react/react-dom": "render",
    "@my-react/react-reactive": "createReactive",
    "@my-react/react-refresh": "babel plugin",
    "@my-react/react-refresh-tools": "webpack plugin",
    "@my-react/react-vite": "vite plugin",
  },
  {
    "@my-react/react (hook)": "useCallback",
    "@my-react/react": "cloneElement",
    "@my-react/react-dom": "hydrate",
    "@my-react/react-reactive": "reactive",
    "@my-react/react-refresh": "refresh runtime",
    "@my-react/react-refresh-tools": "next.js plugin",
  },
  {
    "@my-react/react (hook)": "useMemo",
    "@my-react/react": "isValidElement",
    "@my-react/react-dom": "renderToString",
    "@my-react/react-reactive": "ref",
    "@my-react/react-refresh-tools": "webpack loader",
  },
  { "@my-react/react (hook)": "useReducer", "@my-react/react": "Children", "@my-react/react-dom": "findDOMNode", "@my-react/react-reactive": "computed" },
  { "@my-react/react (hook)": "useRef", "@my-react/react": "forwardRef", "@my-react/react-dom": "createPortal", "@my-react/react-reactive": "watch" },
  {
    "@my-react/react (hook)": "useEffect",
    "@my-react/react": "lazy",
    "@my-react/react-dom": "unmountComponentAtNode",
    "@my-react/react-reactive": "onBeforeMount",
  },
  {
    "@my-react/react (hook)": "useLayoutEffect",
    "@my-react/react": "createContext",
    "@my-react/react-dom": "renderToNodeStream",
    "@my-react/react-reactive": "onBeforeUnmount",
  },
  {
    "@my-react/react (hook)": "useImperativeHandle",
    "@my-react/react": "createRef",
    "@my-react/react-dom": "createRoot",
    "@my-react/react-reactive": "onBeforeUpdate",
  },
  { "@my-react/react (hook)": "useContext", "@my-react/react": "memo", "@my-react/react-dom": "hydrateRoot", "@my-react/react-reactive": "onMounted" },
  {
    "@my-react/react (hook)": "useDebugValue",
    "@my-react/react": "Component",
    "@my-react/react-dom": "renderToStaticMarkup",
    "@my-react/react-reactive": "onUnmounted",
  },
  {
    "@my-react/react (hook)": "useSignal",
    "@my-react/react": "PureComponent",
    "@my-react/react-dom": "renderToStaticNodeStream",
    "@my-react/react-reactive": "onUpdated",
  },
  { "@my-react/react (hook)": "useDeferredValue", "@my-react/react": "StrictMode", "@my-react/react-dom": "renderToPipeableStream" },
  { "@my-react/react (hook)": "useId", "@my-react/react": "Fragment", "@my-react/react-dom": "renderToReadableStream" },
  { "@my-react/react (hook)": "useInsertionEffect", "@my-react/react": "Suspense" },
  { "@my-react/react (hook)": "useSyncExternalStore", "@my-react/react": "createFactory" },
  { "@my-react/react (hook)": "useTransition", "@my-react/react": "startTransition" },
];

export const ApiSection = () => {
  return (
    <Container maxWidth={CONTAINER_WIDTH} minHeight="100vh" marginTop="4%">
      <Heading marginLeft={{ base: "4%", md: "6%", lg: "8%" }} as="h4" fontSize={{ base: "lg", lg: "2xl" }}>
        Packages
      </Heading>
      <Spacer marginTop={{ base: "4", md: "6", lg: "8", xl: "10" }} />
      <Table
        dataSource={data}
        containerProps={{
          padding: { base: "2", md: "4", lg: "6" },
          marginX: "auto",
          maxWidth: { base: "95%", sm: "90%", lg: "80%" },
          border: "1px solid",
          borderRadius: "md",
          borderColor: "cardBorderColor",
        }}
        tableProps={{ borderRadius: "md" }}
        rowProps={{
          theadRow: {
            backgroundColor: "cardBackgroundColor",
          },
        }}
      >
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderLeftRadius: "2px" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          dataIndex="@my-react/react (hook)"
          headCellRender={{
            cellProps: { fontSize: "1.1rem" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react (hook)</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react-dom</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react-dom" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react-dom" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react-dom"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderRightRadius: "2px" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react-reactive</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react-reactive" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react-reactive" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react-reactive"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderRightRadius: "2px" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react-refresh</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react-refresh" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react-refresh" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react-refresh"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderRightRadius: "2px" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react-refresh-tools</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react-refresh-tools" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react-refresh-tools" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react-refresh-tools"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderRightRadius: "2px" },
            Render: () => (
              <LinkBox display="flex" alignItems="center">
                <Text as="span">@my-react/react-vite</Text>
                <Spacer mx="1" />
                <LinkOverlay href="https://www.npmjs.com/package/@my-react/react-vite" width="60px" height="16px" isExternal>
                  <Img display="inline" objectFit="contain" src="https://img.shields.io/npm/v/%40my-react/react-vite" />
                </LinkOverlay>
              </LinkBox>
            ),
          }}
          dataIndex="@my-react/react-vite"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Code>{cellData}</Code>;
            },
          }}
        />
      </Table>
    </Container>
  );
};
