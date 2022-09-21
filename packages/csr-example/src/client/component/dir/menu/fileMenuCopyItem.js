import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { copyFile } from "../../tools/requestData";

// 复制文件选项
function FileMenuCopyItem() {
  let link = useRef();
  let dispatch = useDispatch();
  let location = useLocation();

  let { data, msgType, msgState, copyShortName, copyFileState, currentRequestPath, copyFileAtDirRelativePath } = useSelector((state) => state);

  // 复制按钮点击
  let copyHandler = useCallback(() => {
    if (!copyFileState) {
      dispatch({
        type: "copyFileStart",
      });
    } else {
      copyFile(copyShortName, copyFileAtDirRelativePath, data.relativePath).then((res) => {
        if (res.code === 0) {
          dispatch({
            type: "copyFileSuccess",
            isSamePath: false,
            currentRequestPath,
            shortPath: copyShortName,
          });
          dispatch({ type: "menuPadding" });
        } else {
          // 出错
          dispatch({
            type: "setMsgOption",
            msgType: "copyFile",
            currentRequestPath,
            msgContent: "复制文件出错,存在同名文件或者空间不足",
          });
          dispatch({ type: "enableMsg" });
          dispatch({ type: "menuHide" });
        }
        dispatch({ type: "copyFileCompleted" });
      });
    }
  }, [data, dispatch, copyFileState, copyShortName, currentRequestPath, copyFileAtDirRelativePath]);

  useEffect(() => {
    if (msgState && msgType === "copyFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      {msgState && <Link className="none" to={{ pathname: "/msg", state: { background: location } }} ref={link}></Link>}
      <li className="fm-context-item overflow relative" onClick={copyHandler}>
        <i className="fas fa-copy"></i>
        <span>{copyFileState ? "粘贴" : "复制"}</span>
      </li>
    </>
  );
}

export default FileMenuCopyItem;
