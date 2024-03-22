import { PacketCarDamageData } from "./CarDamageData";
import { PacketMotionData } from "./CarMotionData";
import { PacketCarSetupData } from "./CarSetupData";
import { PacketCarStatusData } from "./CarStatusData";
import { PacketCarTelemetryData } from "./CarTelemetryData";
import { PacketFinalClassificationData } from "./FinalClassificationData";
import { PacketLapData } from "./LapData";
import { PacketLobbyInfoData } from "./LobbyInfoData";
import { PacketEventData } from "./PacketEventData";
import { PacketMotionExData } from "./PacketMotionExData";
import { PacketSessionData } from "./PacketSessionData";
import { PacketSessionHistoryData } from "./PacketSessionHistoryData";
import { PacketParticipantsData } from "./ParticipantData";
import { PacketTyreSetsData } from "./TyreSetData";

export interface F123UDP {
  on(event: "event", listener: (data: PacketEventData) => void): this;
  on(event: "motion", listener: (data: PacketMotionData) => void): this;
  on(event: "session", listener: (data: PacketSessionData) => void): this;
  on(event: "lapData", listener: (data: PacketLapData) => void): this;
  on(
    event: "participants",
    listener: (data: PacketParticipantsData) => void
  ): this;
  on(event: "carSetups", listener: (data: PacketCarSetupData) => void): this;
  on(
    event: "carTelemetry",
    listener: (data: PacketCarTelemetryData) => void
  ): this;
  on(event: "carStatus", listener: (data: PacketCarStatusData) => void): this;
  on(
    event: "finalClassification",
    listener: (data: PacketFinalClassificationData) => void
  ): this;
  on(event: "lobbyInfo", listener: (data: PacketLobbyInfoData) => void): this;
  on(event: "carDamage", listener: (data: PacketCarDamageData) => void): this;
  on(
    event: "sessionHistory",
    listener: (data: PacketSessionHistoryData) => void
  ): this;
  on(event: "tyreSets", listener: (data: PacketTyreSetsData) => void): this;
  on(event: "motionEx", listener: (data: PacketMotionExData) => void): this;
  start(): void;
  stop(): void;
}
