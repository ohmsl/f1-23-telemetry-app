import { CarDamageData } from "@/types/CarDamageData";
import { CarTelemetryData } from "@/types/CarTelemetryData";

export enum Tyre {
  RearLeft = 0,
  RearRight = 1,
  FrontLeft = 2,
  FrontRight = 3,
}

const getTyreData = (
  carTelemetryData: CarTelemetryData | undefined,
  carDamageData: CarDamageData | undefined,
  tyre: Tyre
) => {
  if (carTelemetryData === undefined || carDamageData === undefined) {
    return {
      innerTemperature: 0,
      outerTemperature: 0,
      pressure: 0,
      wear: 0,
    };
  }
  return {
    innerTemperature: carTelemetryData.m_tyresInnerTemperature[tyre],
    outerTemperature: carTelemetryData.m_tyresSurfaceTemperature[tyre],
    pressure: carTelemetryData.m_tyresPressure[tyre].toFixed(1),
    wear: carDamageData.m_tyres_wear[tyre],
  };
};

export default getTyreData;
