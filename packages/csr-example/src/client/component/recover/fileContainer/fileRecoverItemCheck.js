import { useCallback } from "react";
import { useDispatch } from "react-redux";

// 文件选中
function FileTbaleFileCheck(props) {
  let dispatch = useDispatch();

  let checkHandler = useCallback(() => {
    dispatch({ type: "changeFileItemCheck", id: props.id });
  }, [props, dispatch]);

  return (
    <div className={props.checked ? "fm-file-checkBox check" : "fm-file-checkBox"} onClick={checkHandler}>
      <label className="fm-file-checkItem block relative check"></label>
    </div>
  );
}

export default FileTbaleFileCheck;
