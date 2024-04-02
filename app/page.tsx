"use client";
import {
  Box,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  GaugeContainer,
  GaugeReferenceArc,
  GaugeValueArc,
} from "@mui/x-charts";
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
import { parseVisualTyreCompound } from "./helpers/parseTyreCompound";
import { useTelemetry } from "./providers/telemetry/TelemetryProvider";
dayjs.extend(duration);

const Speedometer = ({
  speed,
  rpm,
  throttle,
  brakes,
  drs,
  ersEnabled,
  gear,
}: {
  speed: number;
  rpm: number;
  throttle: number;
  brakes: number;
  drs: {
    allowed: boolean;
    enabled: boolean;
  };
  ersEnabled: boolean;
  gear: number;
}) => {
  const theme = useTheme();
  const mph = Math.round(speed * 0.621371);

  return (
    <Box
      position="relative"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width="300px"
      height="250px"
    >
      <GaugeContainer
        value={rpm}
        valueMax={13500}
        startAngle={-130}
        endAngle={130}
        cornerRadius={8}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        disableAxisListener
      >
        <GaugeValueArc style={{ fill: theme.palette.info.main }} />
        <GaugeReferenceArc />
      </GaugeContainer>
      <GaugeContainer
        value={throttle}
        valueMax={1}
        cy="60.5%"
        cx="50%"
        innerRadius="60%"
        outerRadius="75%"
        sx={{ position: "absolute" }}
        startAngle={-130}
        endAngle={44}
        cornerRadius={4}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        disableAxisListener
      >
        <GaugeValueArc />
        <GaugeReferenceArc />
      </GaugeContainer>
      <GaugeContainer
        value={brakes}
        valueMax={1}
        cy="60.5%"
        cx="50%"
        innerRadius="60%"
        outerRadius="75%"
        sx={{ position: "absolute" }}
        startAngle={46}
        endAngle={130}
        cornerRadius={4}
        margin={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        disableAxisListener
      >
        <GaugeValueArc style={{ fill: theme.palette.error.main }} />
        <GaugeReferenceArc />
      </GaugeContainer>
      <Box
        top={70}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h4" fontWeight="bold">
          {mph}
        </Typography>
        <Typography variant="subtitle2">MPH</Typography>
        <Typography variant="h6">{rpm}</Typography>
        <Typography variant="subtitle2">RPM</Typography>
        <Stack direction="row" spacing={1} mt={1}>
          <Chip
            label="DRS"
            color={drs.allowed ? "info" : drs.enabled ? "success" : "default"}
          />
          <Chip label="ERS" color={ersEnabled ? "success" : "default"} />
        </Stack>
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
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    POS.
                  </Typography>
                  <Typography variant="h4">
                    {lapData?.m_lapData[telemetryIndex].m_carPosition || "--"}
                  </Typography>
                </Box>
                <Divider flexItem sx={{ mb: 1 }} />
                <Speedometer
                  speed={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_speed || 0
                  }
                  rpm={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_engineRPM || 0
                  }
                  throttle={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_throttle || 0
                  }
                  brakes={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_brake || 0
                  }
                  drs={{
                    allowed:
                      carStatusData?.m_car_status_data[telemetryIndex]
                        .m_drs_allowed === 1,
                    enabled:
                      carTelemetryData?.m_carTelemetryData[telemetryIndex]
                        ?.m_drs === 1,
                  }}
                  ersEnabled={
                    carStatusData?.m_car_status_data[telemetryIndex]
                      .m_ers_deploy_mode === 1
                  }
                  gear={
                    carTelemetryData?.m_carTelemetryData[telemetryIndex]
                      ?.m_gear || 0
                  }
                />

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Typography variant="h5">Gear</Typography>
                  <Typography variant="h4">
                    {
                      carTelemetryData?.m_carTelemetryData[telemetryIndex]
                        ?.m_gear
                    }
                  </Typography>
                </Box>
                <Divider flexItem sx={{ my: 1 }} />

                <Stack
                  direction="row"
                  spacing={1}
                  width="100%"
                  justifyContent="center"
                >
                  <Typography variant="h6">
                    {`${parseVisualTyreCompound(
                      carStatusData?.m_car_status_data[telemetryIndex]
                        .m_visual_tyre_compound || 255
                    )} — ${
                      carStatusData?.m_car_status_data[telemetryIndex]
                        .m_tyres_age_laps || 0
                    } laps`}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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

                <Divider flexItem sx={{ my: 1 }} />
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
