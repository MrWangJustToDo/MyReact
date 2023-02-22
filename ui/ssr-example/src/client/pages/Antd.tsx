import { Carousel, Slider, Switch, Calendar, Tree, Space, TimePicker, TreeSelect, Button, Dropdown, Tooltip, Menu, message, Select, AutoComplete } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

import type { MenuProps } from "antd/lib/menu";
import type { DataNode, TreeProps } from "antd/lib/tree";
import type { Dayjs } from "dayjs";

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

const onChange = (time: Dayjs | null, timeString: string) => {
  console.log(time, timeString);
};

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  message.info("Click on left button.");
  console.log("click left button", e);
};

const handleMenuClick: MenuProps["onClick"] = (e) => {
  message.info("Click on menu item.");
  console.log("click", e);
};

const menu = (
  <Menu
    onClick={handleMenuClick}
    items={[
      {
        label: "1st menu item",
        key: "1",
        icon: <>1</>,
      },
      {
        label: "2nd menu item",
        key: "2",
        icon: <>1</>,
      },
      {
        label: "3rd menu item",
        key: "3",
        icon: <>1</>,
      },
    ]}
  />
);

const { Option } = Select;

const handleChange = (value: string[]) => {
  console.log(`selected ${value}`);
};

const mockVal = (str: string, repeat = 1) => ({
  value: str.repeat(repeat),
});

const AntDesignComponent = () => {
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(["0-0-0", "0-0-1"]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(["0-0-0"]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const [value, setValue] = useState("");
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSearch = (searchText: string) => {
    setOptions(!searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]);
  };

  const onSelect_1 = (data: string) => {
    console.log("onSelect", data);
  };

  const onChange_1 = (data: string) => {
    setValue(data);
  };

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
      <h2>AutoComplete 有bug 需要debug 源码了</h2>
      <AutoComplete options={options} style={{ width: 200 }} onSelect={onSelect_1} onSearch={onSearch} placeholder="input here" />
      <br />
      <br />
      <AutoComplete
        value={value}
        options={options}
        style={{ width: 200 }}
        onSelect={onSelect_1}
        onSearch={onSearch}
        onChange={onChange_1}
        placeholder="control mode"
      />
      <br />
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
        <TimePicker onChange={onChange} defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")} />
      </Space>
      <br />
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="select one country"
        defaultValue={["china"]}
        onChange={handleChange}
        optionLabelProp="label"
      >
        <Option value="china" label="China">
          <div className="demo-option-label-item">
            <span role="img" aria-label="China">
              🇨🇳
            </span>
            China (中国)
          </div>
        </Option>
        <Option value="usa" label="USA">
          <div className="demo-option-label-item">
            <span role="img" aria-label="USA">
              🇺🇸
            </span>
            USA (美国)
          </div>
        </Option>
        <Option value="japan" label="Japan">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Japan">
              🇯🇵
            </span>
            Japan (日本)
          </div>
        </Option>
        <Option value="korea" label="Korea">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Korea">
              🇰🇷
            </span>
            Korea (韩国)
          </div>
        </Option>
      </Select>
      <br />
      <Space wrap>
        <Dropdown.Button onClick={handleButtonClick} overlay={menu}>
          Dropdown
        </Dropdown.Button>
        <Dropdown.Button overlay={menu} placement="bottom" icon={<>2</>}>
          Dropdown
        </Dropdown.Button>
        <Dropdown.Button onClick={handleButtonClick} overlay={menu} disabled>
          Dropdown
        </Dropdown.Button>
        <Dropdown.Button
          overlay={menu}
          buttonsRender={([leftButton, rightButton]) => [
            <Tooltip title="tooltip" key="leftButton">
              {leftButton}
            </Tooltip>,
            React.cloneElement(rightButton as React.ReactElement<any, string>, { loading: true }),
          ]}
        >
          With Tooltip
        </Dropdown.Button>
        <Dropdown overlay={menu}>
          <Button>
            <Space>Button</Space>
          </Button>
        </Dropdown>
        <Dropdown.Button onClick={handleButtonClick} overlay={menu}>
          Danger
        </Dropdown.Button>
      </Space>
      <br />
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

export const isStatic = true;