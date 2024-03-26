import { LapData } from "@/types/LapData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { Box, Chip, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

type LapTimingProps = {
  lapData: LapData | undefined;
  sessionData: PacketSessionData | undefined;
  sessionHistoryData: PacketSessionHistoryData | undefined;
  vehicleIndex: number;
};

const LapTiming = ({
  lapData,
  sessionData,
  sessionHistoryData,
  vehicleIndex,
}: LapTimingProps) => {
  const [thisVehicleSessionHistory, setThisVehicleSessionHistory] =
    useState<PacketSessionHistoryData>();

  const leaderboardLapHistory = sessionHistoryData?.m_lapHistoryData;
  const leaderboardBestLapTime = leaderboardLapHistory
    ? leaderboardLapHistory[sessionHistoryData?.m_bestLapTimeLapNum]
        .m_lapTimeInMS
    : undefined;
  const leaderboardBestSector1Time = leaderboardLapHistory
    ? leaderboardLapHistory[sessionHistoryData?.m_bestSector1LapNum]
        .m_sector1TimeInMS
    : undefined;
  const leaderboardBestSector2Time = leaderboardLapHistory
    ? leaderboardLapHistory[sessionHistoryData?.m_bestSector2LapNum]
        .m_sector2TimeInMS
    : undefined;
  const leaderboardBestSector3Time = leaderboardLapHistory
    ? leaderboardLapHistory[sessionHistoryData?.m_bestSector3LapNum]
        .m_sector3TimeInMS
    : undefined;

  const lapHistoryData = thisVehicleSessionHistory?.m_lapHistoryData;
  const personalBestLapTime = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestLapTimeLapNum]
        .m_lapTimeInMS
    : undefined;
  const personalBestSector1Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector1LapNum]
        .m_sector1TimeInMS
    : undefined;
  const personalBestSector2Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector2LapNum]
        .m_sector2TimeInMS
    : undefined;
  const personalBestSector3Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector3LapNum]
        .m_sector3TimeInMS
    : undefined;

  const lastLap = {
    time: lapHistoryData?.[0].m_lapTimeInMS || 0,
    sector1: lapHistoryData?.[0].m_sector1TimeInMS || 0,
    sector2: lapHistoryData?.[0].m_sector2TimeInMS || 0,
    sector3: lapHistoryData?.[0]?.m_sector3TimeInMS || 0,
  };

  useEffect(() => {
    if (sessionHistoryData?.m_carIdx === vehicleIndex) {
      setThisVehicleSessionHistory(sessionHistoryData);
    }
  }, [sessionHistoryData, vehicleIndex]);

  const computeChipText = useCallback(
    (current: number | undefined, best: number | undefined) => {
      if (!current || !best) {
        return "-.---";
      }

      return `${current < best ? "-" : current === best ? "" : "+"}${dayjs
        .duration(Math.abs(current - best), "milliseconds")
        .format("s.SSS")}`;
    },
    []
  );

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
        <Box>
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Best Lap
          </Typography>
          <Typography variant="h4" color="success.main">
            {personalBestLapTime
              ? dayjs
                  .duration(personalBestLapTime, "milliseconds")
                  .format("m:ss.SSS")
              : "--:--"}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 1
          </Typography>
          <Typography
            variant="h4"
            color={
              lapData?.m_sector1TimeInMS === personalBestSector1Time
                ? "success.main"
                : "text.primary"
            }
          >
            {lapData?.m_sector1TimeInMS || lastLap.sector1
              ? dayjs
                  .duration(
                    lapData?.m_sector1TimeInMS
                      ? lapData.m_sector1TimeInMS
                      : lastLap.sector1,
                    "milliseconds"
                  )
                  .format("m:ss.SSS")
              : "--:--"}
          </Typography>
          <Chip
            label={
              computeChipText(lapData?.m_sector1TimeInMS, lastLap.sector1) ||
              "-.---"
            }
            color={
              lapData?.m_sector1TimeInMS && lastLap.sector1
                ? lapData?.m_sector1TimeInMS <= lastLap.sector1
                  ? "success"
                  : "error"
                : "default"
            }
            size="small"
          />
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 2
          </Typography>
          <Typography
            variant="h4"
            color={
              lapData?.m_sector2TimeInMS === personalBestSector2Time
                ? "success.main"
                : "text.primary"
            }
          >
            {lapData?.m_sector2TimeInMS || lastLap.sector2
              ? dayjs
                  .duration(
                    lapData?.m_sector2TimeInMS
                      ? lapData.m_sector2TimeInMS
                      : lastLap.sector2,
                    "milliseconds"
                  )
                  .format("m:ss.SSS")
              : "--:--"}
          </Typography>
          <Chip
            label={
              computeChipText(lapData?.m_sector2TimeInMS, lastLap.sector2) ||
              "-.---"
            }
            color={
              lapData?.m_sector2TimeInMS && lastLap.sector2
                ? lapData?.m_sector2TimeInMS <= lastLap.sector2
                  ? "success"
                  : "error"
                : "default"
            }
            size="small"
          />
        </Box>
        <Box>
          <Typography variant="h6" color="text.secondary">
            Sector 3
          </Typography>
          <Typography
            variant="h4"
            color={
              lastLap.sector3 === lapHistoryData?.[1].m_sector3TimeInMS || 0
                ? "success.main"
                : "text.primary"
            }
          >
            {lastLap.sector3
              ? dayjs
                  .duration(lastLap.sector3, "milliseconds")
                  .format("m:ss.SSS")
              : "--:--"}
          </Typography>
          <Chip
            label={
              computeChipText(
                lastLap.sector3,
                lapHistoryData?.[1].m_sector3TimeInMS
              ) || "-.---"
            }
            color={
              lastLap.sector3 && lapHistoryData?.[1].m_sector3TimeInMS
                ? lastLap.sector3 <= lapHistoryData?.[1].m_sector3TimeInMS
                  ? "success"
                  : "error"
                : "default"
            }
            size="small"
          />
        </Box>
      </Paper>
    </Paper>
  );
};

export default LapTiming;
