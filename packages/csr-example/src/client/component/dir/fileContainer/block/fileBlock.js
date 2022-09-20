import { memo } from "react";
import { useSelector } from "react-redux";
import FileBlockBody from "./fileBlockBody";

function FileBlock() {
  console.log('block')
  let { isLoaded } = useSelector((state) => state);
  return <div className="fm-table-big son-inline-block relative animate__animated animate__fadeIn animate__faster">{isLoaded && <FileBlockBody />}</div>;
}

export default FileBlock;
