import { LapData } from "@/types/LapData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { Box, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";

type LapTimingProps = {
  lapData: LapData | undefined;
  sessionData: PacketSessionData | undefined;
};

const LapTiming = ({ lapData, sessionData }: LapTimingProps) => {
  //   const lapDiff = calculateLiveLapTimeDiff(lapData);

  return (
    <Paper sx={{ p: 2, overflowX: "auto", flex: 1 }} variant="outlined">
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: "100%",
        }}
      >
        <Box>
          <Typography variant="h6" color="text.secondary">
            Lap
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="h4">
              {lapData?.m_currentLapNum || "--"}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {`/ ${sessionData?.m_totalLaps || "--"}`}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Current Lap
          </Typography>
          <Typography variant="h4">
            {!lapData?.m_currentLapTimeInMS
              ? "-:--:---"
              : dayjs
                  .duration(lapData.m_currentLapTimeInMS, "milliseconds")
                  .format("m:ss.SSS")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            -.---
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Last Lap
          </Typography>
          <Typography variant="h4">
            {!lapData?.m_lastLapTimeInMS
              ? "--:--"
              : dayjs
                  .duration(lapData.m_lastLapTimeInMS, "milliseconds")
                  .format("m:ss.SSS")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 1
          </Typography>
          <Typography variant="h4">
            {!lapData?.m_sector1TimeInMS
              ? lapData?.m_sector === 0
                ? lapData?.m_currentLapTimeInMS
                  ? dayjs
                      .duration(lapData.m_currentLapTimeInMS, "milliseconds")
                      .format("m:ss.SSS")
                  : "--:--"
                : "--:--"
              : dayjs
                  .duration(lapData.m_sector1TimeInMS, "milliseconds")
                  .format("m:ss.SSS")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 2
          </Typography>
          <Typography variant="h4">
            {!lapData?.m_sector2TimeInMS
              ? lapData?.m_sector === 1
                ? lapData?.m_currentLapTimeInMS
                  ? dayjs
                      .duration(
                        lapData.m_currentLapTimeInMS -
                          lapData.m_sector1TimeInMS,
                        "milliseconds"
                      )
                      .format("m:ss.SSS")
                  : "--:--"
                : "--:--"
              : dayjs
                  .duration(lapData.m_sector2TimeInMS, "milliseconds")
                  .format("m:ss.SSS")}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 3
          </Typography>
          <Typography variant="h4">
            {lapData?.m_sector !== 2
              ? "--:--"
              : dayjs
                  .duration(
                    lapData.m_currentLapTimeInMS -
                      lapData.m_sector1TimeInMS -
                      lapData.m_sector2TimeInMS,
                    "milliseconds"
                  )
                  .format("m:ss.SSS")}
          </Typography>
        </Box>
      </Paper>
    </Paper>
  );
};

export default LapTiming;
