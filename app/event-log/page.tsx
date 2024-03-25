"use client";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Chip } from "@mui/material";
import BasicSessionInfo from "../components/BasicSessionInfo";
import EventLog from "../components/EventLog";
import { useTelemetry } from "../providers/telemetry/TelemetryProvider";

const Page = () => {
  const { connected, eventsThisSession, participantsData, sessionData } =
    useTelemetry();
  return (
    <>
      <Chip
        sx={{ position: "fixed", top: 0, right: 0, m: 2, boxShadow: 8 }}
        label={connected ? "Connected" : "Disconnected"}
        color={connected ? "success" : "error"}
        icon={connected ? <CheckCircleIcon /> : <CancelIcon />}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 4,
          gap: 2,
          width: "100%",
          maxHeight: "100%",
        }}
      >
        <BasicSessionInfo sessionData={sessionData} />
        <EventLog
          events={eventsThisSession}
          participantData={participantsData?.m_participants || []}
        />
      </Box>
    </>
  );
};

export default Page;
