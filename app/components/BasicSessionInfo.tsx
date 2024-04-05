import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import parseSessionType from "../helpers/parseSessionType";
import parseTrackId from "../helpers/parseTrackId";
import { useTelemetry } from "../providers/telemetry/TelemetryProvider";
import Weather from "./Weather/Weather";

const BasicSessionInfo = () => {
  const { sessionData } = useTelemetry();

  return (
    <Paper
      sx={{ display: "flex", p: 2, justifyContent: "space-between" }}
      variant="outlined"
    >
      <Stack direction="row" alignItems="center" width="100%" spacing={3}>
        <Box>
          <Typography variant="h6">
            {parseTrackId(sessionData?.m_trackId || 256)}
          </Typography>
          <Typography variant="h4">
            {parseSessionType(sessionData?.m_sessionType)}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Typography variant="h6">Time Remaining</Typography>
          <Typography variant="h4">
            {!sessionData?.m_sessionTimeLeft
              ? "--:--"
              : dayjs
                  .duration(sessionData?.m_sessionTimeLeft, "seconds")
                  .format("mm:ss")}
          </Typography>
        </Box>
      </Stack>
      <Weather sessionData={sessionData} />
    </Paper>
  );
};

export default BasicSessionInfo;
