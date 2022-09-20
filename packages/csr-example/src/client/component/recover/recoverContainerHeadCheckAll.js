import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

// 删除回收站中选中文件
function RecoverContainerHeadDeleteFile() {
  let link = useRef();
  let dispatch = useDispatch();
  let location = useLocation();

  let { data, currentRequestPath, msgState, msgType } = useSelector(
    (state) => state
  );

  let checkAllHandler = useCallback(() => {
    if (data.files.length) {
      if (data.files.every((it) => it.checked)) {
        dispatch({ type: "changeFilesCheck", checkFlag: false });
      } else {
        dispatch({ type: "changeFilesCheck", checkFlag: true });
      }
    } else {
      dispatch({
        type: "setMsgOption",
        msgType: "selectAll",
        currentRequestPath,
        msgContent: "没有文件可以选择",
      });
      dispatch({ type: "enableMsg" });
    }
  }, [data, dispatch, currentRequestPath]);

  useEffect(() => {
    if (msgState && msgType === "selectAll" && link.current) {
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
      <label className="inline-flex-center" onClick={checkAllHandler}>
        <span className="block">
          <i className="fas fa-check-double"></i>
          全选
        </span>
      </label>
    </>
  );
}

export default RecoverContainerHeadDeleteFile;
