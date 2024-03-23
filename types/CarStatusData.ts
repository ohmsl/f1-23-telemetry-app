import { PacketHeader } from "./PacketHeader";

export interface CarStatusData {
  m_traction_control: number; // Traction control - 0 = off, 1 = medium, 2 = full
  m_anti_lock_brakes: number; // 0 (off) - 1 (on)
  m_fuel_mix: number; // Fuel mix - 0 = lean, 1 = standard, 2 = rich, 3 = max
  m_front_brake_bias: number; // Front brake bias (percentage)
  m_pit_limiter_status: number; // Pit limiter status - 0 = off, 1 = on
  m_fuel_in_tank: number; // Current fuel mass
  m_fuel_capacity: number; // Fuel capacity
  m_fuel_remaining_laps: number; // Fuel remaining in terms of laps (value on MFD)
  m_max_rpm: number; // Car's max RPM, point of rev limiter
  m_idle_rpm: number; // Car's idle RPM
  m_max_gears: number; // Maximum number of gears
  m_drs_allowed: number; // 0 = not allowed, 1 = allowed
  m_drs_activation_distance: number; // 0 = DRS not available, non-zero - DRS will be available in [X] meters
  m_actual_tyre_compound: number; // F1 Modern - 16 = C5, 17 = C4, 18 = C3, 19 = C2, 20 = C1
  // 21 = C0, 7 = inter, 8 = wet
  // F1 Classic - 9 = dry, 10 = wet
  // F2 – 11 = super soft, 12 = soft, 13 = medium, 14 = hard
  // 15 = wet
  m_visual_tyre_compound: number; // F1 visual (can be different from actual compound)
  // 16 = soft, 17 = medium, 18 = hard, 7 = inter, 8 = wet
  // F1 Classic – same as above
  // F2 ‘19, 15 = wet, 19 – super soft, 20 = soft
  // 21 = medium, 22 = hard
  m_tyres_age_laps: number; // Age in laps of the current set of tyres
  m_vehicle_fia_flags: number; // -1 = invalid/unknown, 0 = none, 1 = green
  // 2 = blue, 3 = yellow
  m_engine_power_ice: number; // Engine power output of ICE (W)
  m_engine_power_mguk: number; // Engine power output of MGU-K (W)
  m_ers_store_energy: number; // ERS energy store in Joules
  m_ers_deploy_mode: number; // ERS deployment mode, 0 = none, 1 = medium
  // 2 = hotlap, 3 = overtake
  m_ers_harvested_this_lap_mguk: number; // ERS energy harvested this lap by MGU-K
  m_ers_harvested_this_lap_mguh: number; // ERS energy harvested this lap by MGU-H
  m_ers_deployed_this_lap: number; // ERS energy deployed this lap
  m_network_paused: number; // Whether the car is paused in a network game
}

export interface PacketCarStatusData {
  m_header: PacketHeader; // Header
  m_car_status_data: CarStatusData[];
}
