import { useSelector } from "react-redux";
import FileBlockFileItem from "./fileBlockFileItem";
import FileBlockDirItem from "./fileBlockDirItem";
import * as Allfilter from "../../../tools/listFilter";

function FileBlockBody() {
  let { filterName, data } = useSelector((state) => state);
  return (
    <>
      {data.files.map((it) => {
        return it.fileType === "file" ? (
          Allfilter[filterName](it.shortPath) && <FileBlockFileItem key={it.id} {...it} />
        ) : (
          <FileBlockDirItem key={it.id} {...it} />
        );
      })}
    </>
  );
}

export default FileBlockBody;
