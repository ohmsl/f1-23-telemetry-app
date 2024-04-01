import { CarDamageData } from "@/types/CarDamageData";
import { CarStatusData } from "@/types/CarStatusData";
import { CarTelemetryData } from "@/types/CarTelemetryData";
import { ParticipantData } from "@/types/ParticipantData";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import CarSetup from "./CarSetup";
import CarStatus from "./CarStatus";

type Props = {
  vehicleIndex: number;
  setVehicleIndex: (index: number) => void;
  activeVehicles: number;
  carTelemetryData: CarTelemetryData | undefined;
  participantData: ParticipantData | undefined;
  carDamageData: CarDamageData | undefined;
  carStatusData: CarStatusData | undefined;
};

const CentralTelemetry = ({
  vehicleIndex,
  setVehicleIndex,
  activeVehicles,
  carTelemetryData,
  participantData,
  carDamageData,
  carStatusData,
}: Props) => {
  const [pageNumber, setPageNumber] = useState(0);
  return (
    <Paper
      sx={{ position: "relative", p: 2, overflowX: "auto" }}
      variant="outlined"
    >
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
            onClick={() => {
              if (pageNumber > 0) {
                setPageNumber((prev) => prev - 1);
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => {
              if (pageNumber < 1) {
                setPageNumber((prev) => prev + 1);
              }
            }}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </Box>
      {pageNumber === 0 && (
        <CarStatus
          carTelemetryData={carTelemetryData}
          carDamageData={carDamageData}
          carStatusData={carStatusData}
        />
      )}
      {pageNumber === 1 && <CarSetup />}
    </Paper>
  );
};

export default CentralTelemetry;
