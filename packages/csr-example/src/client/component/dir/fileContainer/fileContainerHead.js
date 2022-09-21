import React from "react";
import FileContainerHeadLeftBtn from "./fileContainerHeadLeftBtn";
import FileContainerHeadRightBtn from "./fileContainerHeadRightBtn";

function FileContainerHead() {
  return (
    <div className="fm-table-header flex relative">
      <FileContainerHeadLeftBtn />
      <FileContainerHeadRightBtn />
    </div>
  );
}

export default React.memo(FileContainerHead);
