/**
 * Represents the car setup data.
 */
export interface CarSetupData {
  /**
   * Front wing aero.
   */
  m_frontWing: number;

  /**
   * Rear wing aero.
   */
  m_rearWing: number;

  /**
   * Differential adjustment on throttle (percentage).
   */
  m_onThrottle: number;

  /**
   * Differential adjustment off throttle (percentage).
   */
  m_offThrottle: number;

  /**
   * Front camber angle (suspension geometry).
   */
  m_frontCamber: number;

  /**
   * Rear camber angle (suspension geometry).
   */
  m_rearCamber: number;

  /**
   * Front toe angle (suspension geometry).
   */
  m_frontToe: number;

  /**
   * Rear toe angle (suspension geometry).
   */
  m_rearToe: number;

  /**
   * Front suspension.
   */
  m_frontSuspension: number;

  /**
   * Rear suspension.
   */
  m_rearSuspension: number;

  /**
   * Front anti-roll bar.
   */
  m_frontAntiRollBar: number;

  /**
   * Rear anti-roll bar.
   */
  m_rearAntiRollBar: number;

  /**
   * Front ride height.
   */
  m_frontSuspensionHeight: number;

  /**
   * Rear ride height.
   */
  m_rearSuspensionHeight: number;

  /**
   * Brake pressure (percentage).
   */
  m_brakePressure: number;

  /**
   * Brake bias (percentage).
   */
  m_brakeBias: number;

  /**
   * Rear left tyre pressure (PSI).
   */
  m_rearLeftTyrePressure: number;

  /**
   * Rear right tyre pressure (PSI).
   */
  m_rearRightTyrePressure: number;

  /**
   * Front left tyre pressure (PSI).
   */
  m_frontLeftTyrePressure: number;

  /**
   * Front right tyre pressure (PSI).
   */
  m_frontRightTyrePressure: number;

  /**
   * Ballast.
   */
  m_ballast: number;

  /**
   * Fuel load.
   */
  m_fuelLoad: number;
}
export interface CarSetupData {
  m_frontWing: number; // Front wing aero
  m_rearWing: number; // Rear wing aero
  m_onThrottle: number; // Differential adjustment on throttle (percentage)
  m_offThrottle: number; // Differential adjustment off throttle (percentage)
  m_frontCamber: number; // Front camber angle (suspension geometry)
  m_rearCamber: number; // Rear camber angle (suspension geometry)
  m_frontToe: number; // Front toe angle (suspension geometry)
  m_rearToe: number; // Rear toe angle (suspension geometry)
  m_frontSuspension: number; // Front suspension
  m_rearSuspension: number; // Rear suspension
  m_frontAntiRollBar: number; // Front anti-roll bar
  m_rearAntiRollBar: number; // Front anti-roll bar
  m_frontSuspensionHeight: number; // Front ride height
  m_rearSuspensionHeight: number; // Rear ride height
  m_brakePressure: number; // Brake pressure (percentage)
  m_brakeBias: number; // Brake bias (percentage)
  m_rearLeftTyrePressure: number; // Rear left tyre pressure (PSI)
  m_rearRightTyrePressure: number; // Rear right tyre pressure (PSI)
  m_frontLeftTyrePressure: number; // Front left tyre pressure (PSI)
  m_frontRightTyrePressure: number; // Front right tyre pressure (PSI)
  m_ballast: number; // Ballast
  m_fuelLoad: number; // Fuel load
}

export interface PacketCarSetupData {
  m_header: PacketHeader; // Header
  m_carSetups: CarSetupData[];
}
