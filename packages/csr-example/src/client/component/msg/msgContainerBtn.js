import { useCallback } from "react";
import { useDispatch } from "react-redux";

function MsgContainerBtn() {
  let dispatch = useDispatch();
  let closeMsgHandler = useCallback(() => {
    dispatch({ type: "msgStatePadding" });
  }, [dispatch]);

  return (
    <button className="msg-container-btn absolute" onClick={closeMsgHandler}>
      确定
    </button>
  );
}

export default MsgContainerBtn;
