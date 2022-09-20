import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import echarts from "echarts";
import jquery from "jquery";
import echartsPieBody from "./echartsOptionPie";
import echartsBarBody from "./echartsOptionBar";

function EchartsContainerBody() {
  let ref = useRef();
  let { data, echartsModelType } = useSelector((state) => state);

  useEffect(() => {
    let currentItem = echarts.init(ref.current);
    if (echartsModelType === "pie") {
      currentItem.setOption(echartsPieBody(data));
    } else {
      currentItem.setOption(echartsBarBody(data));
    }
    let win = jquery(window);
    function resize() {
      currentItem.resize();
    }
    win.on("resize", resize);
    return () => win.off("resize", resize);
  }, [echartsModelType, data]);

  return <div className="fm-echarts" id="echartsMain" ref={ref}></div>;
}

export default EchartsContainerBody;
