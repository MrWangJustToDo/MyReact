import { Checkbox, Container } from "@chakra-ui/react";
import { __my_react_shared__ } from "@my-react/react";
import { __my_react_dom_shared__ } from "@my-react/react-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Table } from "@client/component";
import { CONTAINER_WIDTH } from "@client/config/container";
import { useDomSize } from "@client/hooks";
import { noBase } from "@shared";

const { Column } = Table;

type Source = { current: boolean; readonly?: boolean };

const Edit = ({ name, source }: { name: string; source?: Source }) => {
  const [state, setState] = useState(source?.current);

  useEffect(() => {
    if (source && !source.readonly) {
      source.current = state;
    }
  }, [state, source])

  if (!source || !name) return null;

  return (
    <Checkbox isChecked={state} isDisabled={source.readonly} onChange={(e) => setState(e.target.checked)}>
      {name}
    </Checkbox>
  );
};

const data: Array<{ "@my-react/react": keyof typeof __my_react_shared__; "@my-react/react-dom": keyof typeof __my_react_dom_shared__ | "" }> = [
  {
    "@my-react/react": "enableConcurrentMode",
    "@my-react/react-dom": "enableControlComponent",
  },
  { "@my-react/react": "enableDebugFiled", "@my-react/react-dom": "enableDOMField" },
  { "@my-react/react": "enableDebugLog", "@my-react/react-dom": "enableEventSystem" },
  { "@my-react/react": "enableLoopFromRoot", "@my-react/react-dom": "enableEventTrack" },
  { "@my-react/react": "enableOptimizeTreeLog", "@my-react/react-dom": "enableHighlight" },
  { "@my-react/react": "enableScopeTreeLog", "@my-react/react-dom": "" },
  { "@my-react/react": "enablePerformanceLog", "@my-react/react-dom": "" },
];

export default function About() {
  const navigate = useNavigate();

  const { height } = useDomSize({ cssSelector: ".site-header" });

  useEffect(() => {
    if (__REACT__) {
      navigate(noBase ? "/" : `/${__BASENAME__}/`);
    }
  }, [navigate]);

  return (
    <Container maxWidth={CONTAINER_WIDTH} position="relative" height={`calc(100vh - ${height}px)`}>
      <Table
        dataSource={data}
        containerProps={{
          padding: { base: "2", md: "4", lg: "6" },
          marginX: "auto",
          maxWidth: { base: "90%", lg: "80%" },
          border: "1px solid",
          borderRadius: "md",
          borderColor: "cardBorderColor",
        }}
        tableProps={{ borderRadius: "md" }}
        rowProps={{
          theadRow: {
            backgroundColor: "cardBorderColor",
          },
        }}
      >
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem", borderLeftRadius: "2px" },
            Render: "@my-react/react",
          }}
          dataIndex="@my-react/react"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Edit name={cellData} source={__my_react_shared__[cellData]} />;
            },
          }}
        />
        <Column<(typeof data)[0]>
          headCellRender={{
            cellProps: { fontSize: "1.1rem" },
            Render: "@my-react/react-dom",
          }}
          dataIndex="@my-react/react-dom"
          bodyCellRender={{
            Render: ({ cellData }) => {
              return <Edit name={cellData} source={__my_react_dom_shared__[cellData]} />;
            },
          }}
        />
      </Table>
    </Container>
  );
}

export const isStatic = true;
