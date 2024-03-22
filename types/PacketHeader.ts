export interface PacketHeader {
  packet_format: number; // u16
  game_year: number; // u8
  game_major_version: number; // u8
  game_minor_version: number; // u8
  packet_version: number; // u8
  packet_id: number; // u8
  session_uid: bigint; // u64, BigInt in JavaScript/TypeScript/ convert to string for use with JSON
  session_time: number; // f32
  frame_identifier: number; // u32
  overall_frame_identifier: number; // u32
  player_car_index: number; // u8
  secondary_player_car_index: number; // u8
}
