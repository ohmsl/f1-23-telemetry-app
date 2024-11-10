import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useRef } from "react";

const DevPerformanceGauge = () => {
  const renderCount = useRef(0);
  const startTime = useRef(dayjs().valueOf());
  const lastRenderTime = useRef(dayjs().valueOf());

  if (dayjs().valueOf() - lastRenderTime.current > 1000) {
    startTime.current = dayjs().valueOf();
    renderCount.current = 0;
  }

  lastRenderTime.current = dayjs().valueOf();
  renderCount.current++;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          m: 2,
          display: "flex",
          gap: 1,
          zIndex: 9999,
          background: "black",
          width: "250px",
        }}
      >
        <LinearProgress
          sx={{
            width: "30%",
            height: "70px",
          }}
        />
        <Stack>
          <Typography variant="caption">
            {`Render count: ${renderCount.current}`}
            <br />
            {`Render frequency: ${(
              (renderCount.current / (dayjs().valueOf() - startTime.current)) *
              1000
            ).toFixed(0)} Hz`}
          </Typography>
          <Button
            size="small"
            sx={{ width: "fit-content" }}
            onClick={() => {
              startTime.current = dayjs().valueOf();
              renderCount.current = 0;
            }}
          >
            Reset
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default DevPerformanceGauge;
