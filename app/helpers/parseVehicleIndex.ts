import { ParticipantData } from "@/types/ParticipantData";
import getTeam from "./getTeam";

const parseVechicleIndex = (
  vehicleIndex: number,
  participantData: Array<ParticipantData>
) => {
  const participant = participantData[vehicleIndex];
  const teamName = participant ? getTeam(participant.m_teamId) : "Unknown";
  return {
    driverId: participant ? participant.m_driverId : "Unknown",
    driverName: participant ? participant.m_name : "Unknown",
    teamName,
  };
};

export default parseVechicleIndex;
