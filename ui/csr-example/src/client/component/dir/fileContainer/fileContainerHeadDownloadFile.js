import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { downloadFile } from "../../tools/requestData";

// 文件下载
function FileContainerHeadDownloadFile() {
  let link = useRef();
  let location = useLocation();
  let dispatch = useDispatch();
  let { msgState, msgType, data, currentRequestPath } = useSelector((state) => state);

  // 文件下载
  let downloadHandler = useCallback(() => {
    let fileList = data.files.filter((it) => it.checked);
    if (fileList.length) {
      fileList.forEach((it) => downloadFile(it.relativePath, it.shortPath));
      dispatch({
        type: "changeFileItemToUnCheck",
      });
    } else {
      dispatch({
        type: "setMsgOption",
        msgType: "downloadFile",
        currentRequestPath,
        msgContent: "未选择文件下载！",
      });
      dispatch({ type: "enableMsg" });
    }
  }, [data, dispatch, currentRequestPath]);

  useEffect(() => {
    if (msgState && msgType === "downloadFile" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      {msgState && <Link className="none" to={{ pathname: "/msg", state: { background: location } }} ref={link}></Link>}
      <label className="inline-flex-center" onClick={downloadHandler}>
        <span className="block">
          <i className="fas fa-file-download"></i>
          下载选中
        </span>
      </label>
    </>
  );
}

export default FileContainerHeadDownloadFile;
