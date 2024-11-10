import type { TelemetryState } from "../../../stores/telemetryStore";

export const carDamageDataSelector = (vehicleIndex: number) => {
  return (state: TelemetryState) =>
    state.carDamageData?.m_car_damage_data[vehicleIndex];
};
