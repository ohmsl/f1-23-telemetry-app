"use client";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import BasicSessionInfo from "./components/BasicSessionInfo";
import CarStatus from "./components/CarStatus";
import LapTiming from "./components/LapTiming";
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

let startTime = dayjs().valueOf();
let renderCount = 0;

export default function Home() {
  const {
    connected,
    sessionData,
    participantsData,
    carTelemetryData,
    carDamageData,
    carStatusData,
    lapData,
  } = useTelemetry();
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);

  renderCount++;

  return (
    <>
      <LinearProgress
        sx={{ position: "fixed", top: 0, left: 0, right: 0, height: "70px" }}
      />
      <Chip
        sx={{ position: "fixed", top: 0, right: 0, m: 2, boxShadow: 8 }}
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        icon={connected ? <CheckCircleIcon /> : <CancelIcon />}
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
            startTime = dayjs().valueOf();
            renderCount = 0;
          }}
        >
          Reset
        </Button>
        <Typography variant="caption">
          {`Render count: ${renderCount}`}
          <br />
          {`Render frequency: ${(
            (renderCount / (dayjs().valueOf() - startTime)) *
            1000
          ).toFixed(0)} Hz`}
        </Typography>
      </Box>
      <Container maxWidth="xl">
        <Stack spacing={2} width="100%" p={3}>
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
                      ?.m_speed || 0 // carTelemetryData.m_header.player_car_index
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
              </Paper>
            </Paper>
            <Paper sx={{ p: 2, overflowX: "auto" }} variant="outlined">
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Telemetry</Typography>
                <div>
                  {`${telemetryIndex + 1} /
                ${carTelemetryData?.m_carTelemetryData.length || 1} - 
                ${
                  participantsData?.m_participants[telemetryIndex]?.m_name ||
                  "Unavailable"
                }`}
                  <IconButton
                    onClick={() => {
                      if (telemetryIndex > 0) {
                        setTelemetryIndex(telemetryIndex - 1);
                      }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (
                        telemetryIndex <
                        (carTelemetryData?.m_carTelemetryData.length || 1) - 1
                      ) {
                        setTelemetryIndex(telemetryIndex + 1);
                      }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </div>
              </Box>
              <CarStatus
                carTelemetryData={
                  carTelemetryData?.m_carTelemetryData[telemetryIndex]
                }
                carDamageData={carDamageData?.m_car_damage_data[telemetryIndex]}
                carStatusData={carStatusData?.m_car_status_data[telemetryIndex]}
              />
            </Paper>
            <LapTiming
              lapData={lapData?.m_lapData[telemetryIndex]}
              sessionData={sessionData}
            />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
