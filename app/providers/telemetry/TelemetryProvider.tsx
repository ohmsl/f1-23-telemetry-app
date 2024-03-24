"use client";
import { PacketCarDamageData } from "@/types/CarDamageData";
import { PacketCarStatusData } from "@/types/CarStatusData";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import { PacketLapData } from "@/types/LapData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketParticipantsData } from "@/types/ParticipantData";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

interface TelemetryContextType {
  connected: boolean;
  sessionData: PacketSessionData | undefined;
  participantsData: PacketParticipantsData | undefined;
  carTelemetryData: PacketCarTelemetryData | undefined;
  carDamageData: PacketCarDamageData | undefined;
  carStatusData: PacketCarStatusData | undefined;
  lapData: PacketLapData | undefined;
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
  const [connected, setConnected] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<PacketSessionData>();
  const [participantsData, setParticipantsData] =
    useState<PacketParticipantsData>();
  const [carTelemetryData, setCarTelemetryData] =
    useState<PacketCarTelemetryData>();
  const [carDamageData, setCarDamageData] = useState<PacketCarDamageData>();
  const [carStatusData, setCarStatusData] = useState<PacketCarStatusData>();
  const [lapData, setLapData] = useState<PacketLapData>();

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

    socket.current.on("session", (data) => {
      const parsedData = JSON.parse(data) as PacketSessionData;
      setSessionData(parsedData);
    });

    socket.current.on("participants", (data) => {
      const parsedData = JSON.parse(data) as PacketParticipantsData;
      setParticipantsData(parsedData);
    });

    socket.current.on("carTelemetry", (data) => {
      const parsedData = JSON.parse(data) as PacketCarTelemetryData;
      setCarTelemetryData(parsedData);
    });

    socket.current.on("carDamage", (data) => {
      const parsedData = JSON.parse(data) as PacketCarDamageData;
      setCarDamageData(parsedData);
    });

    socket.current.on("carStatus", (data) => {
      const parsedData = JSON.parse(data) as PacketCarStatusData;
      setCarStatusData(parsedData);
    });

    socket.current.on("lapData", (data) => {
      const parsedData = JSON.parse(data) as PacketLapData;
      setLapData(parsedData);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  return (
    <TelemetryContext.Provider
      value={{
        connected,
        sessionData,
        participantsData,
        carTelemetryData,
        carDamageData,
        carStatusData,
        lapData,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
