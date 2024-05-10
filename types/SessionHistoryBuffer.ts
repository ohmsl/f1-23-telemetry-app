import { CarSetupData } from "@/types/CarSetupData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { CarDamageData } from "./CarDamageData";

export type LapHistory = PacketSessionHistoryData["m_lapHistoryData"][0] & {
  carSetup: CarSetupData;
  tyres: CarDamageData["m_tyres_wear"];
};
export type SessionHistoryBuffer = Omit<
  PacketSessionHistoryData,
  "m_lapHistoryData"
> & {
  m_lapHistoryData: LapHistory[];
};
