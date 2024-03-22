import { PacketSessionData } from "@/types/PacketSessionData";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import F1TelemetryClient from ".";

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
const TelemetryClient = new F1TelemetryClient();

TelemetryClient.on("listening", () => {
  const address = TelemetryClient.address;
  console.log(`UDP Server listening on ${address}`);
});

TelemetryClient.on("session", (data: PacketSessionData) => {
  io.emit("sessionData", toJSON(data));
});

TelemetryClient.on("carTelemetry", (data) => {
  io.emit("carTelemetry", toJSON(data));
});

TelemetryClient.on("error", (error: Error) => {
  console.error(error);
});

TelemetryClient.start();

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket Server listening on *:${WEBSOCKET_PORT}`);
});
