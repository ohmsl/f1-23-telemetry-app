import { PacketCarDamageData } from "@/types/CarDamageData";
import { PacketMotionData } from "@/types/CarMotionData";
import { PacketCarStatusData } from "@/types/CarStatusData";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import { PacketFinalClassificationData } from "@/types/FinalClassificationData";
import { PacketLapData } from "@/types/LapData";
import { PacketEventData } from "@/types/PacketEventData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { PacketParticipantsData } from "@/types/ParticipantData";
import { create } from "zustand";

export type TelemetryDataBufferType = {
  sessionData?: PacketSessionData;
  sessionHistoryData?: PacketSessionHistoryData;
  participantsData?: PacketParticipantsData;
  carTelemetryData?: PacketCarTelemetryData;
  carDamageData?: PacketCarDamageData;
  carStatusData?: PacketCarStatusData;
  lapData?: PacketLapData;
  finalClassificationData?: PacketFinalClassificationData;
  motionData?: PacketMotionData;
};

export type TelemetryState = {
  connected: boolean;
  setConnected: (connected: boolean) => void;

  sessionData?: PacketSessionData;
  setSessionData: (data: PacketSessionData) => void;

  sessionHistoryData?: PacketSessionHistoryData;
  setSessionHistoryData: (data: PacketSessionHistoryData) => void;

  participantsData?: PacketParticipantsData;
  setParticipantsData: (data: PacketParticipantsData) => void;

  carTelemetryData?: PacketCarTelemetryData;
  setCarTelemetryData: (data: PacketCarTelemetryData) => void;

  carDamageData?: PacketCarDamageData;
  setCarDamageData: (data: PacketCarDamageData) => void;

  carStatusData?: PacketCarStatusData;
  setCarStatusData: (data: PacketCarStatusData) => void;

  lapData?: PacketLapData;
  setLapData: (data: PacketLapData) => void;

  finalClassificationData?: PacketFinalClassificationData;
  setFinalClassificationData: (data: PacketFinalClassificationData) => void;

  eventsThisSession: Array<PacketEventData>;
  addEvent: (eventData: PacketEventData) => void;

  motionData?: PacketMotionData;
  setMotionData: (data: PacketMotionData) => void;

  applyBufferedData: (bufferedData: Partial<TelemetryState>) => void;
};

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  connected: false,
  setConnected: (connected) => set({ connected }),

  sessionData: undefined,
  setSessionData: (data) => set({ sessionData: data }),

  sessionHistoryData: undefined,
  setSessionHistoryData: (data) => set({ sessionHistoryData: data }),

  participantsData: undefined,
  setParticipantsData: (data) => set({ participantsData: data }),

  carTelemetryData: undefined,
  setCarTelemetryData: (data) => set({ carTelemetryData: data }),

  carDamageData: undefined,
  setCarDamageData: (data) => set({ carDamageData: data }),

  carStatusData: undefined,
  setCarStatusData: (data) => set({ carStatusData: data }),

  lapData: undefined,
  setLapData: (data) => set({ lapData: data }),

  finalClassificationData: undefined,
  setFinalClassificationData: (data) => set({ finalClassificationData: data }),

  eventsThisSession: [],
  addEvent: (eventData) =>
    set((state) => ({
      eventsThisSession: [eventData, ...state.eventsThisSession],
    })),

  motionData: undefined,
  setMotionData: (data) => set({ motionData: data }),

  applyBufferedData: (bufferedData) => {
    set((state) => {
      const newState = {
        ...state,
        sessionData: bufferedData.sessionData || state.sessionData,
        sessionHistoryData:
          bufferedData.sessionHistoryData || state.sessionHistoryData,
        participantsData:
          bufferedData.participantsData || state.participantsData,
        carTelemetryData:
          bufferedData.carTelemetryData || state.carTelemetryData,
        carDamageData: bufferedData.carDamageData || state.carDamageData,
        carStatusData: bufferedData.carStatusData || state.carStatusData,
        lapData: bufferedData.lapData || state.lapData,
        finalClassificationData:
          bufferedData.finalClassificationData || state.finalClassificationData,
        motionData: bufferedData.motionData || state.motionData,
      };
      return newState;
    });
  },
}));
