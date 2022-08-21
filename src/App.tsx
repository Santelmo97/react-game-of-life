import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import produce from "immer";
import { FC, useCallback, useRef, useState } from "react";
import "./App.css";
export const generateGrid = (rows: number, cols: number, random?: boolean) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    random
      ? grid.push(Array.from(Array(cols), () => (Math.random() > 0.65 ? 1 : 0)))
      : grid.push(Array.from(Array(cols)).fill(0));
  }
  return grid;
};
const App: FC = () => {
  const [running, setRunning] = useState(false);
  const [noRows, setNoRows] = useState(20);
  const [noCols, setNoCols] = useState(20);
  const [speed, setSpeed] = useState(100);
  const runningRef = useRef(running);
  runningRef.current = running;
  const [grid, setGrid] = useState(() => {
    return generateGrid(noRows, noCols);
  });
  const getNeighbours = useCallback(
    (row: number, col: number, currentGrid: any[][]) => {
      let count = 0;
      for (let i = -1; i < 2; i++) {
        if (col + i >= 0 && col + i < noCols - 1) {
          if (row > 0 && currentGrid[row - 1][col + i] === 1) {
            count++;
          }
          if (row < noRows - 1 && currentGrid[row + 1][col + i] === 1) {
            count++;
          }
        }
      }
      if (col - 1 >= 0 && currentGrid[row][col - 1] === 1) {
        count++;
      }
      if (col + 1 < noCols - 1 && currentGrid[row][col + 1] === 1) {
        count++;
      }

      return count;
    },
    [noCols, noRows]
  );
  const runGame = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((grid) => {
      return produce(grid, (prevGrid) => {
        for (let i = 0; i < noRows; i++) {
          for (let k = 0; k < noCols; k++) {
            let neighbors = 0;
            neighbors = getNeighbours(i, k, prevGrid);

            if (neighbors < 2 || neighbors > 3) {
              prevGrid[i][k] = 0;
            } else if (grid[i][k] === 0 && neighbors === 3) {
              prevGrid[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runGame, speed);
  }, [getNeighbours, noCols, noRows, speed]);

  return (
    <div className="App" style={{ backgroundColor: "#f5f0d3" }}>
      <Typography variant="h2" color={"#4A4A4A"}>
        Conway's Game of Life
      </Typography>
      <Grid container direction="row" sx={{ my: 3 }} spacing={2}>
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              disabled={running}
              onClick={() => {
                setRunning(true);
                runningRef.current = true;
                runGame();
              }}
            >
              Start Game
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={!running}
              color="secondary"
              variant="contained"
              onClick={() => {
                setRunning(false);
              }}
            >
              Stop
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setGrid(generateGrid(noRows, noCols, true));
              }}
            >
              Shuffle
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setGrid(generateGrid(noRows, noCols));
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid container item direction="column">
          <Formik
            initialValues={{ rows: noRows, cols: noCols, speed: speed }}
            onSubmit={(values, { setSubmitting }) => {
              setNoCols(values.cols);
              setNoRows(values.rows);
              setSpeed(values.speed);
              setGrid(generateGrid(values.rows, values.cols));
              setSubmitting(false);
            }}
          >
            {({ values, isSubmitting, handleChange }) => (
              <Form>
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item>
                    <TextField
                      label="Rows"
                      variant="outlined"
                      type="number"
                      name="rows"
                      value={values.rows}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Columns"
                      type="number"
                      name="cols"
                      value={values.cols}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Refresh rate(ms)"
                      type="number"
                      name="speed"
                      value={values.speed}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item>
                    <Button type="submit" disabled={isSubmitting}>
                      Set Game
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>

      <Box justifyContent="center" alignItems="center" display="flex">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${noCols},20px)`,
            marginBottom: "20px",
          }}
        >
          {grid.map((rows, i) =>
            rows.map((_, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][j] ? "darkviolet" : "darkgray",
                  border: "solid 1px black",
                }}
                onClick={() => {
                  const newGrid = produce(grid, (prevGrid) => {
                    prevGrid[i][j] = grid[i][j] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
              ></div>
            ))
          )}
        </div>
      </Box>
    </div>
  );
};

export default App;
