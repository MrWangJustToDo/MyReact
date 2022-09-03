import { Carousel, Slider, Switch, Calendar, Tree } from "antd";
import { useState } from "react";

import type { DataNode, TreeProps } from "antd/lib/tree";

const treeData: DataNode[] = [
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
      {
        title: "0-0-2",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "0-1",
    key: "0-1",
    children: [
      { title: "0-1-0-0", key: "0-1-0-0" },
      { title: "0-1-0-1", key: "0-1-0-1" },
      { title: "0-1-0-2", key: "0-1-0-2" },
    ],
  },
  {
    title: "0-2",
    key: "0-2",
  },
];

const AntDesignComponent = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    if (Array.isArray(checkedKeysValue)) {
      setCheckedKeys(checkedKeysValue);
    }
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log("onSelect", info);
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <>
      <h2>Ant Design</h2>
      <Switch />
      <br />
      {__SERVER__ ? "server" : <p>client</p>}
      <p>test hydrate</p>
      <Slider />
      <br />
      <Calendar style={{ width: "400px" }} />
      <br />
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
      <br />
      <div style={{ width: "300px", borderRadius: "0.6rem", overflow: "hidden" }}>
        <Carousel autoplay>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>1</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>2</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>3</div>
          </div>
          <div>
            <div style={{ height: "200px", backgroundColor: "#ccc", textAlign: "center", fontSize: "1.6rem" }}>4</div>
          </div>
        </Carousel>
      </div>
    </>
  );
};
export default AntDesignComponent;
