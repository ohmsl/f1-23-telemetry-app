"use client";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import BasicSessionInfo from "./components/BasicSessionInfo";
import CentralTelemetry from "./components/CentralTelemetry";
import ConnectedChip from "./components/ConnectedChip";
import EventLog from "./components/EventLog";
import LapTiming from "./components/LapTiming/LapTiming";
import Navbar from "./components/Navbar";
import TyreWearIndicator from "./components/TyreWearIndicator";
import { Tyre } from "./helpers/getTyreData";
import { useTelemetry } from "./providers/telemetry/TelemetryProvider";
dayjs.extend(duration);

const Speedometer = ({ speed, rpm }: { speed: number; rpm: number }) => {
  const mph = Math.round(speed * 0.621371);
  const normalizedSpeed = Math.min(100, Math.max(0, (mph / 250) * 100));
  const normalizedRpm = Math.min(100, Math.max(0, (rpm / 15000) * 100));

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        variant="determinate"
        value={normalizedRpm}
        size={200}
        thickness={4}
        sx={{
          color: (theme) => theme.palette.primary.main,
          "&.MuiCircularProgress-root": {
            circle: {
              strokeLinecap: "round",
            },
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            borderColor: (theme) => theme.palette.background.paper,
            borderStyle: "solid",
            borderWidth: 19,
            zIndex: -1,
          },
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4">{mph}</Typography>
        <Typography variant="subtitle2">MPH</Typography>
        <Typography variant="h6">{rpm}</Typography>
        <Typography variant="subtitle2">RPM</Typography>
      </Box>
    </Box>
  );
};

export default function Home() {
  const {
    connected,
    sessionData,
    sessionHistoryData,
    participantsData,
    carTelemetryData,
    carDamageData,
    carStatusData,
    lapData,
    eventsThisSession,
  } = useTelemetry();
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);

  return (
    <>
      <ConnectedChip connected={connected} />
      <Container
        maxWidth="xl"
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack spacing={2} width="100%">
          <Navbar
            telemetryIndex={telemetryIndex}
            setTelemetryIndex={setTelemetryIndex}
            carTelemetryData={carTelemetryData?.m_carTelemetryData}
            participantsData={participantsData?.m_participants}
          />
          <BasicSessionInfo sessionData={sessionData} />
          <Stack direction="row" spacing={2} width="100%">
            <Paper
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                overflowX: "auto",
                flex: 1,
              }}
              variant="outlined"
            >
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Speedometer
                  speed={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_speed || 0
                  }
                  rpm={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_engineRPM || 0
                  }
                />
                <Divider flexItem sx={{ my: 1 }} />
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="DRS"
                    color={
                      carTelemetryData?.m_carTelemetryData[telemetryIndex]
                        ?.m_drs
                        ? "success"
                        : carStatusData?.m_car_status_data[telemetryIndex]
                            .m_drs_allowed === 1
                        ? "info"
                        : "default"
                    }
                  />
                  <Chip
                    label="ERS"
                    color={
                      carStatusData?.m_car_status_data[telemetryIndex]
                        .m_ers_deploy_mode === 1
                        ? "success"
                        : carStatusData?.m_car_status_data[telemetryIndex]
                            .m_ers_deploy_mode === 2
                        ? "warning"
                        : "default"
                    }
                  />
                </Stack>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Typography variant="h6">Gear</Typography>
                  <Typography variant="h5">
                    {
                      carTelemetryData?.m_carTelemetryData[telemetryIndex]
                        ?.m_gear
                    }
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    (carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_throttle || 0) * 100
                  }
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    height: 12,
                  }}
                />
                <LinearProgress
                  variant="determinate"
                  value={
                    (carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_brake || 0) * 100
                  }
                  sx={{ width: "100%", borderRadius: 2, height: 12 }}
                  color="error"
                />
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <TyreWearIndicator
                    value={
                      carDamageData?.m_car_damage_data[telemetryIndex]
                        .m_tyres_wear[Tyre.FrontLeft] || 0
                    }
                    color="primary"
                  />
                  <TyreWearIndicator
                    value={
                      carDamageData?.m_car_damage_data[telemetryIndex]
                        .m_tyres_wear[Tyre.FrontRight] || 0
                    }
                    color="primary"
                  />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <TyreWearIndicator
                    value={
                      carDamageData?.m_car_damage_data[telemetryIndex]
                        .m_tyres_wear[Tyre.RearLeft] || 0
                    }
                    color="primary"
                  />
                  <TyreWearIndicator
                    value={
                      carDamageData?.m_car_damage_data[telemetryIndex]
                        .m_tyres_wear[Tyre.RearRight] || 0
                    }
                    color="primary"
                  />
                </Stack>
                <Divider flexItem sx={{ my: 0.5 }} />
                <Stack spacing={1} width="100%">
                  <Typography variant="h6" textAlign="center">
                    Pit Window
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Ideal Lap</Typography>
                    <Typography variant="body2">
                      {sessionData?.m_pitStopWindowIdealLap || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Latest Lap</Typography>
                    <Typography variant="body2">
                      {sessionData?.m_pitStopWindowLatestLap || "N/A"}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                  >
                    <Typography variant="body2">Rejoin Pos.</Typography>
                    <Typography variant="body2">
                      {sessionData?.m_pitStopRejoinPosition || "N/A"}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Paper>
            <CentralTelemetry
              vehicleIndex={telemetryIndex}
              setVehicleIndex={setTelemetryIndex}
              activeVehicles={participantsData?.m_numActiveCars || 1}
              carTelemetryData={
                carTelemetryData?.m_carTelemetryData[telemetryIndex]
              }
              participantData={participantsData?.m_participants[telemetryIndex]}
              carDamageData={carDamageData?.m_car_damage_data[telemetryIndex]}
              carStatusData={carStatusData?.m_car_status_data[telemetryIndex]}
            />
            <LapTiming
              lapData={lapData?.m_lapData[telemetryIndex]}
              sessionData={sessionData}
              sessionHistoryData={sessionHistoryData}
              vehicleIndex={telemetryIndex}
            />
          </Stack>
        </Stack>
        <Stack
          sx={{
            flex: 1,
            overflowY: "auto",
            pt: 2,
          }}
        >
          <EventLog
            events={eventsThisSession}
            participantData={participantsData?.m_participants}
          />
        </Stack>
      </Container>
    </>
  );
}
