import React from "react";
import HeatMap from "react-heatmap-grid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const xLabels = new Array(100).fill(0).map((_, i) => `${i}`);
const yLabels = new Array(100).fill(0).map((_, i) => `${i}`);

const getColorBasedOnScore = (score) => {
  if (score === -200) {
    return "black";
  } else if (score === -100) {
    return "red";
  } else if (score < 0) {
    return "orange";
  } else if (score > 0) {
    return "yellow";
  } else {
    return "green";
  }
};

const Heatmap = ({ data }) => {
  const { initialPosRig1, initialPosRig2, finalPosRig1, finalPosRig2, scores } = data;
  const HeatmapLegend = () => {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <div
          style={{
            backgroundColor: "white",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px" }}>Initial</span>
        <div
          style={{
            backgroundColor: "green",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px" }}>Final</span>
        <div
          style={{
            backgroundColor: "yellow",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px" }}>Valid</span>
        <div
          style={{
            backgroundColor: "red",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px" }}>Invalid</span>
        <div
          style={{
            backgroundColor: "black",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px" }}>
          Out of Bounds
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        fontSize: "6px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            xLabelsLocation={"bottom"}
            xLabelsVisibility={false}
            yLabelsVisibility={false}
            xLabelWidth={5}
            data={scores}
            squares
            height={5}
            cellStyle={(background, value, min, max, data, x, y) => {
              const score = data[y][x];
              const color = getColorBasedOnScore(score);
              const isInitialPos = (y === initialPosRig1[0] && x === initialPosRig1[1]) || (y === initialPosRig2[0] && x === initialPosRig2[1]);
              const isFinalPos = (y === finalPosRig1[0] && x === finalPosRig1[1]) || (y === finalPosRig2[0] && x === finalPosRig2[1]);
              return {
                background: isInitialPos
                  ? "white"
                  : isFinalPos
                  ? "green"
                  : color,
                fontSize: "1px",
                color: "#444",
              };
            }}
            cellRender={(value) =>
              value !== null ? <div>{value.toFixed(2)}</div> : null
            }
          />
      <HeatmapLegend />
    </div>
  );
};

export default Heatmap;
