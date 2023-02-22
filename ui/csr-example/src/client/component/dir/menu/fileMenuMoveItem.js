import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { moveFile } from "../../tools/requestData";

// 回收文件按钮
function FileMenuMoveItem() {
  let link = useRef();
  let location = useLocation();
  const dispatch = useDispatch();
  let { msgState, msgType, data, menuShortName, menuRelativePath } = useSelector((state) => state);

  let removeHandler = useCallback(() => {
    moveFile(menuShortName, data.relativePath).then((res) => {
      if (res.code === 0) {
        // 移除成功
        dispatch({ type: "menuPadding" });
        // 文件移除
        dispatch({
          type: "removeItem",
          shortPath: menuShortName,
        });
        // 编辑内容删除
        dispatch({
          type: "deleteEditorItem",
          relativePath: menuRelativePath,
        });
        // 刷新id
        dispatch({ type: "refreshId" });
        // 菜单消失
      } else {
        // 删除失败
        dispatch({ type: "menuHide" });
        dispatch({
          type: "setMsgOption",
          msgType: "moveFile",
          msgContent: "移除文件出错",
        });
        dispatch({ type: "enableMsg" });
      }
    });
  }, [data, menuShortName, dispatch, menuRelativePath]);

  useEffect(() => {
    if (msgState && msgType === "moveFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      {msgState && <Link className="none" to={{ pathname: "/msg", state: { background: location } }} ref={link}></Link>}
      <li className="fm-context-item overflow relative" onClick={removeHandler}>
        <i className="fas fa-trash"></i>
        <span>移除</span>
      </li>
    </>
  );
}

export default FileMenuMoveItem;
