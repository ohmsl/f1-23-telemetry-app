import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { useTelemetryStore } from "../stores/telemetryStore";
import CarSetup from "./CarSetup";
import CarStatus from "./CarStatus";

type Props = {
  vehicleIndex: number;
};

const CentralTelemetry = ({ vehicleIndex }: Props) => {
  const [pageNumber, setPageNumber] = useState(0);

  const { carTelemetryData, carDamageData, carStatusData } = useTelemetryStore(
    useShallow((state) => ({
      carTelemetryData:
        state.carTelemetryData?.m_carTelemetryData[vehicleIndex],
      carDamageData: state.carDamageData?.m_car_damage_data[vehicleIndex],
      carStatusData: state.carStatusData?.m_car_status_data[vehicleIndex],
    }))
  );

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
