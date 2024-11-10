"use client";
import { Container, Stack, Theme, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useState } from "react";
import BasicSessionInfo from "./components/BasicSessionInfo";
import CentralTelemetry from "./components/CentralTelemetry";
import ConnectedChip from "./components/ConnectedChip";
import EventLog from "./components/EventLog";
import GeneralTelemetry from "./components/GeneralTelemetry/GeneralTelemetry";
import LapTiming from "./components/LapTiming/LapTiming";
import Navbar from "./components/Navbar";
import { TelemetryProvider } from "./providers/telemetry/TelemetryProvider";
dayjs.extend(duration);

export default function Home() {
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  return (
    <TelemetryProvider>
      <ConnectedChip />
      <Container
        maxWidth="xl"
        sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <Stack spacing={2} width="100%">
          <Navbar
            vehicleIndex={telemetryIndex}
            setVehicleIndex={setTelemetryIndex}
          />
          <BasicSessionInfo />
          <Stack
            direction={isSmallScreen ? "column" : "row"}
            spacing={2}
            width="100%"
          >
            <GeneralTelemetry vehicleIndex={telemetryIndex} />
            <CentralTelemetry vehicleIndex={telemetryIndex} />
            <LapTiming vehicleIndex={telemetryIndex} />
          </Stack>
          <EventLog />
        </Stack>
      </Container>
    </TelemetryProvider>
  );
}
