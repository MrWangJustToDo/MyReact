import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import jquery from "jquery";
import echarts from "echarts";
import setOption from "./navSizeOption";

// 显示中的空间剩余,默认空间总大小为1GB
function NavTotalSize() {
  let ref = useRef();

  let { allowSize, totalSize } = useSelector((state) => state);

  useEffect(() => {
    let currentItem = echarts.init(ref.current);
    currentItem.setOption(setOption({ allowSize, totalSize }));
    let win = jquery(window);
    win.on("resize", () => {
      currentItem.setOption(setOption({ allowSize, totalSize }));
      currentItem.resize();
    });
    return () => win.off("resize");
  }, [allowSize, totalSize]);

  return (
    <div className="nav-size relative">
      <div className="nav-size-header flex-center">空间占用（总: 1 GB）</div>
      <div className="nav-size-body" ref={ref} />
    </div>
  );
}

export default NavTotalSize;
