import { useSelector } from "react-redux";
import FileTableFileItem from "./fileTableFileItem";
import FileTableDirItem from "./fileTableDirItem";
import * as Allfilter from "../../../tools/listFilter";

function FileTableBody() {
  let { data, filterName } = useSelector((state) => state);
  return (
    <tbody>
      {data.files.map((it) => {
        return it.fileType === "file" ? (
          Allfilter[filterName](it.shortPath) && (
            <FileTableFileItem key={it.id} {...it} />
          )
        ) : (
          <FileTableDirItem key={it.id} {...it} />
        );
      })}
    </tbody>
  );
}

export default FileTableBody;
