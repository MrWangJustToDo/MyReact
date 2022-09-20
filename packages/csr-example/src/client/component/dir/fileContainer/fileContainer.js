import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import jquery from "jquery";
import FileContainerHead from "./fileContainerHead";
import FileTable from "./table/fileTable";
import FileBlock from "./block/fileBlock";
import FileMenu from "../menu/fileMenu";

function FileContainer() {
  let ref = useRef();

  let { fileModelType, menuState } = useSelector((state) => state);

  useEffect(() => {
    let currentItem = jquery(ref.current);
    currentItem.on("contextmenu", () => false);
    return () => currentItem.off("contextmenu");
  }, []);

  return (
    <div className="fm-table-container relative animate__animated animate__fadeIn animate__faster" ref={ref}>
      <FileContainerHead />
      {menuState && <FileMenu />}
      {fileModelType === "table" ? <FileTable /> : <FileBlock />}
    </div>
  );
}

export default FileContainer;
