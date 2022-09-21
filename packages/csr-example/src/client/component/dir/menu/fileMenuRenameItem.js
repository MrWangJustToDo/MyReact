import { useCallback } from "react";
import { useDispatch } from "react-redux";

function FileMenuRenameItem() {
  let dispatch = useDispatch();
  // 重命名按钮点击
  let renameHandler = useCallback(() => {
    dispatch({ type: "renameItem" });
  }, [dispatch]);
  return (
    <li className="fm-context-item overflow relative " onClick={renameHandler}>
      <i className="fas fa-file"></i>
      <span>重命名</span>
    </li>
  );
}

export default FileMenuRenameItem;
