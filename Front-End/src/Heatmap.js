import React from "react";
import HeatMap from "react-heatmap-grid";

const xLabels = new Array(100).fill(0).map((_, i) => `${i}`);
const yLabels = new Array(100).fill(0).map((_, i) => `${i}`);

const getColorBasedOnScore = (score) => {
  console.log(score);
  if (score[0] === 0) {
    return "green";
  } else if (score[0] === 1) {
    return "yellowgreen";
  } else if (score[0] === 2) {
    return "yellow";
  } else if (score[0] === 4) {
    return "orange";
  } else {
    return "red";
  }
};

const Heatmap = ({ data }) => {
  const HeatmapLegend = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
        <div style={{ backgroundColor: "green", width: "20px", height: "20px", marginRight: "5px" }}></div>
        <span>Low</span>
        <div style={{ backgroundColor: "yellowgreen", width: "20px", height: "20px", marginLeft: "5px" }}></div>
        <span>Fair</span>
        <div style={{ backgroundColor: "yellow", width: "20px", height: "20px", margin: "0 5px" }}></div>
        <span>Moderate</span>
        <div style={{ backgroundColor: "orange", width: "20px", height: "20px", marginLeft: "5px" }}></div>
        <span>High</span>
        <div style={{ backgroundColor: "red", width: "20px", height: "20px", marginLeft: "5px" }}></div>
        <span>Extreme</span>
      </div>
    );
  };

  return (
    <div style={{ fontSize: "13px", alignItems: "center", display: "flex", flexDirection: "column" }}>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation={"bottom"}
        xLabelsVisibility={xLabels}
        xLabelWidth={50}
        data={data}
        squares
        height={50}
        cellStyle={(background, value, min, max, data, x, y) => {
          const score = data[y][x];
          const color = getColorBasedOnScore(score);
          return {
            background: color,
            fontSize: "11.5px",
            color: "#444",
          };
        }}
        cellRender={(value) => value && <div>{value}</div>}
      />
      <HeatmapLegend />
    </div>
  );
};

export default Heatmap;
