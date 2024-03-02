import React from "react";
import HeatMap from "react-heatmap-grid";

// Define Labels for Heatmap
const xLabels = new Array(100)
  .fill(0)
  .map((_, i) => (i % 10 === 0 ? `${i}` : ""));
const yLabels = new Array(100)
  .fill(0)
  .map((_, i) => (i % 10 === 0 ? `${i}` : ""));

/** Retrieve the color for the heatmap based on the score */
const getColorBasedOnScore = (score) => {
  if (score === -200) {
    return "black";
  } else if (score === -100) {
    return "red";
  } else  {
    return "yellow";
  } 
};

/** Determine the alert message based on tge score */
const determineMessage = (score) => {
  if(score === -200){
    return "(Out of Range)";
  }
  else if(score === -100){
    return "(Invalid Position: Land or Missing Data)";
  }
  else{
    return "(Valid Position)";
  }
}

const Heatmap = ({ data }) => {
  const { initialPosRig1, initialPosRig2, finalPosRig1, finalPosRig2, scores } =
    data;
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
        <span style={{ marginRight: "5px", fontSize: "13px", fontFamily: "Helvetica Noue"}}>Initial</span>
        <div
          style={{
            backgroundColor: "darkblue",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px", fontFamily: "Helvetica Noue"}}>Final</span>
        <div
          style={{
            backgroundColor: "yellow",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px",  fontFamily: "Helvetica Noue" }}>Valid</span>
        <div
          style={{
            backgroundColor: "red",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px",  fontFamily: "Helvetica Noue" }}>Invalid</span>
        <div
          style={{
            backgroundColor: "black",
            width: "50px",
            height: "50px",
            marginRight: "5px",
          }}
        ></div>
        <span style={{ marginRight: "5px", fontSize: "13px",  fontFamily: "Helvetica Noue" }}>
          Out of Bounds
        </span>
      </div>
    );
  };

  return (
    <div
      style={{
        fontSize: "15px",
        fontFamily: "Helvetica Noue",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        xLabelsLocation={"bottom"}
        data={scores}
        squares
        height={12}
        onClick={(y, x) => alert(`Coordinates X: ${x}, Y: ${y} \nValue: ${scores[x][y] + " " + determineMessage(scores[x][y])}`)}
        cellStyle={(background, value, min, max, data, x, y) => {
          const score = data[y][x];
          const color = getColorBasedOnScore(score);
          const isInitialPos =
            (y === initialPosRig1[0] && x === initialPosRig1[1]) ||
            (y === initialPosRig2[0] && x === initialPosRig2[1]);
          const isFinalPos =
            (y === finalPosRig1[0] && x === finalPosRig1[1]) ||
            (y === finalPosRig2[0] && x === finalPosRig2[1]);
          return {
            background: isInitialPos ? "white" : isFinalPos ? "darkblue" : color,
            fontSize: "3px",
            fontFamily: "Helvetica Noue",
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
