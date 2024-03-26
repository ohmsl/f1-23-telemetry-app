import { Box, Button, LinearProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";

const DevPerformanceGauge = () => {
  const renderCount = useRef(0);
  const startTime = useRef(dayjs().valueOf());

  renderCount.current++;

  return (
    <>
      <LinearProgress
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "70px",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          m: 2,
          display: "flex",
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            startTime.current = dayjs().valueOf();
            renderCount.current = 0;
          }}
        >
          Reset
        </Button>
        <Typography variant="caption">
          {`Render count: ${renderCount.current}`}
          <br />
          {`Render frequency: ${(
            (renderCount.current / (dayjs().valueOf() - startTime.current)) *
            1000
          ).toFixed(0)} Hz`}
        </Typography>
      </Box>
    </>
  );
};

export default DevPerformanceGauge;
