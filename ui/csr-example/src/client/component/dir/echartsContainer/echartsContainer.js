import EchartsContainerHead from "./echartsContainerHead";
import EchartsContainerBody from "./echartsContainerBody";
import { useSelector } from "react-redux";

function EchartsContainer() {
  let { isLoaded } = useSelector((state) => state);
  return (
    <div className="fm-echarts-container animate__animated animate__fadeIn animate__faster">
      <EchartsContainerHead />
      {isLoaded && <EchartsContainerBody />}
    </div>
  );
}

export default EchartsContainer;
