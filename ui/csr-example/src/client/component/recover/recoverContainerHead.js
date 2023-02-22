import React from "react";
import FileContainerHeadLeftBtn from "./recoverContainerHeadLeftBtn";
import FileContainerHeadRightBtn from "./recoverContainerHeadRightBtn";

function FileContainerHead() {
  return (
    <div className="fm-table-header flex relative">
      <FileContainerHeadLeftBtn />
      <FileContainerHeadRightBtn />
    </div>
  );
}

export default React.memo(FileContainerHead);
