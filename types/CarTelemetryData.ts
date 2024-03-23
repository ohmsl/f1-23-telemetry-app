import { PacketHeader } from "./PacketHeader";

/**
 * Represents the telemetry data of a car.
 */
export interface CarTelemetryData {
  /**
   * Speed of the car in kilometres per hour.
   */
  m_speed: number;

  /**
   * Amount of throttle applied (0.0 to 1.0).
   */
  m_throttle: number;

  /**
   * Steering value (-1.0 for full lock left to 1.0 for full lock right).
   */
  m_steer: number;

  /**
   * Amount of brake applied (0.0 to 1.0).
   */
  m_brake: number;

  /**
   * Amount of clutch applied (0 to 100).
   */
  m_clutch: number;

  /**
   * Gear selected (1-8, N=0, R=-1).
   */
  m_gear: number;

  /**
   * Engine RPM (Revolutions Per Minute).
   */
  m_engineRPM: number;

  /**
   * DRS (Drag Reduction System) status. 0 = off, 1 = on.
   */
  m_drs: number;

  /**
   * Rev lights indicator as a percentage.
   */
  m_revLightsPercent: number;

  /**
   * Rev lights indicator as a bit value. Bit 0 = leftmost LED, bit 14 = rightmost LED.
   */
  m_revLightsBitValue: number;

  /**
   * Brakes temperature in Celsius for each brake.
   */
  m_brakesTemperature: number[];

  /**
   * Tyres surface temperature in Celsius for each tyre.
   */
  m_tyresSurfaceTemperature: number[];

  /**
   * Tyres inner temperature in Celsius for each tyre.
   */
  m_tyresInnerTemperature: number[];

  /**
   * Engine temperature in Celsius.
   */
  m_engineTemperature: number;

  /**
   * Tyres pressure in PSI (Pounds per Square Inch) for each tyre.
   */
  m_tyresPressure: number[];

  /**
   * Driving surface type for each tyre. See appendices for more details.
   */
  m_surfaceType: number[];
}

export interface PacketCarTelemetryData {
  m_header: PacketHeader; // Header
  m_carTelemetryData: CarTelemetryData[];
  m_mfdPanelIndex: number; // Index of MFD panel open - 255 = MFD closed

  m_mfdPanelIndexSecondaryPlayer: number; // See above
  m_suggestedGear: number; // Suggested gear for the player (1-8)
  // 0 if no gear suggested
}
