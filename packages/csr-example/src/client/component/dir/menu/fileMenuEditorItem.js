import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

// 编辑文件
function FileMenuEditorItem() {
  let history = useHistory();
  let dispatch = useDispatch();
  let { menuTarget } = useSelector((state) => state);
  return (
    <li
      className="fm-context-item overflow relative"
      onClick={() => {
        history.push(menuTarget);
        dispatch({ type: "menuHide" });
      }}
    >
      <i className="fas fa-edit"></i>
      <span>编辑</span>
    </li>
  );
}

export default FileMenuEditorItem;
