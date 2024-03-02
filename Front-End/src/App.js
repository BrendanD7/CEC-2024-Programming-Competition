import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Stack,
  CircularProgress,
  MenuItem,
  Typography,
} from "@mui/material";
import "./App.css";
import Heatmap from "./Heatmap";

export default function App() {
  // Define Variables
  const apiUrl = "http://127.0.0.1:5000/";
  // Hooks
  const [selectedDayNumber, setSelectedDayNumber] = useState("1");
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(
    Array.from({ length: 30 }, () =>
      Array.from({ length: 100 }, () => Array.from({ length: 100 }, () => 0))
    )
  );

  /** Method to Retrieve the Drilling Information */
  const fetchData = () => {
    axios
      .get(apiUrl)
      .then((response) => {
        setScores(response.data.data);
      })
      .catch((error) => {
        alert("Error fetching data: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /** On initialization, retrieve the most recent data */
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <Typography variant="h2" component="h2">
        Offshore Drilling Management System
      </Typography>
      <Stack spacing={2} direction="row" alignItems="center">
        <div className="chart-title">
          {loading ? (
            <CircularProgress style={{ color: "white" }} />
          ) : (
            <div>
              <TextField
                select
                label="Select Day"
                value={selectedDayNumber}
                onChange={(e) => setSelectedDayNumber(e.target.value)}
                sx={{
                  color: "white",
                  minWidth: "20vh",
                  marginBottom: "1vh",
                  marginTop: "1vh",
                  marginRight: "2vh",
                  backgroundColor: "white",
                }}
                variant="filled"
              >
                {Array.from({ length: 30 }, (_, index) => index + 1).map(
                  (number) => (
                    <MenuItem key={number} value={number.toString()}>
                      {number}
                    </MenuItem>
                  )
                )}
              </TextField>
              <Heatmap data={scores[selectedDayNumber - 1]} />
            </div>
          )}
        </div>
      </Stack>
    </div>
  );
}
