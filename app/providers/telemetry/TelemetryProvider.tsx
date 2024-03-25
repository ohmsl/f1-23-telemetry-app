"use client";
import { PacketCarDamageData } from "@/types/CarDamageData";
import { PacketCarStatusData } from "@/types/CarStatusData";
import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import { PacketLapData } from "@/types/LapData";
import { PacketEventData } from "@/types/PacketEventData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketParticipantsData } from "@/types/ParticipantData";
import throttle from "lodash.throttle";
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

  const throttledSetSessionData = useRef(
    throttle((data: PacketSessionData) => {
      setSessionData(data);
    }, 1000)
  );

  const throttledSetEventsThisSession = useRef(
    throttle((data: Array<PacketEventData>) => {
      eventsThisSession.current = data;
    }, 3000)
  );

  useEffect(() => {
    jsonParserWorker.current = new Worker(
      new URL("../../workers/jsonParser.worker.ts", import.meta.url),
      { type: "module" }
    );

    jsonParserWorker.current.onmessage = (e) => {
      if (e.data.error) {
        console.error("JSON parsing error in worker:", e.data.error);
      } else {
        const buffer = e.data;
        if (!buffer) return;

        if (buffer.session) {
          throttledSetSessionData.current(buffer.session);
        }

        if (buffer.participants) {
          setParticipantsData(buffer.participants);
        }

        if (buffer.carTelemetry) {
          setCarTelemetryData(buffer.carTelemetry);
        }

        if (buffer.carDamage) {
          setCarDamageData(buffer.carDamage);
        }

        if (buffer.carStatus) {
          setCarStatusData(buffer.carStatus);
        }

        if (buffer.lapData) {
          setLapData(buffer.lapData);
        }

        if (buffer.event) {
          throttledSetEventsThisSession.current([
            ...eventsThisSession.current,
            buffer.event,
          ]);
        }
      }
    };

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
      jsonParserWorker.current?.postMessage({ type: "session", data });
    });

    socket.current.on("participants", (data) => {
      jsonParserWorker.current?.postMessage({ type: "participants", data });
    });

    socket.current.on("carTelemetry", (data) => {
      jsonParserWorker.current?.postMessage({ type: "carTelemetry", data });
    });

    socket.current.on("carDamage", (data) => {
      jsonParserWorker.current?.postMessage({ type: "carDamage", data });
    });

    socket.current.on("carStatus", (data) => {
      jsonParserWorker.current?.postMessage({ type: "carStatus", data });
    });

    socket.current.on("lapData", (data) => {
      jsonParserWorker.current?.postMessage({ type: "lapData", data });
    });

    socket.current.on("event", (data) => {
      jsonParserWorker.current?.postMessage({ type: "event", data });
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
