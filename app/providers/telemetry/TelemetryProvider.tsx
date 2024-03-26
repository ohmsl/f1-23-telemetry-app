"use client";
import { PacketCarDamageData } from "@/types/CarDamageData";
import { PacketCarStatusData } from "@/types/CarStatusData";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import { PacketLapData } from "@/types/LapData";
import { PacketEventData } from "@/types/PacketEventData";
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
  eventsThisSession: Array<PacketEventData>;
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

let lastSessionDataTime = 0;
let slowPackets = 0;

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useRef<Socket | null>(null);
  const jsonParserWorker = useRef<Worker>();

  const [connected, setConnected] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<PacketSessionData>();

  useEffect(() => {
    jsonParserWorker.current = new Worker(
      new URL("../../workers/jsonParser.worker.ts", import.meta.url)
    );
    if (!sessionData) return;
    console.log(`
      Session packet arrived!
      Time since last session packet: ${Date.now() - lastSessionDataTime}ms
      ${
        Date.now() - lastSessionDataTime > 1000
          ? `Slow packets: ${++slowPackets}`
          : `Slow packets: ${slowPackets}`
      }
    `);
    lastSessionDataTime = Date.now();
  }, [sessionData]);

  const [participantsData, setParticipantsData] =
    useState<PacketParticipantsData>();
  const [carTelemetryData, setCarTelemetryData] =
    useState<PacketCarTelemetryData>();
  const [carDamageData, setCarDamageData] = useState<PacketCarDamageData>();
  const [carStatusData, setCarStatusData] = useState<PacketCarStatusData>();
  const [lapData, setLapData] = useState<PacketLapData>();

  const eventsThisSession = useRef<Array<PacketEventData>>([]);

  const dataBuffer = useRef<{
    session?: PacketSessionData;
    participants?: PacketParticipantsData;
    carTelemetry?: PacketCarTelemetryData;
    carDamage?: PacketCarDamageData;
    carStatus?: PacketCarStatusData;
    lapData?: PacketLapData;
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
      const requiredTypes = ["carTelemetry", "carStatus", "lapData"];

      if (requiredTypes.every((type) => type in dataBuffer.current)) {
        setCarTelemetryData(dataBuffer.current.carTelemetry);
        setCarStatusData(dataBuffer.current.carStatus);
        setLapData(dataBuffer.current.lapData);

        // Update other states as necessary

        if (dataBuffer.current.event) {
          eventsThisSession.current.push(dataBuffer.current.event);
        }

        if (dataBuffer.current.session) {
          setSessionData(dataBuffer.current.session);
        }

        if (dataBuffer.current.participants) {
          setParticipantsData(dataBuffer.current.participants);
        }

        if (dataBuffer.current.carDamage) {
          setCarDamageData(dataBuffer.current.carDamage);
        }

        dataBuffer.current = {};
      }
    };

    socket.current.on("session", (data) => {
      dataBuffer.current.session = JSON.parse(data);
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

    socket.current.on("event", (data) => {
      dataBuffer.current.event = JSON.parse(data);
      checkAndSetDataIfComplete();
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
        eventsThisSession: eventsThisSession.current,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
