export interface LobbyInfoData {
  m_aiControlled: number; // Whether the vehicle is AI (1) or Human (0) controlled
  m_teamId: number; // Team id - see appendix (255 if no team currently selected)
  m_nationality: number;
  m_platform: number; // 1 = Steam, 3 = PlayStation, 4 = Xbox, 6 = Origin, 255 = unknown
  m_name: string; // Name of participant in UTF-8 format – null terminated
  // Will be truncated with ... (U+2026) if too long
  m_carNumber: number; // Car number of the player
  m_readyStatus: number; // 0 = not ready, 1 = ready, 2 = spectating
}

export interface PacketLobbyInfoData {
  m_header: PacketHeader; // Header
  m_numPlayers: number; // Number of players in the lobby data
  m_lobbyPlayers: LobbyInfoData[];
}
