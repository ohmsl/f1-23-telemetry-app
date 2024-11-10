"use client";
import { Box } from "@mui/material";
import BasicSessionInfo from "../components/BasicSessionInfo";
import ConnectedChip from "../components/ConnectedChip";
import EventLog from "../components/EventLog";

const Page = () => {
  return (
    <>
      <ConnectedChip />
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
        <BasicSessionInfo />
        <EventLog />
      </Box>
    </>
  );
};

export default Page;
