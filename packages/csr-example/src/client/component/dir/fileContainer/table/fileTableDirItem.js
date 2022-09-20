import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FileTableDirItemRename from "./fileTableDirItemRename";

function FileTableDirItem(props) {
  let dispatch = useDispatch();
  let {
    menuState,
    menuRelativePath,
    renameState,
    renameRelativePath,
  } = useSelector((state) => state);

  // 右键菜单
  let folderMenuHandler = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.button === 2) {
        if (menuRelativePath !== props.relativePath || menuState !== true) {
          dispatch({
            type: "menuShow",
            menuType: "dir",
            menuShortName: props.shortPath,
            menuRelativePath: props.relativePath,
            x: e.pageX + 20,
            y: e.pageY,
          });
        } else {
          dispatch({
            type: "menuPadding",
          });
        }
      }
    },
    [dispatch, menuState, menuRelativePath, props]
  );
  
  return (
    <tr className="fm-table-folder" onMouseDown={folderMenuHandler}>
      <td className="son-inline-block-center relative">
        <div className="fm-file-checkBox disable" title="not allow for dir">
          <label className="fm-file-checkItem block relative check">
            <input type="checkbox" />
          </label>
        </div>
        <i className="fas fa-folder"></i>
        {renameState && renameRelativePath === props.relativePath ? (
          <FileTableDirItemRename {...props} />
        ) : (
          <Link
            to={props.linkTarget}
            onClick={() => dispatch({ type: "menuHide" })}
          >
            {props.shortPath}
          </Link>
        )}
      </td>
      <td>
        <span>{props.readAbleLength}</span>
      </td>
      <td>
        <span>{props.modifyTime}</span>
      </td>
    </tr>
  );
}

export default FileTableDirItem;
