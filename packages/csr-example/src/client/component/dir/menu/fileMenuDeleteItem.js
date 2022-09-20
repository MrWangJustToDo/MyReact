import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { deleteFiles } from "../../tools/requestData";

// 删除文件按钮
function FileMenuDeleteItem() {
  let link = useRef();
  let location = useLocation();
  const dispatch = useDispatch();
  let { msgState, msgType, menuRelativePath, menuType, menuShortName, currentRequestPath } = useSelector((state) => state);

  let deleteHandler = useCallback(() => {
    deleteFiles([{ path: menuRelativePath, type: menuType }]).then((res) => {
      if (res.code === 0) {
        // 文件移除
        dispatch({
          type: "removeItem",
          shortPath: menuShortName,
        });
        if (menuType === "file") {
          // 编辑内容删除
          dispatch({
            type: "deleteEditorItem",
            relativePath: menuRelativePath,
          });
        }
        // 刷新id
        dispatch({ type: "refreshId" });
        // 菜单消失
        dispatch({ type: "menuPadding" });
      } else {
        // 删除失败
        dispatch({
          type: "setMsgOption",
          msgType: "deleteFile",
          currentRequestPath,
          msgContent: "删除文件出错",
        });
        dispatch({ type: "enableMsg" });
        dispatch({ type: "menuHide" });
      }
    });
  }, [menuRelativePath, menuType, menuShortName, dispatch, currentRequestPath]);

  useEffect(() => {
    if (msgState && msgType === "deleteFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      {msgState && <Link className="none" to={{ pathname: "/msg", state: { background: location } }} ref={link}></Link>}
      <li className="fm-context-item overflow relative" onClick={deleteHandler}>
        <i className="fas fs-trash-alt" style={{ fontSize: "0.21rem" }}>
          ⊠
        </i>
        <span>删除</span>
      </li>
    </>
  );
}

export default FileMenuDeleteItem;
