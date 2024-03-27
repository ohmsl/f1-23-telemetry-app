import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { useEffect, useState } from "react";

type VehicleSessionHistoryHookReturnType = PacketSessionHistoryData | undefined;

export const useVehicleSessionHistory = (
  sessionHistoryData: PacketSessionHistoryData | undefined,
  vehicleIndex: number
): VehicleSessionHistoryHookReturnType => {
  const [thisVehicleSessionHistory, setThisVehicleSessionHistory] =
    useState<PacketSessionHistoryData>();

  useEffect(() => {
    if (sessionHistoryData?.m_carIdx === vehicleIndex) {
      setThisVehicleSessionHistory(sessionHistoryData);
    }
  }, [sessionHistoryData, vehicleIndex]);

  return thisVehicleSessionHistory;
};
