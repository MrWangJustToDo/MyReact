import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { addDir } from "../../tools/requestData";

// 新建文件夹
function FileContainerHeadAddDir() {
  let link = useRef();
  let location = useLocation();
  let dispatch = useDispatch();
  let { msgState, msgType, data, currentRequestPath } = useSelector(
    (state) => state
  );

  // 添加文件夹
  let addDirHandler = useCallback(() => {
    addDir(data.relativePath, "newDir").then((res) => {
      if (res.code === 0) {
        dispatch({ type: "createFolderSuccess" });
      } else {
        dispatch({
          type: "setMsgOption",
          msgType: "addDir",
          currentRequestPath,
          msgContent: "新建文件夹失败,存在同名文件夹 [newDir] ",
        });
        dispatch({ type: "enableMsg" });
      }
    });
  }, [dispatch, data, currentRequestPath]);

  // 自动点击,进入模态窗口
  useEffect(() => {
    if (msgState && msgType === "addDir" && link.current) {
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
      <label className="inline-flex-center" onClick={addDirHandler}>
        <span className="block">
          <i className="fas fa-file-medical"></i>
          新建文件夹
        </span>
      </label>
    </>
  );
}

export default FileContainerHeadAddDir;
