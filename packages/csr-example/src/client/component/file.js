import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import FileContainer from "./file/fileContainer";

// 显示文件的父组件
function File() {
  // 判断当前资源是否加载
  let history = useHistory();
  let { isLogin } = useSelector((state) => state);

  if (!isLogin) {
    history.push("/login");
  }

  return <FileContainer />;
}

export default File;
