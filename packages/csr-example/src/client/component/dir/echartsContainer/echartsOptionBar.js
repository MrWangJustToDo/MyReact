import echarts from "echarts";

// echarts 柱壮图配置
function getEchartsBarOption(data) {
  let itemNames = [];
  let itemValues = [];
  let temp = {};
  data.files.forEach((it) => {
    let { length: value, shortPath: name, readAbleLength: len } = it;
    itemNames.push(name);
    itemValues.push(value);
    temp[name] = len;
  });
  return {
    legend: {
      top: "5%",
      shadowColor: "rgba(100, 100, 100, .5)",
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        textShadowColor: "rgba(100, 100, 100, .5)",
        textShadowBlur: 4,
        textShadowOffsetX: 2,
        textShadowOffsetY: 2,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        axis: "x",
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow",
        shadowStyle: {
          color: "rgba(200, 200, 200, .2)",
        },
      },
      formatter: (params) =>
        `${params[0].name}<br/>占用: ${temp[params[0].name]}`,
      backgroundColor: "rgba(100, 100, 100, .45)",
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "0%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      show: "true",
      axisLabel: {
        fontSize: 10,
      },
      axisTick: {
        alignWithLabel: true,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
      },
      data: itemNames,
      minInterval: 1,
      boundaryGap: true,
    },
    yAxis: {
      type: "value",
      show: true,
      axisLabel: {
        fontSize: 10,
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(100, 100, 100, .2)",
        },
      },
    },
    series: [
      {
        name: "占用空间",
        type: "bar",
        barWidth: "50%",
        data: itemValues,
        itemStyle: {
          barBorderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
          shadowColor: "rgba(100, 100, 100, .5)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
          shadowBlur: 4,
        },
      },
    ],
  };
}

export default getEchartsBarOption;
