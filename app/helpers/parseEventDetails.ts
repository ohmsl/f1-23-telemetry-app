import {
  DriveThroughPenaltyServedData,
  FastestLapData,
  FlashbackData,
  OvertakeData,
  PacketEventData,
  PenaltyData,
  RaceWinnerData,
  RetirementData,
  SpeedTrapData,
  StartLightsData,
  StopGoPenaltyServedData,
} from "@/types/PacketEventData";
import { ParticipantData } from "@/types/ParticipantData";
import parseVechicleIndex from "./parseVehicleIndex";

const parseEventDetails = (
  event: PacketEventData,
  participantData: Array<ParticipantData>
) => {
  switch (event.m_eventStringCode) {
    case "FTLP":
      return `${
        (event.m_eventDetails as FastestLapData).vehicleIdx
      } set the fastest lap with a time of ${
        (event.m_eventDetails as FastestLapData).lapTime
      }`;
    case "RTMT":
      return `Driver ${
        parseVechicleIndex(
          (event.m_eventDetails as RetirementData).vehicleIdx,
          participantData
        ).driverName
      } retired`;
    case "TMPT":
      return `Your team mate entered the pits`;
    case "RCWN":
      return `Driver ${
        parseVechicleIndex(
          (event.m_eventDetails as RaceWinnerData).vehicleIdx,
          participantData
        ).driverName
      } won the race!`;
    case "PENA":
      return `A penalty was issued: ${parsePenalty(
        (event.m_eventDetails as PenaltyData).penaltyType
      )} for ${
        parseVechicleIndex(
          (event.m_eventDetails as PenaltyData).vehicleIdx,
          participantData
        ).driverName
      } - ${(event.m_eventDetails as PenaltyData).infringementType}`;
    case "SPTP":
      return `Speed trap triggered by ${
        parseVechicleIndex(
          (event.m_eventDetails as SpeedTrapData).vehicleIdx,
          participantData
        ).driverName
      } with a speed of ${(event.m_eventDetails as SpeedTrapData).speed.toFixed(
        0
      )} km/h`;
    case "STLG":
      return `Start lights: ${
        (event.m_eventDetails as StartLightsData).numLights
      }`;
    case "LGOT":
      return "Lights out!";
    case "DTSV":
      return `Drive through penalty served by ${
        parseVechicleIndex(
          (event.m_eventDetails as DriveThroughPenaltyServedData).vehicleIdx,
          participantData
        ).driverName
      }`;
    case "SGSV":
      return `Stop go penalty served by ${
        parseVechicleIndex(
          (event.m_eventDetails as StopGoPenaltyServedData).vehicleIdx,
          participantData
        ).driverName
      }`;
    case "FLBK":
      return `Flashback activated at frame ${
        (event.m_eventDetails as FlashbackData).flashbackFrameIdentifier
      }`;

    case "OVTK":
      return `Overtake occurred: ${
        parseVechicleIndex(
          (event.m_eventDetails as OvertakeData).overtakingVehicleIdx,
          participantData
        ).driverName
      } overtook ${
        parseVechicleIndex(
          (event.m_eventDetails as OvertakeData).beingOvertakenVehicleIdx,
          participantData
        ).driverName
      }`;

    default:
      return "Unknown event";
  }
};

export default parseEventDetails;
