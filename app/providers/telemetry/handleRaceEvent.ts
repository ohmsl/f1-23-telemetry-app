import { formatTime } from "@/app/helpers/formatTime";
import { parseInfringement } from "@/app/helpers/parseInfringement";
import { parsePenalty } from "@/app/helpers/parsePenalty";
import type {
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
import { enqueueSnackbar } from "notistack";
import { useTelemetryStore } from "../../stores/telemetryStore";

export const handleRaceEvent = (data: PacketEventData) => {
  const participantsData = useTelemetryStore.getState().participantsData;
  const getDriverName = (vehicleIdx: number) => {
    const driver = participantsData?.m_participants[vehicleIdx];
    return driver?.m_name || "Unknown Driver";
  };

  const eventHandlers: { [key: string]: () => void } = {
    // Fastest Lap
    FTLP: () => {
      const details = data.m_eventDetails as FastestLapData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(
        `${driverName} set the fastest lap with a time of ${formatTime(
          details.lapTime
        )}`
      );
    },
    // Retirement
    RTMT: () => {
      const details = data.m_eventDetails as RetirementData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(`${driverName} has retired from the race.`, {
        variant: "error",
      });
    },
    // Team Mate in Pits
    TMPT: () => {
      enqueueSnackbar(`Your team mate has entered the pits.`);
    },
    // Race Winner
    RCWN: () => {
      const details = data.m_eventDetails as RaceWinnerData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(`${driverName} has won the race!`);
    },
    // Penalty Issued
    PENA: () => {
      const details = data.m_eventDetails as PenaltyData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(
        `${
          details.time !== 255
            ? `${details.time} second ${parsePenalty(
                details.penaltyType
              ).toLowerCase()}`
            : `${parsePenalty(details.penaltyType)} `
        } for ${driverName}: ${parseInfringement(details.infringementType)}`,
        {
          variant: "warning",
        }
      );
    },
    // Speed Trap Triggered
    SPTP: () => {
      const details = data.m_eventDetails as SpeedTrapData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(
        `${driverName} was caught in the speed trap at ${details.speed} km/h`
      );
    },
    // Start Lights
    STL: () => {
      const details = data.m_eventDetails as StartLightsData;
      enqueueSnackbar(`Start lights: ${details.numLights} lights illuminated.`);
    },
    // Drive Through Penalty Served
    DRTS: () => {
      const details = data.m_eventDetails as DriveThroughPenaltyServedData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(`${driverName} has served a drive-through penalty.`);
    },
    // Stop-Go Penalty Served
    SGPT: () => {
      const details = data.m_eventDetails as StopGoPenaltyServedData;
      const driverName = getDriverName(details.vehicleIdx);
      enqueueSnackbar(`${driverName} has served a stop-go penalty.`);
    },
    // Flashback
    FLBK: () => {
      const details = data.m_eventDetails as FlashbackData;
      enqueueSnackbar(
        `Flashback used to frame identifier ${details.flashbackFrameIdentifier} at session time ${details.flashbackSessionTime}`
      );
    },
    // Buttons
    BUTN: () => {
      return;
    },
    // Overtake
    OVTK: () => {
      const details = data.m_eventDetails as OvertakeData;
      const overtakingDriver = getDriverName(details.overtakingVehicleIdx);
      const beingOvertakenDriver = getDriverName(
        details.beingOvertakenVehicleIdx
      );
      enqueueSnackbar(`${overtakingDriver} overtook ${beingOvertakenDriver}`);
    },
    DRSE: () => {
      enqueueSnackbar(`DRS enabled`, {
        variant: "info",
      });
    },
  };

  const eventHandler = eventHandlers[data.m_eventStringCode];
  if (eventHandler) {
    eventHandler();
  } else {
    console.warn(
      `Unhandled event type: ${data.m_eventStringCode}`,
      data.m_eventDetails
    );
  }
};
