import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Input,
  TextField,
  Stack,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import "./App.css";
import Heatmap from "./Heatmap";

export default function App() {
  const apiUrl = "http://127.0.0.1:5000/";
  const [graphData, setGraphData] = useState(null);
  const [selectedLocationLetter, setSelectedLocationLetter] = useState("A");
  const [selectedDataType, setSelectedDataType] = useState("Temperature");
  const [sustainability, setSustainability] = useState([]);

  /** Method to Retrieve most recent data from the DB */
  const fetchData = () => {
    axios
      .get(apiUrl)
      .then((response) => {
        setGraphData(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        alert("Error fetching data: " + error.message);
      });
  };

  let scores = Array.from({ length: 7 }, () =>
    Array.from({ length: 10 }, () => [])
  );

  /** On initialization, retrieve the most recent data */
  useEffect(() => {
    if (graphData === null) {
      fetchData();
    } else {
    }
  }, [graphData]);

  return (
    <div className="App">
      <Stack spacing={2} direction="row" alignItems="center" marginTop="2vh">
        <div className="chart-title">
          <TextField
            select
            label="Select Location Letter"
            value={selectedLocationLetter}
            onChange={(e) => setSelectedLocationLetter(e.target.value)}
            sx={{
              color: "white",
              minWidth: "20vh",
              marginTop: "2vh",
              marginRight: "2vh",
              backgroundColor: "white",
            }}
            variant="filled"
          >
            {["A", "B", "C", "D", "E", "F", "G"].map((letter) => (
              <MenuItem key={letter} value={letter}>
                {letter}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <h2>Resource Scores</h2>
          {graphData !== null ? <Heatmap data={} /> : null}
        </div>
      </Stack>
    </div>
  );
}
