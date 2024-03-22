export interface ParticipantData {
  m_aiControlled: number; // Whether the vehicle is AI (1) or Human (0) controlled
  m_driverId: number; // Driver id - see appendix, 255 if network human
  m_networkId: number; // Network id – unique identifier for network players
  m_teamId: number; // Team id - see appendix
  m_myTeam: number; // My team flag – 1 = My Team, 0 = otherwise
  m_raceNumber: number;
  m_nationalty: number;
  m_name: string;
  m_yourTelemetry: number;
  m_showOnlineNames: number;
  m_platform: number;
}

export interface PacketParticipantsData {
  m_header: PacketHeader;
  m_numActiveCars: number;
  m_participants: Array<ParticipantData>;
}
