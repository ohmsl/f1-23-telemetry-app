export interface LapHistoryData {
  m_lapTimeInMS: number; // Lap time in milliseconds
  m_sector1TimeInMS: number; // Sector 1 time in milliseconds
  m_sector1TimeMinutes: number; // Sector 1 whole minute part
  m_sector2TimeInMS: number; // Sector 2 time in milliseconds
  m_sector2TimeMinutes: number; // Sector 2 whole minute part
  m_sector3TimeInMS: number; // Sector 3 time in milliseconds
  m_sector3TimeMinutes: number; // Sector 3 whole minute part
  m_lapValidBitFlags: number; // 0x01 bit set-lap valid, 0x02 bit set-sector 1 valid
  // 0x04 bit set-sector 2 valid, 0x08 bit set-sector 3 valid
}
