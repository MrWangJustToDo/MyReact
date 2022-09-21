import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
function NavFile() {
  let history = useHistory();
  let dispatch = useDispatch();
  let { fileModel, filterName, recoverModel, preRequestPath } = useSelector((store) => store);
  let fileHandler = useCallback(
    (e) => {
      if (recoverModel) {
        dispatch({ type: "changeIsLoadedToFalse" });
        history.push(preRequestPath.replace("/api", ""));
      }
      dispatch({ type: "enableFileModel" });
      dispatch({ type: "changeFilter", filterName: e.target.dataset.name });
    },
    [recoverModel, dispatch, preRequestPath, history]
  );

  return (
    <>
      <li className={fileModel && filterName === "filterDefault" ? "relative check" : "relative"} onClick={fileHandler}>
        {fileModel ? <i className="absolute fas fa-folder-open"></i> : <i className="absolute fas fa-folder"></i>}
        <span className="block nav-select-item" data-name="filterDefault">
          全部文件
        </span>
      </li>
      <li className={fileModel && filterName === "filterText" ? "relative check" : "relative"} onClick={fileHandler}>
        <span className="block nav-select-item" data-name="filterText">
          文档
        </span>
      </li>
      <li className={fileModel && filterName === "filterImg" ? "relative check" : "relative"} onClick={fileHandler}>
        <span className="block nav-select-item" data-name="filterImg">
          图片
        </span>
      </li>
      <li className={fileModel && filterName === "filterVideo" ? "relative check" : "relative"} onClick={fileHandler}>
        <span className="block nav-select-item" data-name="filterVideo">
          视频
        </span>
      </li>
    </>
  );
}

export default NavFile;
