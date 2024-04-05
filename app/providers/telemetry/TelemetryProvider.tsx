"use client";
import { parseInfringement } from "@/app/helpers/parseInfringement";
import { parsePenalty } from "@/app/helpers/parsePenalty";
import { CarDamageData, PacketCarDamageData } from "@/types/CarDamageData";
import { CarMotionData, PacketMotionData } from "@/types/CarMotionData";
import { CarStatusData, PacketCarStatusData } from "@/types/CarStatusData";
import {
  CarTelemetryData,
  PacketCarTelemetryData,
} from "@/types/CarTelemetryData";
import {
  FinalClassificationData,
  PacketFinalClassificationData,
} from "@/types/FinalClassificationData";
import { LapData, PacketLapData } from "@/types/LapData";
import {
  FastestLapData,
  PacketEventData,
  PenaltyData,
  RaceWinnerData,
  RetirementData,
} from "@/types/PacketEventData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import {
  PacketParticipantsData,
  ParticipantData,
} from "@/types/ParticipantData";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { useDialog } from "../DialogProvider";
import { useNotifications } from "../NotificationProvider";

interface TelemetryContextType {
  connected: boolean;
  sessionData: PacketSessionData | undefined;
  sessionHistoryData: PacketSessionHistoryData | undefined;
  participantsData: PacketParticipantsData | undefined;
  carTelemetryData: PacketCarTelemetryData | undefined;
  carDamageData: PacketCarDamageData | undefined;
  carStatusData: PacketCarStatusData | undefined;
  lapData: PacketLapData | undefined;
  finalClassificationData: PacketFinalClassificationData | undefined;
  eventsThisSession: Array<PacketEventData> | undefined;
  motionData: PacketMotionData | undefined;
  [key: string]: any;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(
  undefined
);

type TelemetryReturnType = {
  connected: boolean;
  sessionData: PacketSessionData | undefined;
  sessionHistoryData: PacketSessionHistoryData | undefined;
  participantsData: PacketParticipantsData | undefined;
  carTelemetryData: CarTelemetryData | undefined;
  carDamageData: CarDamageData | undefined;
  carStatusData: CarStatusData | undefined;
  lapData: LapData | undefined;
  finalClassificationData: Array<FinalClassificationData> | undefined;
  eventsThisSession: Array<PacketEventData> | undefined;
  motionData: CarMotionData | undefined;
  [key: string]: any;
};

export const useVehicleTelemetry = (
  vehicleIndex: number
): TelemetryReturnType => {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }

  // Directly access and memoize the vehicle-specific data
  const vehicleData = useMemo(() => {
    const vehicleTelemetryData =
      context.carTelemetryData?.m_carTelemetryData[vehicleIndex];
    const vehicleDamageData =
      context.carDamageData?.m_car_damage_data[vehicleIndex];
    const vehicleStatusData =
      context.carStatusData?.m_car_status_data[vehicleIndex];
    const vehicleLapData = context.lapData?.m_lapData[vehicleIndex];
    const vehicleMotionData = context.motionData?.m_carMotionData[vehicleIndex];

    return {
      connected: context.connected,
      sessionData: context.sessionData,
      sessionHistoryData: context.sessionHistoryData,
      participantsData: context.participantsData,
      carTelemetryData: vehicleTelemetryData,
      carDamageData: vehicleDamageData,
      carStatusData: vehicleStatusData,
      lapData: vehicleLapData,
      finalClassificationData:
        context.finalClassificationData?.m_classificationData,
      eventsThisSession: context.eventsThisSession,
      motionData: vehicleMotionData,
    };
  }, [context, vehicleIndex]);

  return vehicleData;
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (context === undefined) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
};

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showPrompt } = useDialog();

  const packet_frequency = useRef<number>(0);
  const packet_frequency_history = useRef<Array<number>>([]);
  const frequency_snap_time = useRef<number>(Date.now());

  const checkFrequency = useCallback(() => {
    const actualFrequency = packet_frequency.current / 5;
    const avgFrequency =
      packet_frequency_history.current.reduce((a, b) => a + b, 0) /
      packet_frequency_history.current.length;

    console.log("Packet frequency:", packet_frequency_history.current);
    if (avgFrequency > 20.5) {
      showPrompt(
        "The packet frequency is above 20Hz which could cause performance issues. This may be because of a high packet frequency setting in the game or another instance of the game running on your network.",
        "High Packet Frequency",
        "warning"
      );
    }
    packet_frequency.current = 0;
    frequency_snap_time.current = Date.now();
    packet_frequency_history.current.push(actualFrequency);
    if (packet_frequency_history.current.length > 10)
      packet_frequency_history.current.shift();
  }, [showPrompt]);

  useEffect(() => {
    const interval = setInterval(checkFrequency, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [checkFrequency]);

  const socket = useRef<Socket | null>(null);
  const router = useRouter();
  const { postNotification } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  const [connected, setConnected] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<PacketSessionData>();
  const [sessionHistoryData, setSessionHistoryData] =
    useState<PacketSessionHistoryData>();

  const [participantsData, setParticipantsData] =
    useState<PacketParticipantsData>();
  const [carTelemetryData, setCarTelemetryData] =
    useState<PacketCarTelemetryData>();
  const [carDamageData, setCarDamageData] = useState<PacketCarDamageData>();
  const [carStatusData, setCarStatusData] = useState<PacketCarStatusData>();
  const [lapData, setLapData] = useState<PacketLapData>();
  const [motionData, setMotionData] = useState<PacketMotionData>();

  const eventsThisSession = useRef<Array<PacketEventData>>([]);

  const [finalClassificationData, setFinalClassificationData] = useState<
    PacketFinalClassificationData | undefined
  >(undefined);

  const dataBuffer = useRef<{
    session?: PacketSessionData;
    sessionHistory?: PacketSessionHistoryData;
    participants?: PacketParticipantsData;
    carTelemetry?: PacketCarTelemetryData;
    carDamage?: PacketCarDamageData;
    carStatus?: PacketCarStatusData;
    lapData?: PacketLapData;
    finalClassification?: PacketFinalClassificationData;
    motionData?: PacketMotionData;
    event?: PacketEventData;
  }>({});

  useEffect(() => {
    console.log("Connecting to WebSocket server");
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setConnected(false);
    });

    const checkAndSetDataIfComplete = () => {
      const requiredTypes = [
        "carTelemetry",
        "carStatus",
        "lapData",
        "motionData",
      ];

      if (requiredTypes.every((type) => type in dataBuffer.current)) {
        packet_frequency.current += 1;
        setCarTelemetryData(dataBuffer.current.carTelemetry);
        setCarStatusData(dataBuffer.current.carStatus);
        setLapData(dataBuffer.current.lapData);

        if (dataBuffer.current.session) {
          setSessionData(dataBuffer.current.session);
        }

        if (dataBuffer.current.sessionHistory) {
          setSessionHistoryData(dataBuffer.current.sessionHistory);
        }

        if (dataBuffer.current.participants) {
          setParticipantsData(dataBuffer.current.participants);
        }

        if (dataBuffer.current.carDamage) {
          setCarDamageData(dataBuffer.current.carDamage);
        }

        if (dataBuffer.current.finalClassification) {
          setFinalClassificationData(dataBuffer.current.finalClassification);
        }

        if (dataBuffer.current.motionData) {
          setMotionData(dataBuffer.current.motionData);
        }

        if (dataBuffer.current.event) {
          eventsThisSession.current = [
            dataBuffer.current.event,
            ...eventsThisSession.current,
          ];
        }

        dataBuffer.current = {};
      }
    };

    socket.current.on("session", (data) => {
      dataBuffer.current.session = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("sessionHistory", (data) => {
      dataBuffer.current.sessionHistory = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("participants", (data) => {
      dataBuffer.current.participants = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("carTelemetry", (data) => {
      dataBuffer.current.carTelemetry = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("carDamage", (data) => {
      dataBuffer.current.carDamage = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("carStatus", (data) => {
      dataBuffer.current.carStatus = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("lapData", (data) => {
      dataBuffer.current.lapData = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("finalClassification", (data) => {
      dataBuffer.current.finalClassification = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("motion", (data) => {
      dataBuffer.current.motionData = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("event", (data) => {
      const parsedData = JSON.parse(data) as PacketEventData;
      if (parsedData.m_eventStringCode === "SSTA") {
        eventsThisSession.current = [];
      }
      dataBuffer.current.event = parsedData;
      checkAndSetDataIfComplete();

      const eventHandlers: { [key: string]: () => void } = {
        FTLP: () => {
          const fastestLapData = parsedData.m_eventDetails as FastestLapData;
          const driver = participantsData?.m_participants.find(
            (participant) => participant.m_aiControlled === 0
          );
          enqueueSnackbar(
            `${driver?.m_name} set the fastest lap with a time of ${fastestLapData.lapTime}`,
            {
              variant: "info",
            }
          );
        },
        RTMT: () => {
          const retirementData = parsedData.m_eventDetails as RetirementData;
          const driver =
            participantsData?.m_participants[retirementData.vehicleIdx];
          enqueueSnackbar(`${driver?.m_name} retired`, {
            variant: "error",
          });
        },
        TMPT: () => {
          enqueueSnackbar(`Your team mate entered the pits`, {
            variant: "info",
          });
        },
        RCWN: () => {
          const raceWinnerData = parsedData.m_eventDetails as RaceWinnerData;
          const driver =
            participantsData?.m_participants[raceWinnerData.vehicleIdx];
          enqueueSnackbar(`${driver?.m_name} won the race!`, {
            variant: "info",
          });
        },
        PENA: () => {
          const penaltyData = parsedData.m_eventDetails as PenaltyData;
          const driver =
            participantsData?.m_participants[penaltyData.vehicleIdx - 1];
          enqueueSnackbar(
            `${
              penaltyData.time !== 255
                ? `${penaltyData.time} second ${parsePenalty(
                    penaltyData.penaltyType
                  ).toLowerCase()}`
                : `${parsePenalty(penaltyData.penaltyType)} `
            } for ${driver?.m_name}: ${parseInfringement(
              penaltyData.infringementType
            )}`,
            {
              variant: "warning",
            }
          );
        },
        DRSE: () => {
          enqueueSnackbar(`DRS enabled`, {
            variant: "info",
          });
        },
      };

      const eventHandler = eventHandlers[parsedData.m_eventStringCode];
      if (eventHandler) {
        eventHandler();
      }
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (finalClassificationData) {
      const existingData = JSON.parse(
        localStorage.getItem("finalClassification") || "{}"
      ) as {
        [key: string]: {
          timestamp: number;
          sessionData: PacketSessionData;
          data: Array<{
            finalClassificationData: FinalClassificationData;
            participantsData: ParticipantData;
          }>;
        };
      };
      localStorage.setItem(
        "finalClassification",
        JSON.stringify({
          ...existingData,
          [finalClassificationData.m_header.session_uid.toString()]: {
            timestamp: Date.now(),
            sessionData: sessionData,
            data: finalClassificationData.m_classificationData.map(
              (data, index) => ({
                finalClassificationData: data,
                participantsData: participantsData!.m_participants[index],
              })
            ),
          },
        })
      );
      postNotification({
        message: "Session results are in!",
        timestamp: Date.now(),
        action: {
          label: "View",
          onClick: () => {
            router.push(
              `/results/${finalClassificationData.m_header.session_uid}`
            );
          },
        },
      });
    }
  }, [finalClassificationData, postNotification, router]);

  return (
    <TelemetryContext.Provider
      value={{
        connected,
        sessionData,
        sessionHistoryData,
        participantsData,
        carTelemetryData,
        carDamageData,
        carStatusData,
        lapData,
        finalClassificationData,
        motionData,
        eventsThisSession: eventsThisSession.current,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
