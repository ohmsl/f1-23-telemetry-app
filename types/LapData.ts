import { PacketHeader } from "./PacketHeader";

export interface LapData {
  m_lastLapTimeInMS: number; // u32
  m_currentLapTimeInMS: number; // u32
  m_sector1TimeInMS: number; // u16
  m_sector1TimeMinutes: number; // u8
  m_sector2TimeInMS: number; // u16
  m_sector2TimeMinutes: number; // u8
  m_deltaToCarInFrontInMS: number; // u16
  m_deltaToRaceLeaderInMS: number; // u16
  m_lapDistance: number; // f32
  m_totalDistance: number; // f32
  m_safetyCarDelta: number; // f32
  m_carPosition: number; // u8
  m_currentLapNum: number; // u8
  m_pitStatus: number; // u8
  m_numPitStops: number; // u8
  m_sector: number; // u8
  m_currentLapInvalid: number; // u8
  m_penalties: number; // u8
  m_totalWarnings: number; // u8
  m_cornerCuttingWarnings: number; // u8
  m_numUnservedDriveThroughPens: number; // u8
  m_numUnservedStopGoPens: number; // u8
  m_gridPosition: number; // u8
  m_driverStatus: number; // u8
  m_resultStatus: number; // u8
  m_pitLaneTimerActive: number; // u8
  m_pitLaneTimeInLaneInMS: number; // u16
  m_pitStopTimerInMS: number; // u16
  m_pitStopShouldServePen: number; // u8
}

export interface PacketLapData {
  m_header: PacketHeader;
  m_lapData: LapData[];
  m_timeTrialPBCarIdx: number;
  m_timeTrialRivalCarIdx: number;
}
