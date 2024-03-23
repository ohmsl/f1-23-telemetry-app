import { PacketHeader } from "./PacketHeader";

export interface Options {
  port?: number;
  address?: string;
}

export interface FastestLapData {
  vehicleIdx: number;
  lapTime: number;
}
export interface RetirementData {
  vehicleIdx: number;
}

export interface TeamMateInPitsData {
  vehicleIdx: number;
}
export interface RaceWinnerData {
  vehicleIdx: number;
}
export interface PenaltyData {
  penaltyType: number;
  infringementType: number;
  vehicleIdx: number;
  otherVehicleIdx: number;
  time: number;
  lapNum: number;
  placesGained: number;
}

export interface SpeedTrapData {
  vehicleIdx: number;
  speed: number;
  isOverallFastestInSession: number;
  isDriverFastestInSession: number;
  fastestVehicleIdxInSession: number;
  fastestSpeedInSession: number;
}

export interface StartLightsData {
  numLights: number;
}

export interface DriveThroughPenaltyServedData {
  vehicleIdx: number;
}

export interface StopGoPenaltyServedData {
  vehicleIdx: number;
}

export interface FlashbackData {
  flashbackFrameIdentifier: number;
  flashbackSessionTime: number;
}

export interface ButtonsData {
  buttonStatus: number;
}

export interface OvertakeData {
  overtakingVehicleIdx: number;
  beingOvertakenVehicleIdx: number;
}

export interface PacketEventData {
  m_header: PacketHeader;
  m_eventStringCode: string;

  m_eventDetails:
    | FastestLapData
    | RetirementData
    | TeamMateInPitsData
    | RaceWinnerData
    | PenaltyData
    | SpeedTrapData
    | StartLightsData
    | DriveThroughPenaltyServedData
    | StopGoPenaltyServedData
    | FlashbackData
    | ButtonsData
    | OvertakeData;
}
