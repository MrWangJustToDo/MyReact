// echarts 饼形图配置
function getEchartsPieOption(data) {
  let arr = [];
  let temp = {};
  data.files.forEach((it) => {
    let { length: value, shortPath: name, readAbleLength: len } = it;
    arr.push({ value, name });
    temp[name] = len;
  });
  return {
    legend: {
      bottom: "5%",
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
      trigger: "item",
      formatter: (params) => `${params.name}<br/>占用: ${temp[params.name]}`,
      backgroundColor: "rgba(100, 100, 100, .45)",
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        name: "空间占用",
        type: "pie",
        radius: ["30%", "60%"],
        center: ["50%", "45%"],
        roseType: "radius",
        data: arr,
        labelLine: {
          smooth: true,
          length2: 16,
        },
        itemStyle: {
          shadowColor: "rgba(100, 100, 100, .5)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
          shadowBlur: 4,
        },
      },
    ],
  };
}

export default getEchartsPieOption;
