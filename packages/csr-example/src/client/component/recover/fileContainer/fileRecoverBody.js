import { useSelector } from "react-redux";
import FileRecoverFileItem from "./fileRecoverFileItem";
import FileRecoverDirItem from "./fileRecoverDirItem";

function FileRecoverBody() {
  let { data } = useSelector((state) => state);
  return (
    <tbody>
      {data.files.map((it) => {
        return it.fileType === "file" ? (
          <FileRecoverFileItem key={it.id} {...it} />
        ) : (
          <FileRecoverDirItem key={it.id} {...it} />
        );
      })}
    </tbody>
  );
}

export default FileRecoverBody;
