import { useBufferStore } from "@/app/stores/bufferStore";
import type { PacketEventData } from "@/types/PacketEventData";
import type { PacketSessionData } from "@/types/PacketSessionData";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import {
  useTelemetryStore,
  type TelemetryDataBufferType,
} from "../../stores/telemetryStore";
import { useDialog } from "../DialogProvider";
import { useNotifications } from "../NotificationProvider";
import { handleRaceEvent } from "./handleRaceEvent";

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const socket = useRef<Socket | null>(null);

  const packet_frequency = useRef<number>(0);
  const packet_frequency_history = useRef<Array<number>>([]);
  const frequency_snap_time = useRef<number>(Date.now());

  const { showPrompt } = useDialog();
  const { postNotification } = useNotifications();

  const { setConnected, addEvent } = useTelemetryStore();
  const { setDataBuffer, checkAndApplyData } = useBufferStore();

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

  useEffect(() => {
    console.log("Connecting to WebSocket server");
    socket.current = io("http://192.168.50.108:3001");

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setConnected(false);
    });

    const packetHandlers: { [key: string]: keyof TelemetryDataBufferType } = {
      session: "sessionData",
      sessionHistory: "sessionHistoryData",
      participants: "participantsData",
      carTelemetry: "carTelemetryData",
      carDamage: "carDamageData",
      carStatus: "carStatusData",
      lapData: "lapData",
      finalClassification: "finalClassificationData",
      motion: "motionData",
    };

    Object.entries(packetHandlers).forEach(([packet, bufferKey]) => {
      socket.current?.on(packet, (data) => {
        setDataBuffer(bufferKey, JSON.parse(data));
        checkAndApplyData(() => packet_frequency.current++);
      });
    });

    socket.current.on("event", (data) => {
      const parsedData = JSON.parse(data) as PacketEventData;
      if (parsedData?.m_eventStringCode === "SSTA") {
        useTelemetryStore.setState({ eventsThisSession: [] });
      }
      addEvent(parsedData);
      checkAndApplyData();

      handleRaceEvent(parsedData);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const telemetryData = useTelemetryStore.getState();

    const finalClassificationData = telemetryData.finalClassificationData;

    if (finalClassificationData) {
      const existingData = JSON.parse(
        localStorage.getItem("finalClassification") || "{}"
      ) as {
        [key: string]: {
          timestamp: number;
          sessionData: PacketSessionData;
          data: Array<{
            finalClassificationData: any;
            participantsData: any;
          }>;
        };
      };
      localStorage.setItem(
        "finalClassification",
        JSON.stringify({
          ...existingData,
          [finalClassificationData.m_header.session_uid.toString()]: {
            timestamp: Date.now(),
            sessionData: telemetryData.sessionData,
            data: finalClassificationData.m_classificationData.map(
              (data, index) => ({
                finalClassificationData: data,
                participantsData:
                  telemetryData.participantsData?.m_participants[index],
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
  }, [postNotification, router]);

  return <>{children}</>;
};
