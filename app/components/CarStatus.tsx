import { CarDamageData } from "@/types/CarDamageData";
import { CarStatusData } from "@/types/CarStatusData";
import { CarTelemetryData } from "@/types/CarTelemetryData";
import { Stack } from "@mui/material";
import getTyreData, { Tyre } from "../helpers/getTyreData";
import Car from "./Car/Car";
import CarBannerAlert from "./CarBannerAlert";
import StatStack from "./StatStack";

type Props = {
  carTelemetryData: CarTelemetryData | undefined;
  carDamageData: CarDamageData | undefined;
  carStatusData: CarStatusData | undefined;
};

const CarStatus = ({
  carTelemetryData,
  carDamageData,
  carStatusData,
}: Props) => {
  return (
    <Stack>
      <Stack direction="row">
        {!carTelemetryData && (
          <CarBannerAlert message="No Data" severity="error" pulse />
        )}
        {carStatusData?.m_vehicle_fia_flags === 1 && (
          <CarBannerAlert message="Green Flag" severity="success" />
        )}
        {carStatusData?.m_vehicle_fia_flags === 2 && (
          <CarBannerAlert
            message="Cede Position"
            severity="info"
            pulse
            invertColors
          />
        )}
        {carStatusData?.m_vehicle_fia_flags === 3 && (
          <CarBannerAlert
            message="Yellow Flag"
            subtitle="CAUTION"
            severity="warning"
            invertColors
          />
        )}

        <Stack justifyContent="space-between">
          <StatStack
            title="FL TYRE"
            stats={[
              {
                title: "Temp",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.FrontLeft)
                    .outerTemperature
                } °C`,
                color: "warning",
              },
              {
                title: "Pressure",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.FrontLeft)
                    .pressure
                } PSI`,
                color: "primary",
              },
            ]}
            sx={{ mt: 10, minWidth: 150 }}
          />
          <StatStack
            title="RL TYRE"
            stats={[
              {
                title: "Temp",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.RearLeft)
                    .outerTemperature
                } °C`,
                color: "warning",
              },
              {
                title: "Pressure",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.RearLeft)
                    .pressure
                } PSI`,
                color: "primary",
              },
            ]}
            sx={{ mb: 4, minWidth: 150 }}
          />
        </Stack>
        <Stack spacing={2}>
          <Car
            carTelemetryData={carTelemetryData}
            carDamageData={carDamageData}
          />
        </Stack>
        <Stack justifyContent="space-between">
          <StatStack
            title="FR TYRE"
            stats={[
              {
                title: "Temp",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.FrontRight)
                    .outerTemperature
                } °C`,
                color: "warning",
              },
              {
                title: "Pressure",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.FrontRight)
                    .pressure
                } PSI`,
                color: "primary",
              },
            ]}
            align="right"
            sx={{ mt: 10, minWidth: 150 }}
          />
          <StatStack
            title="RR TYRE"
            stats={[
              {
                title: "Temp",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.RearRight)
                    .outerTemperature
                } °C`,
                color: "warning",
              },
              {
                title: "Pressure",
                value: `${
                  getTyreData(carTelemetryData, carDamageData, Tyre.RearRight)
                    .pressure
                } PSI`,
                color: "primary",
              },
            ]}
            align="right"
            sx={{ mb: 4, minWidth: 150 }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="space-between" mt={4}>
        <StatStack
          title="FUEL"
          stats={[
            {
              title: "Fuel Remaining",
              value: `${carStatusData?.m_fuel_in_tank.toFixed(1)} L`,
              color: "primary",
            },
            {
              title: "Laps Remaining",
              value: `${carStatusData?.m_fuel_remaining_laps.toFixed(1)} laps`,
              color: "primary",
            },
          ]}
        />
        <StatStack
          title="BRAKES"
          stats={[
            {
              title: "Avg Temp",
              value: `${
                carTelemetryData &&
                (
                  carTelemetryData?.m_brakesTemperature.reduce(
                    (acc, curr) => acc + curr,
                    0
                  ) / carTelemetryData?.m_brakesTemperature.length
                ).toFixed(0)
              } °C`,
              color: "warning",
            },
            {
              title: "Max Temp",
              value: `${
                carTelemetryData &&
                Math.max(...carTelemetryData?.m_brakesTemperature)
              } °C`,
              color: "warning",
            },
          ]}
          align="right"
        />
      </Stack>
    </Stack>
  );
};

export default CarStatus;
