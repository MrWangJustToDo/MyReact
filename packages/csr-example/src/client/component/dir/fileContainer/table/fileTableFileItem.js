import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FileTbaleFileItemCheck from "./fileTableFileItemCheck";
import FileTableFileItemRename from "./fileTableFileItemRename";
import FileTableFileItemSubmit from "./fileTableFileItemSubmit";

function FileTableFileItem(props) {
  let dispatch = useDispatch();
  let {
    editorItems,
    menuState,
    menuRelativePath,
    renameState,
    renameRelativePath,
  } = useSelector((state) => state);

  // 右键菜单
  let fileMenuHandler = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.button === 2) {
        if (menuRelativePath !== props.relativePath || menuState !== true) {
          dispatch({
            type: "menuShow",
            menuType: "file",
            menuTarget: props.linkTarget,
            menuRelativePath: props.relativePath,
            menuShortName: props.shortPath,
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
    <tr className="fm-table-file" onMouseDown={fileMenuHandler}>
      <td className="son-inline-block-center relative">
        <FileTbaleFileItemCheck {...props} />
        <i className="fas fa-file"></i>
        {renameState && renameRelativePath === props.relativePath ? (
          <FileTableFileItemRename {...props} />
        ) : (
          <Link
            to={props.preview ? props.linkPreview : props.linkTarget}
            onClick={() => dispatch({ type: "menuHide" })}
          >
            {props.shortPath}
          </Link>
        )}
        {props.relativePath in editorItems && (
          <FileTableFileItemSubmit {...props} />
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

export default FileTableFileItem;
