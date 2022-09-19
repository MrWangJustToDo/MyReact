import { Carousel, Slider, Switch, Calendar, Tree, Image, Space, TimePicker, TreeSelect } from "antd";
import moment from "moment";
import { useState } from "react";

import type { DataNode, TreeProps } from "antd/lib/tree";
import type { Moment } from "moment";

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

const { TreeNode } = TreeSelect;

const onChange = (time: Moment | null, timeString: string) => {
  console.log(time, timeString);
};

const AntDesignComponent = () => {
  const [visible, setVisible] = useState(false);
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);
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
      <Space direction="vertical">
        <Switch checkedChildren="treeLine" unCheckedChildren="treeLine" checked={treeLine} onChange={() => setTreeLine(!treeLine)} />
        <Switch
          disabled={!treeLine}
          checkedChildren="showLeafIcon"
          unCheckedChildren="showLeafIcon"
          checked={showLeafIcon}
          onChange={() => setShowLeafIcon(!showLeafIcon)}
        />
        <TreeSelect treeLine={treeLine && { showLeafIcon }} style={{ width: 300 }}>
          <TreeNode value="parent 1" title="parent 1">
            <TreeNode value="parent 1-0" title="parent 1-0">
              <TreeNode value="leaf1" title="my leaf" />
              <TreeNode value="leaf2" title="your leaf" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1">
              <TreeNode value="sss" title="sss" />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
        <TimePicker onChange={onChange} defaultOpenValue={moment("00:00:00", "HH:mm:ss")} />
      </Space>
      <br />
      <Image
        preview={{ visible: false }}
        width={200}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
      />
      <div style={{ display: "none" }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp" />
          <Image src="https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp" />
        </Image.PreviewGroup>
      </div>
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
