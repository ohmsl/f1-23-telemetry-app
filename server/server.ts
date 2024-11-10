import { CarDamageData, PacketCarDamageData } from "@/types/CarDamageData";
import { CarSetupData, PacketCarSetupData } from "@/types/CarSetupData";
import { CarStatusData, PacketCarStatusData } from "@/types/CarStatusData";
import { PacketSessionData } from "@/types/PacketSessionData";
import { PacketSessionHistoryData } from "@/types/PacketSessionHistoryData";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import F1TelemetryServer from ".";
import {
  LapHistory,
  SessionHistoryBuffer,
} from "../types/SessionHistoryBuffer";
import { startApi } from "./api";
import { toJSON } from "./utils/toJSON";

const PORT = 20777; // Port for UDP telemetry data from F1® 23 game
const WEBSOCKET_PORT = 3001; // Port for the WebSocket server

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this according to your frontend's URL for production
  },
});
const TelemetryServer = new F1TelemetryServer();
const prisma = new PrismaClient();

let sessionBuffer: PacketSessionData;
TelemetryServer.on("session", (data: PacketSessionData) => {
  io.emit("session", toJSON(data));
  sessionBuffer = data;
});

TelemetryServer.on("participants", (data) => {
  io.emit("participants", toJSON(data));
});

TelemetryServer.on("carTelemetry", (data) => {
  io.emit("carTelemetry", toJSON(data));
});

let currentCarDamage: CarDamageData;
TelemetryServer.on("carDamage", (data: PacketCarDamageData) => {
  io.emit("carDamage", toJSON(data));
  currentCarDamage = data?.m_car_damage_data?.[data.m_header.player_car_index];
});

let currentCarStatus: CarStatusData;
TelemetryServer.on("carStatus", (data: PacketCarStatusData) => {
  io.emit("carStatus", toJSON(data));
  currentCarStatus = data.m_car_status_data[data.m_header.player_car_index];
});

TelemetryServer.on("lapData", (data) => {
  io.emit("lapData", toJSON(data));
});

let sessionHistoryBuffer: SessionHistoryBuffer;
TelemetryServer.on("sessionHistory", (data: PacketSessionHistoryData) => {
  const parsedData = toJSON(data);
  io.emit("sessionHistory", parsedData);

  if (data.m_carIdx === sessionBuffer?.m_header?.player_car_index) {
    const currentLapIdx = data.m_lapHistoryData.findIndex(
      (lap) => lap.m_lapTimeInMS === 0
    );
    sessionHistoryBuffer = {
      ...data,
      m_lapHistoryData: (data.m_lapHistoryData as Array<LapHistory>).map(
        (lap, idx): LapHistory => {
          if (idx === currentLapIdx) {
            return {
              ...lap,
              carSetup: currentCarSetup,
              tyres: currentCarDamage.m_tyres_wear,
            };
          }
          return lap;
        }
      ),
    };
  }
});

let currentCarSetup: CarSetupData;
TelemetryServer.on("carSetup", (data: PacketCarSetupData) => {
  io.emit("carSetup", toJSON(data));
  currentCarSetup = data.m_carSetups[data.m_header.player_car_index];
});

TelemetryServer.on("event", (data) => {
  io.emit("event", toJSON(data));
  // handleEvent(data);
});

// const handleEvent = async (event: PacketEventData) => {
//   if (event?.m_eventStringCode === "SEND") {
//     prisma.session
//       .create({
//         data: {
//           id: sessionBuffer.m_header.session_uid.toString(),
//           sessionType: sessionBuffer.m_sessionType,
//           trackId: sessionBuffer.m_trackId,
//           sessionDuration: sessionBuffer.m_sessionDuration,
//           pitSpeedLimit: sessionBuffer.m_pitSpeedLimit,
//           networkGame: sessionBuffer.m_networkGame === 1,
//           forecastAccuracy: sessionBuffer.m_forecastAccuracy,
//           aiDifficulty: sessionBuffer.m_aiDifficulty,
//           seasonLinkIdentifier: sessionBuffer.m_seasonLinkIdentifier,
//           weekendLinkIdentifier: sessionBuffer.m_weekendLinkIdentifier,
//           sessionLinkIdentifier: sessionBuffer.m_sessionLinkIdentifier,
//           totalLaps: sessionBuffer.m_totalLaps,
//           bestLapNum: sessionHistoryBuffer?.m_bestLapTimeLapNum ?? 0,
//           lapHistory: sessionHistoryBuffer?.m_lapHistoryData
//             ? {
//                 create: sessionHistoryBuffer.m_lapHistoryData
//                   .filter((lap) => lap.m_lapTimeInMS !== 0)
//                   .map((lapData) => ({
//                     lapTimeInMS: lapData.m_lapTimeInMS,
//                     sector1TimeInMS: lapData.m_sector1TimeInMS,
//                     sector2TimeInMS: lapData.m_sector2TimeInMS,
//                     sector3TimeInMS: lapData.m_sector3TimeInMS,
//                     carSetup: {
//                       create: {
//                         frontWing: lapData.carSetup.m_frontWing,
//                         rearWing: lapData.carSetup.m_rearWing,
//                         onThrottle: lapData.carSetup.m_onThrottle,
//                         offThrottle: lapData.carSetup.m_offThrottle,
//                         frontCamber: lapData.carSetup.m_frontCamber,
//                         rearCamber: lapData.carSetup.m_rearCamber,
//                         frontToe: lapData.carSetup.m_frontToe,
//                         rearToe: lapData.carSetup.m_rearToe,
//                         frontSuspension: lapData.carSetup.m_frontSuspension,
//                         rearSuspension: lapData.carSetup.m_rearSuspension,
//                         frontAntiRollBar: lapData.carSetup.m_frontAntiRollBar,
//                         rearAntiRollBar: lapData.carSetup.m_rearAntiRollBar,
//                         frontSuspensionHeight:
//                           lapData.carSetup.m_frontSuspensionHeight,
//                         rearSuspensionHeight:
//                           lapData.carSetup.m_rearSuspensionHeight,
//                         brakePressure: lapData.carSetup.m_brakePressure,
//                         brakeBias: lapData.carSetup.m_brakeBias,
//                         frontTyrePressure:
//                           lapData.carSetup.m_frontLeftTyrePressure,
//                         rearTyrePressure:
//                           lapData.carSetup.m_rearLeftTyrePressure,
//                         ballast: lapData.carSetup.m_ballast,
//                         fuelLoad: lapData.carSetup.m_fuelLoad,
//                       },
//                     },
//                     tyres: {
//                       // create for each tyre which there are 4 of
//                       create: lapData.tyres.map((tyreWear, idx) => ({
//                         tyreLocation: idx,
//                         tyreWear,
//                         tyreCompound: currentCarStatus.m_visual_tyre_compound,
//                       })),
//                     },
//                   })),
//               }
//             : undefined,
//         },
//       })
//       .catch((error) => {
//         console.error(error);
//       })
//       .finally(() => {
//         console.log("Session saved");
//       });
//   }
// };

TelemetryServer.on("finalClassification", (data) => {
  io.emit("finalClassification", toJSON(data));
});

TelemetryServer.on("motion", (data) => {
  io.emit("motion", toJSON(data));
});

TelemetryServer.on("error", (error: Error) => {
  console.error(error);
});

TelemetryServer.start();

// setInterval(() => {
//   const data = store.getSpeedForLast2Seconds();
//   io.emit("speed", toJSON(data));
//   console.log(data);
// }, 2000);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  prisma.$connect();
  socket.on("disconnect", () => {
    console.log("User disconnected");
    prisma.$disconnect();
  });
});

httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket Server listening on *:${WEBSOCKET_PORT}`);
});

startApi();

// const store = new Store();
