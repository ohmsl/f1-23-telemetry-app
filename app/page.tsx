"use client";
import { WeatherForecastSample } from "@/types/WeatherForecastSample";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  BsCloudLightningRainFill,
  BsCloudRainFill,
  BsCloudRainHeavyFill,
  BsCloudsFill,
  BsCloudyFill,
  BsFillQuestionCircleFill,
  BsSunFill,
} from "react-icons/bs";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useState } from "react";
import CarStatus from "./components/CarStatus";
import WeatherCard from "./components/WeatherCard";
import { useTelemetry } from "./providers/telemetry/TelemetryProvider";

const parseSessionType = (sessionType: number | undefined) => {
  switch (sessionType) {
    case 0:
      return "Unknown";
    case 1:
      return "P1";
    case 2:
      return "P2";
    case 3:
      return "P3";
    case 4:
      return "Short Practice";
    case 5:
      return "Q1";
    case 6:
      return "Q2";
    case 7:
      return "Q3";
    case 8:
      return "Short Qualifying";
    case 9:
      return "One Shot Qualifying";
    case 10:
      return "Race";
    case 11:
      return "Race 2";
    case 12:
      return "Race 3";
    case 13:
      return "Time Trial";
    default:
      return "Unknown";
  }
};

const parseWeatherForecast = (
  forecast: Array<WeatherForecastSample> | undefined,
  sessionType?: number
) => {
  forecast = forecast?.filter(
    (sample) =>
      sample.m_sessionType !== 0 && sample.m_sessionType === sessionType
  );

  const chooseIcon = (weather: number) => {
    switch (weather) {
      case 0:
        return <BsSunFill size={24} />;
      case 1:
        return <BsCloudsFill size={24} />;
      case 2:
        return <BsCloudyFill size={24} />;
      case 3:
        return <BsCloudRainFill size={24} />;
      case 4:
        return <BsCloudRainHeavyFill size={24} />;
      case 5:
        return <BsCloudLightningRainFill size={24} />;
      default:
        return <BsFillQuestionCircleFill size={24} />;
    }
  };

  return forecast?.map((sample) => {
    return {
      icon: chooseIcon(sample.m_weather),
      ...sample,
    };
  });
};

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
    participantsData,
    carTelemetryData,
    carDamageData,
    carStatusData,
  } = useTelemetry();
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);

  return (
    <>
      <Chip
        sx={{ position: "fixed", top: 0, right: 0, m: 2, boxShadow: 8 }}
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        icon={connected ? <CheckCircleIcon /> : <CancelIcon />}
      />
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
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
                <IconButton
                  onClick={() => setTelemetryIndex(telemetryIndex - 1)}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={() => setTelemetryIndex(telemetryIndex + 1)}
                >
                  <ChevronRight />
                </IconButton>
              </div>
            </Box>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
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
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]?.m_drs
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
                  {carTelemetryData?.m_carTelemetryData[telemetryIndex]?.m_gear}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={
                  (carTelemetryData?.m_carTelemetryData[telemetryIndex]
                    ?.m_throttle || 0) * 100
                }
                sx={{ width: "100%", borderRadius: 2 }}
              />
              <LinearProgress
                variant="determinate"
                value={
                  (carTelemetryData?.m_carTelemetryData[telemetryIndex]
                    ?.m_brake || 0) * 100
                }
                sx={{ width: "100%", borderRadius: 2 }}
                color="error"
              />
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
                ${carTelemetryData?.m_carTelemetryData.length} - 
                ${participantsData?.m_participants[telemetryIndex]?.m_name}`}
                <IconButton
                  onClick={() => setTelemetryIndex(telemetryIndex - 1)}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  onClick={() => setTelemetryIndex(telemetryIndex + 1)}
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
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ p: 4 }}>
        <Grid item>
          <Paper sx={{ p: 2, overflowX: "auto" }} variant="outlined">
            <Typography variant="h6">Weather</Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {parseWeatherForecast(
                sessionData?.m_weatherForecastSamples,
                sessionData?.m_sessionType
              )?.map((weather, index) => (
                <WeatherCard key={index} weather={weather} />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper sx={{ p: 2, overflowX: "auto" }} variant="outlined">
            <Typography variant="h6">Session</Typography>
            <Typography variant="body2">
              {parseSessionType(sessionData?.m_sessionType)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
