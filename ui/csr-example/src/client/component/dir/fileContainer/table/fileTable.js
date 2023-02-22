import { useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileTableBody from "./fileTableBody";

function FileTable() {
  let dispatch = useDispatch();
  let { menuState, isLoaded, copyFileState } = useSelector((state) => state);
  let bodyMenuHandler = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.button === 2 && copyFileState) {
        if (menuState !== true) {
          dispatch({
            type: "menuShow",
            menuType: "body",
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
    [dispatch, menuState, copyFileState]
  );

  return (
    <div className="fm-table relative" onMouseDown={bodyMenuHandler}>
      <table className="fm-table-show">
        <thead>
          <tr>
            <th>文件名</th>
            <th>大小</th>
            <th>修改日期</th>
          </tr>
        </thead>
        {isLoaded && <FileTableBody />}
      </table>
    </div>
  );
}

export default memo(FileTable);
