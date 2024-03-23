import { PacketHeader } from "./PacketHeader";

export interface TyreSetData {
  m_actualTyreCompound: number; // Actual tyre compound used
  m_visualTyreCompound: number; // Visual tyre compound used
  m_wear: number; // Tyre wear (percentage)
  m_available: number; // Whether this set is currently available
  m_recommendedSession: number; // Recommended session for tyre set
  m_lifeSpan: number; // Laps left in this tyre set
  m_usableLife: number; // Max number of laps recommended for this compound
  m_lapDeltaTime: number; // Lap delta time in milliseconds compared to fitted set
  m_fitted: number; // Whether the set is fitted or not
}

export interface PacketTyreSetsData {
  m_header: PacketHeader; // Header
  m_carIdx: number; // Index of the car this data relates to
  m_tyreSetData: TyreSetData[]; // 13 (dry) + 7 (wet)
  m_fittedIdx: number; // Index into array of fitted tyre
}
