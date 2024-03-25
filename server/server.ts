import { PacketSessionData } from "@/types/PacketSessionData";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import F1TelemetryServer from ".";
import { Store } from "./store";

const toJSON = (content: any) =>
  JSON.stringify(content, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

const PORT = 20777; // Port for UDP telemetry data from F1® 23 game
const WEBSOCKET_PORT = 3001; // Port for the WebSocket server

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this according to your frontend's URL for production
  },
});
const TelemetryServer = new F1TelemetryServer();

TelemetryServer.on("session", (data: PacketSessionData) => {
  io.emit("session", toJSON(data));
});

TelemetryServer.on("participants", (data) => {
  io.emit("participants", toJSON(data));
});

TelemetryServer.on("carTelemetry", (data) => {
  io.emit("carTelemetry", toJSON(data));
});

TelemetryServer.on("carDamage", (data) => {
  io.emit("carDamage", toJSON(data));
});

TelemetryServer.on("carStatus", (data) => {
  io.emit("carStatus", toJSON(data));
});

TelemetryServer.on("lapData", (data) => {
  io.emit("lapData", toJSON(data));
});

TelemetryServer.on("event", (data) => {
  io.emit("event", toJSON(data));
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
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket Server listening on *:${WEBSOCKET_PORT}`);
});

const store = new Store();
