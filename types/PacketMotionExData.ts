export interface PacketMotionExData {
  m_header: PacketHeader; // Header
  m_suspensionPosition: number[]; // Note: All wheel arrays have the following order: RL, RR, FL, FR
  m_suspensionVelocity: number[]; // RL, RR, FL, FR
  m_suspensionAcceleration: number[]; // RL, RR, FL, FR
  m_wheelSpeed: number[]; // Speed of each wheel
  m_wheelSlipRatio: number[]; // Slip ratio for each wheel
  m_wheelSlipAngle: number[]; // Slip angles for each wheel
  m_wheelLatForce: number[]; // Lateral forces for each wheel
  m_wheelLongForce: number[]; // Longitudinal forces for each wheel
  m_heightOfCOGAboveGround: number; // Height of centre of gravity above ground
  m_localVelocityX: number; // Velocity in local space – metres/s
  m_localVelocityY: number; // Velocity in local space
  m_localVelocityZ: number; // Velocity in local space
  m_angularVelocityX: number; // Angular velocity x-component – radians/s
  m_angularVelocityY: number; // Angular velocity y-component
  m_angularVelocityZ: number; // Angular velocity z-component
  m_angularAccelerationX: number; // Angular acceleration x-component – radians/s/s
  m_angularAccelerationY: number; // Angular acceleration y-component
  m_angularAccelerationZ: number; // Angular acceleration z-component
  m_frontWheelsAngle: number; // Current front wheels angle in radians
  m_wheelVertForce: number[]; // Vertical forces for each wheel
}
