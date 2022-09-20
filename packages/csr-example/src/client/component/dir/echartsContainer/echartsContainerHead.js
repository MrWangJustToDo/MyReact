import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

function EchartsContainerHead() {
  let dispatch = useDispatch();

  let { echartsModelType } = useSelector((state) => state);

  let clickHandler = useCallback(
    (e) => {
      dispatch({
        type: "changeEchartsModelType",
        echartsModelType: e.target.dataset.name,
      });
    },
    [dispatch]
  );

  return (
    <nav className="fm-echarts-header flex-center">
      <div className="fm-data-module inline-flex">
        <div className={"fm-data-pie inline-flex-center " + (echartsModelType === "pie" ? "check" : "")} onClick={clickHandler} data-name="pie">
          饼形图
        </div>
        <div className={"fm-data-bar inline-flex-center " + (echartsModelType === "bar" ? "check" : "")} onClick={clickHandler} data-name="bar">
          柱状图
        </div>
      </div>
    </nav>
  );
}

export default EchartsContainerHead;
