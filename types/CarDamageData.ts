import { PacketHeader } from "./PacketHeader";

export interface CarDamageData {
  m_tyres_wear: number[]; // Tyre wear (percentage)
  m_tyres_damage: number[]; // Tyre damage (percentage)
  m_brakes_damage: number[]; // Brakes damage (percentage)
  m_front_left_wing_damage: number; // Front left wing damage (percentage)
  m_front_right_wing_damage: number; // Front right wing damage (percentage)
  m_rear_wing_damage: number; // Rear wing damage (percentage)
  m_floor_damage: number; // Floor damage (percentage)
  m_diffuser_damage: number; // Diffuser damage (percentage)
  m_sidepod_damage: number; // Sidepod damage (percentage)
  m_drs_fault: number; // Indicator for DRS fault, 0 = OK, 1 = fault
  m_ers_fault: number; // Indicator for ERS fault, 0 = OK, 1 = fault
  m_gear_box_damage: number; // Gear box damage (percentage)
  m_engine_damage: number; // Engine damage (percentage)
  m_engine_mguh_wear: number; // Engine wear MGU-H (percentage)
  m_engine_es_wear: number; // Engine wear ES (percentage)
  m_engine_ce_wear: number; // Engine wear CE (percentage)
  m_engine_ice_wear: number; // Engine wear ICE (percentage)
  m_engine_mguk_wear: number; // Engine wear MGU-K (percentage)
  m_engine_tc_wear: number; // Engine wear TC (percentage)
  m_engine_blown: number; // Engine blown, 0 = OK, 1 = fault
  m_engine_seized: number; // Engine seized, 0 = OK, 1 = fault
}

export interface PacketCarDamageData {
  m_header: PacketHeader; // Header
  m_car_damage_data: CarDamageData[];
}
