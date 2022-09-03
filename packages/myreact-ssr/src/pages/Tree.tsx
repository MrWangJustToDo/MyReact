import { Space, Switch, TreeSelect, TimePicker } from "antd";
import moment from "moment";
import { useState } from "react";

import type { Moment } from "moment";
import type React from "react";

const { TreeNode } = TreeSelect;

const onChange = (time: Moment | null, timeString: string) => {
  console.log(time, timeString);
};

const App: React.FC = () => {
  const [treeLine, setTreeLine] = useState(true);
  const [showLeafIcon, setShowLeafIcon] = useState(false);

  return (
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
  );
};

export default App;
