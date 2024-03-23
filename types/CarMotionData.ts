import { PacketHeader } from "./PacketHeader";

export interface CarMotionData {
  m_worldPositionX: number; // f32
  m_worldPositionY: number; // f32
  m_worldPositionZ: number; // f32
  m_worldVelocityX: number; // f32
  m_worldVelocityY: number; // f32
  m_worldVelocityZ: number; // f32
  m_worldForwardDirX: number; // i16
  m_worldForwardDirY: number; // i16
  m_worldForwardDirZ: number; // i16
  m_worldRightDirX: number; // i16
  m_worldRightDirY: number; // i16
  m_worldRightDirZ: number; // i16
  m_gForceLateral: number; // f32
  m_gForceLongitudinal: number; // f32
  m_gForceVertical: number; // f32
  m_yaw: number; // f32
  m_pitch: number; // f32
  m_roll: number; // f32
}

export interface PacketMotionData {
  m_header: PacketHeader;
  m_carMotionData: CarMotionData[];
}
