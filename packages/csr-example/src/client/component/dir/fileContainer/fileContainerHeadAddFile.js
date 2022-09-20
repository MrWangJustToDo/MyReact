import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { addFile } from "../../tools/requestData";

// 新建文件
function FileContainerHeadAddFile() {
  let link = useRef();
  let location = useLocation();
  let dispatch = useDispatch();
  let { msgState, msgType, data, currentRequestPath } = useSelector(
    (state) => state
  );

  // 添加文件
  let addFileHandler = useCallback(() => {
    addFile(data.relativePath, "newFile").then((res) => {
      if (res.code === 0) {
        dispatch({ type: "createFileSuccess" });
      } else {
        dispatch({
          type: "setMsgOption",
          msgType: "addFile",
          currentRequestPath,
          msgContent: "新建文件失败,存在同名文件 [newFile] ",
        });
        dispatch({ type: "enableMsg" });
      }
    });
  }, [dispatch, data, currentRequestPath]);

  useEffect(() => {
    if (msgState && msgType === "addFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      {msgState && (
        <Link
          className="none"
          to={{ pathname: "/msg", state: { background: location } }}
          ref={link}
        ></Link>
      )}
      <label className="inline-flex-center" onClick={addFileHandler}>
        <span className="block">
          <i className="fas fa-file-medical"></i>
          新建文件
        </span>
      </label>
    </>
  );
}

export default FileContainerHeadAddFile;
