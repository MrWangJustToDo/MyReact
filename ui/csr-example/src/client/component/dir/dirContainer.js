import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import FileContainer from "./fileContainer/fileContainer";
import EchartsContainer from "./echartsContainer/echartsContainer";
import "./dir.css";

export default () => {
  let location = useLocation();
  let dispatch = useDispatch();
  let { currentRequestPath, fileModel, echartsModel, data, isLogin } = useSelector((state) => state);

  // 加载资源
  useEffect(() => {
    if (isLogin && (currentRequestPath !== "/api" + location.pathname || !data)) {
      dispatch({ type: "refresh", currentRequestPath: "/api" + location.pathname });
    }
  }, [isLogin, currentRequestPath, data, location.pathname]);

  return (
    <div className="fm-container relative overflow">
      {fileModel && <FileContainer />}
      {echartsModel && <EchartsContainer />}
    </div>
  );
};
