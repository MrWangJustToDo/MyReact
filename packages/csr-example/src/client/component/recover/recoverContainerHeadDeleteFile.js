import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { deleteFiles } from "../tools/requestData";

// 删除回收站中选中文件
function RecoverContainerHeadDeleteFile() {
  let link = useRef();
  let dispatch = useDispatch();
  let location = useLocation();
  let { data, currentRequestPath, msgState, msgType } = useSelector(
    (state) => state
  );

  let deleteFilesHandler = useCallback(() => {
    let dfiles = data.files
      .filter((it) => it.checked)
      .map((it) => {
        return { path: it.resolvePath, type: it.fileType };
      });
    if (dfiles.length) {
      deleteFiles(dfiles).then((res) => {
        if (res.code === 0) {
          // 删除成功
          dispatch({
            type: "refresh",
            isSamePath: false,
            currentRequestPath: currentRequestPath,
          });
        } else {
          dispatch({
            type: "setMsgOption",
            msgType: "deleteAll",
            msgContent: "删除文件出错",
          });
          dispatch({ type: "enableMsg" });
        }
      });
    } else {
      dispatch({
        type: "setMsgOption",
        msgType: "deleteAll",
        currentRequestPath,
        msgContent: "未选择文件",
      });
      dispatch({ type: "enableMsg" });
    }
  }, [data, dispatch, currentRequestPath]);

  useEffect(() => {
    if (msgState && msgType === "deleteAll" && link.current) {
      link.current.click();
    }
  }, [msgState, msgType]);

  return (
    <>
      <Link
        className="none"
        to={{ pathname: "/msg", state: { background: location } }}
        ref={link}
      ></Link>
      <label className="inline-flex-center" onClick={deleteFilesHandler}>
        <span className="block">
          <i className="fas fa-trash-alt"></i>
          删除选中
        </span>
      </label>
    </>
  );
}

export default RecoverContainerHeadDeleteFile;
