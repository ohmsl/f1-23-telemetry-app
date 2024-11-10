import { Tyre } from "@/app/helpers/getTyreData";
import { parseVisualTyreCompound } from "@/app/helpers/parseTyreCompound";
import { useTelemetryStore } from "@/app/stores/telemetryStore";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { useShallow } from "zustand/shallow";
import DevPerformanceGauge from "../DevPerformanceGauge";
import TyreWearIndicator from "../TyreWearIndicator";
import { Speedometer } from "./Speedometer";

type Props = {
  vehicleIndex: number;
};

const GeneralTelemetry = ({ vehicleIndex }: Props) => {
  const {
    carDamageData,
    carStatusData,
    carTelemetryData,
    lapData,
    sessionData,
  } = useTelemetryStore(
    useShallow((state) => ({
      carDamageData: state.carDamageData?.m_car_damage_data[vehicleIndex],
      carStatusData: state.carStatusData?.m_car_status_data[vehicleIndex],
      carTelemetryData:
        state.carTelemetryData?.m_carTelemetryData[vehicleIndex],
      lapData: state.lapData?.m_lapData[vehicleIndex],
      sessionData: state.sessionData,
    }))
  );

  return (
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
        <DevPerformanceGauge />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Typography variant="h6" color="text.secondary">
            POS.
          </Typography>
          <Typography variant="h4">{lapData?.m_carPosition || "--"}</Typography>
        </Box>
        <Divider flexItem sx={{ mb: 1 }} />
        <Stack>
          <Speedometer
            speed={carTelemetryData?.m_speed || 0}
            rpm={carTelemetryData?.m_engineRPM || 0}
            throttle={carTelemetryData?.m_throttle || 0}
            brakes={carTelemetryData?.m_brake || 0}
            drs={{
              allowed: carStatusData?.m_drs_allowed === 1,
              enabled: carTelemetryData?.m_drs === 1,
            }}
            ersEnabled={carStatusData?.m_ers_deploy_mode === 1}
          />

          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Typography variant="h5">Gear</Typography>
            <Typography variant="h4">{carTelemetryData?.m_gear}</Typography>
          </Box>
        </Stack>
        <Divider flexItem sx={{ my: 1 }} />

        <Stack direction="row" spacing={1} width="100%" justifyContent="center">
          <Typography variant="h6">
            {`${parseVisualTyreCompound(
              carStatusData?.m_visual_tyre_compound || 255
            )} — ${carStatusData?.m_tyres_age_laps || 0} laps`}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TyreWearIndicator
            value={carDamageData?.m_tyres_wear[Tyre.FrontLeft] || 0}
            color="primary"
          />
          <TyreWearIndicator
            value={carDamageData?.m_tyres_wear[Tyre.FrontRight] || 0}
            color="primary"
          />

          <TyreWearIndicator
            value={carDamageData?.m_tyres_wear[Tyre.RearLeft] || 0}
            color="primary"
          />
          <TyreWearIndicator
            value={carDamageData?.m_tyres_wear[Tyre.RearRight] || 0}
            color="primary"
          />
        </Stack>

        <Divider flexItem sx={{ my: 1 }} />
        <Stack spacing={1} width="100%">
          <Typography variant="h6" textAlign="center">
            Pit Window
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="body2">Ideal Lap</Typography>
            <Typography variant="body2">
              {sessionData?.m_pitStopWindowIdealLap || "N/A"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="body2">Latest Lap</Typography>
            <Typography variant="body2">
              {sessionData?.m_pitStopWindowLatestLap || "N/A"}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="body2">Rejoin Pos.</Typography>
            <Typography variant="body2">
              {sessionData?.m_pitStopRejoinPosition || "N/A"}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Paper>
  );
};

export default GeneralTelemetry;
