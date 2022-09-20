import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import jquery from "jquery";
import MsgContainerBtn from "./msgContainerBtn";
import { promiseNext } from "../tools/tools";
import "./msg.css";

// 显示提示信息
function MsgContainer() {
  let ref = useRef();
  let history = useHistory();
  let dispatch = useDispatch();
  let { msgContent, msgState, preRequestPath } = useSelector((state) => state);

  useEffect(() => {
    if (msgState === "padding") {
      let item = jquery(ref.current);
      promiseNext(0, () => {
        item.removeClass("animate__zoomIn").addClass("animate__zoomOut");
      }).then(() =>
        promiseNext(400, () => {
          dispatch({ type: "disableMsg" });
          history.push(preRequestPath);
        })
      );
    }
  }, [msgState, history, dispatch, preRequestPath]);

  return (
    <div className="msg-container absolute flex-center animate__animated animate__zoomIn animate__faster" ref={ref}>
      <div className="flex-center msg-container-body relative">
        <span className="msg-container-content">{msgContent}</span>
        <MsgContainerBtn />
      </div>
    </div>
  );
}

export default MsgContainer;
