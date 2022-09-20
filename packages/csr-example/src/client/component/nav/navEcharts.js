import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

function NavEcharts() {
  let { echartsModel, recoverModel, preRequestPath } = useSelector(
    (state) => state
  );

  let dispatch = useDispatch();

  let history = useHistory();

  let echartsHandler = useCallback(() => {
    if (recoverModel) {
      dispatch({ type: "changeisLoadedToFalse" });
      history.push(preRequestPath);
    }
    dispatch({ type: "enableEchartsModel" });
  }, [recoverModel, dispatch, preRequestPath, history]);

  return (
    <li
      className={echartsModel ? "relative check" : "relative"}
      onClick={echartsHandler}
    >
      <i className="absolute fas fa-hdd"></i>
      <span className="block nav-storage-item">空间占用</span>
    </li>
  );
}

export default NavEcharts;
