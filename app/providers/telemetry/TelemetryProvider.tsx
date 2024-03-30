"use client";
import { PacketCarDamageData } from "@/types/CarDamageData";
import { PacketMotionData } from "@/types/CarMotionData";
import { PacketCarStatusData } from "@/types/CarStatusData";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import {
  FinalClassificationData,
  PacketFinalClassificationData,
} from "@/types/FinalClassificationData";
import { PacketLapData } from "@/types/LapData";
import { PacketEventData } from "@/types/PacketEventData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import {
  PacketParticipantsData,
  ParticipantData,
} from "@/types/ParticipantData";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
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
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(
  undefined
);

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
  const socket = useRef<Socket | null>(null);
  // const jsonParserWorker = useRef<Worker>();
  const router = useRouter();
  const { postNotification } = useNotifications();

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
          eventsThisSession.current.push(dataBuffer.current.event);
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
      console.log("Received motion data");
      dataBuffer.current.motionData = JSON.parse(data);
      checkAndSetDataIfComplete();
    });

    socket.current.on("event", (data) => {
      dataBuffer.current.event = JSON.parse(data);
      checkAndSetDataIfComplete();
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
