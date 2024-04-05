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
import { useTelemetry } from "./providers/telemetry/TelemetryProvider";
dayjs.extend(duration);

export default function Home() {
  const [telemetryIndex, setTelemetryIndex] = useState<number>(0);
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

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  return (
    <>
      <ConnectedChip connected={connected} />
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
