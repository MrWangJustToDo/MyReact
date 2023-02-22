export default (data) => {
  function remToPx(rem) {
    var fontSize = document.documentElement.style.fontSize;
    return Math.floor(rem * fontSize.replace("px", ""));
  }

  return {
    legend: {
      data: ["空间占用"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(200, 200, 200, .2)",
        },
      },
      formatter: `{b0}: {c0}<br />{b1}: {c1}`,
      textStyle: { fontSize: remToPx(0.2) },
      backgroundColor: "rgba(100, 100, 100, .45)",
    },
    xAxis: {
      show: false,
    },
    yAxis: [
      {
        show: false,
        type: "category",
        data: ["已用空间"],
      },
      { show: false, type: "category", data: ["总空间"] },
    ],
    series: [
      {
        type: "bar",
        label: {
          show: true,
          position: "insideLeft",
          color: "#09AAFF",
          formatter: "{c}%",
        },
        itemStyle: {
          barBorderRadius: remToPx(0.08),
          color: "rgba(255, 216, 33, .8)",
        },
        yAxisIndex: 0,
        barWidth: remToPx(0.18),
        barCategoryGap: remToPx(0.18),
        data: [Math.round((+data.totalSize / +data.allowSize) * 100)],
      },
      {
        type: "bar",
        yAxisIndex: 1,
        itemStyle: {
          color: "none",
          borderWidth: remToPx(0.03),
          borderColor: "rgb(9, 170, 255)",
          barBorderRadius: remToPx(0.08),
        },
        barWidth: remToPx(0.2),
        data: [100],
      },
    ],
  };
};
