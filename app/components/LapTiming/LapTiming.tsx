import { parseDriverStatus } from "@/app/helpers/parseDriverStatus";
import { LapData } from "@/types/LapData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { LapDisplay } from "./LapDisplay";
import { TimeDisplay } from "./TimeDisplay";

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

  const lapHistoryData = thisVehicleSessionHistory?.m_lapHistoryData;
  const personalBestLapTime = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestLapTimeLapNum - 1]
        ?.m_lapTimeInMS
    : undefined;
  const personalBestSector1Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector1LapNum - 1]
        ?.m_sector1TimeInMS
    : undefined;
  const personalBestSector2Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector2LapNum - 1]
        ?.m_sector2TimeInMS
    : undefined;
  const personalBestSector3Time = lapHistoryData
    ? lapHistoryData[thisVehicleSessionHistory?.m_bestSector3LapNum - 1]
        ?.m_sector3TimeInMS
    : undefined;

  useEffect(() => {
    if (sessionHistoryData?.m_carIdx === vehicleIndex) {
      setThisVehicleSessionHistory(sessionHistoryData);
    }
  }, [sessionHistoryData, vehicleIndex]);

  const computeDelta = useCallback(
    // return an object with the delta time formatted to '0.000' and the color
    // green if positive delta, red if negative delta, grey if no delta

    (lapTime: number, personalBestLapTime: number | undefined) => {
      if (!personalBestLapTime) {
        return { formattedDelta: "-.---", color: "default" };
      }

      const delta = lapTime - personalBestLapTime;
      const formattedDelta = `${delta > 0 ? "+" : ""}${(delta / 1000).toFixed(
        3
      )}`;
      const color = delta > 0 ? "error" : delta < 0 ? "success" : "default";

      return { formattedDelta, color };
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
        <LapDisplay
          currentLap={lapData?.m_currentLapNum}
          totalLaps={sessionData?.m_totalLaps}
        />

        <TimeDisplay
          label={"Current Lap"}
          time={lapData?.m_currentLapTimeInMS}
          driverStatus={
            lapData && lapData.m_driverStatus !== 1
              ? parseDriverStatus(lapData?.m_driverStatus)
              : undefined
          }
          chipText={`+${
            ((lapData?.m_deltaToCarInFrontInMS || 0) / 1000).toFixed(3) ||
            "0.000"
          }`}
          chipColor="default"
        />
        <TimeDisplay
          label="Last Lap"
          time={lapData?.m_lastLapTimeInMS ?? 0}
          labelColor={
            (lapData?.m_lastLapTimeInMS ?? 0) === personalBestLapTime
              ? "success.main"
              : "text.primary"
          }
          chipText={
            computeDelta(lapData?.m_lastLapTimeInMS ?? 0, personalBestLapTime)
              .formattedDelta
          }
          chipColor={
            computeDelta(lapData?.m_lastLapTimeInMS ?? 0, personalBestLapTime)
              .color as any
          }
        />
        <TimeDisplay
          label="Best Lap"
          time={personalBestLapTime}
          labelColor="success.main"
        />
        <TimeDisplay
          label="Sector 1"
          time={
            // if lapData exists, use the current sector time, otherwise use the last sector time from the lapHistoryData
            lapData?.m_sector1TimeInMS !== 0
              ? lapData?.m_sector1TimeInMS
              : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                  ?.m_sector1TimeInMS
          }
          labelColor={
            (lapData?.m_sector1TimeInMS !== 0
              ? lapData
              : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
            )?.m_sector1TimeInMS === personalBestSector1Time
              ? "success.main"
              : "default"
          }
          chipText={
            computeDelta(
              (lapData?.m_sector1TimeInMS !== 0
                ? lapData
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              )?.m_sector1TimeInMS || 0,
              (lapData?.m_sector1TimeInMS !== 0
                ? lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
              )?.m_sector1TimeInMS || 0
            ).formattedDelta
          }
          chipColor={
            computeDelta(
              (lapData?.m_sector1TimeInMS !== 0
                ? lapData
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              )?.m_sector1TimeInMS || 0,
              (lapData?.m_sector1TimeInMS !== 0
                ? lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
              )?.m_sector1TimeInMS || 0
            ).color as any
          }
          isLastLapsTime={lapData?.m_sector1TimeInMS === 0}
        />
        <TimeDisplay
          label="Sector 2"
          time={
            lapData?.m_sector2TimeInMS !== 0
              ? lapData?.m_sector2TimeInMS
              : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                  ?.m_sector2TimeInMS
          }
          labelColor={
            (lapData?.m_sector2TimeInMS !== 0
              ? lapData
              : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
            )?.m_sector2TimeInMS === personalBestSector2Time
              ? "success.main"
              : "default"
          }
          chipText={
            computeDelta(
              (lapData?.m_sector2TimeInMS !== 0
                ? lapData
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              )?.m_sector2TimeInMS || 0,
              (lapData?.m_sector2TimeInMS !== 0
                ? lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
              )?.m_sector2TimeInMS || 0
            ).formattedDelta
          }
          chipColor={
            computeDelta(
              (lapData?.m_sector2TimeInMS !== 0
                ? lapData
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              )?.m_sector2TimeInMS || 0,
              (lapData?.m_sector2TimeInMS !== 0
                ? lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                : lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
              )?.m_sector2TimeInMS || 0
            ).color as any
          }
          isLastLapsTime={lapData?.m_sector2TimeInMS === 0}
        />
        <TimeDisplay
          label="Sector 3"
          time={
            lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              ?.m_sector3TimeInMS
          }
          labelColor={
            lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
              ?.m_sector3TimeInMS === personalBestSector3Time
              ? "success.main"
              : "default"
          }
          chipText={
            computeDelta(
              lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                ?.m_sector3TimeInMS || 0,
              lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
                ?.m_sector3TimeInMS || 0
            ).formattedDelta
          }
          chipColor={
            computeDelta(
              lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 2]
                ?.m_sector3TimeInMS || 0,
              lapHistoryData?.[(lapData?.m_currentLapNum || 1) - 3]
                ?.m_sector3TimeInMS || 0
            ).color as any
          }
          isLastLapsTime={true}
        />
      </Paper>
    </Paper>
  );
};

export default LapTiming;
