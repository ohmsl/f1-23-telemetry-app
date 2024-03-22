export interface FinalClassificationData {
  m_position: number; // Finishing position
  m_numLaps: number; // Number of laps completed
  m_gridPosition: number; // Grid position of the car
  m_points: number; // Number of points scored
  m_numPitStops: number; // Number of pit stops made
  m_resultStatus: number; // Result status - 0 = invalid, 1 = inactive, 2 = active
  // 3 = finished, 4 = didnotfinish, 5 = disqualified
  // 6 = not classified, 7 = retired
  m_bestLapTimeInMS: number; // Best lap time of the session in milliseconds
  m_totalRaceTime: number;
  m_penaltiesTime: number; // Total penalties accumulated in seconds
  m_numPenalties: number; // Number of penalties applied to this driver
  m_numTyreStints: number; // Number of tyre stints up to maximum
  m_tyreStintsActual: number[]; // Actual tyres used by this driver
  m_tyreStintsVisual: number[]; // Visual tyres used by this driver
  m_tyreStintsEndLaps: number[]; // The lap number stints end on
}

export interface PacketFinalClassificationData {
  m_header: PacketHeader; // Header
  m_numCars: number; // Number of cars in the final classification
  m_classificationData: FinalClassificationData[];
}
