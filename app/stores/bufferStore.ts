import { create } from "zustand";
import {
  useTelemetryStore,
  type TelemetryDataBufferType,
} from "./telemetryStore";

type BufferStore = {
  dataBuffer: TelemetryDataBufferType;
  setDataBuffer: (key: keyof TelemetryDataBufferType, data: any) => void;
  clearBuffer: () => void;
  checkAndApplyData: (incrementPacketFrequency?: () => void) => void;
};

export const useBufferStore = create<BufferStore>((set, get) => ({
  dataBuffer: {},
  setDataBuffer: (key, data) =>
    set((state) => ({
      dataBuffer: { ...state.dataBuffer, [key]: data },
    })),
  clearBuffer: () => set({ dataBuffer: {} }),
  checkAndApplyData: (incrementPacketFrequency) => {
    const { dataBuffer } = get();
    const requiredData: Array<keyof TelemetryDataBufferType> = [
      "carTelemetryData",
      "carStatusData",
      "lapData",
      "motionData",
    ];

    // if all required data is in the buffer, apply to the main store
    if (requiredData.every((key) => dataBuffer[key])) {
      incrementPacketFrequency?.();

      useTelemetryStore.getState().applyBufferedData(dataBuffer);
      get().clearBuffer();
    }
  },
}));
