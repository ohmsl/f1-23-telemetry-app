"use client";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import { PacketSessionData } from "@/types/PacketSessionData";
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
  sessionData?: PacketSessionData;
  carTelemetryData?: PacketCarTelemetryData;
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
  const [carTelemetryData, setCarTelemetryData] =
    useState<PacketCarTelemetryData>();

  useEffect(() => {
    console.log("carTelemetryData", carTelemetryData);
  }, [carTelemetryData]);

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

    socket.current.on("sessionData", (data) => {
      const parsedData = JSON.parse(data) as PacketSessionData;
      setSessionData(parsedData);
    });

    socket.current.on("carTelemetry", (data) => {
      const parsedData = JSON.parse(data) as PacketCarTelemetryData;
      setCarTelemetryData(parsedData);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  return (
    <TelemetryContext.Provider
      value={{ connected, sessionData, carTelemetryData }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};
