import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { toJSON } from "./utils/toJSON";

dotenv.config();

const app: Express = express();
const server: HTTPServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const router = express.Router();
const prisma = new PrismaClient();

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.get("/sessions", async (req, res) => {
  const sessions = await prisma.session.findMany();
  res.send(toJSON(sessions));
});

router.get("/sessions/:id", async (req, res) => {
  const { id } = req.params;
  const session = await prisma.session.findUnique({
    where: {
      id: id,
    },
    include: {
      lapHistory: true,
    },
  });
  res.json(toJSON(session));
});

app.use(cors());
app.use(express.json());
app.use(router);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export const startApi = async () => {
  server.listen(9000, () => {
    const address = server.address();
    console.log(`Server started on port: ${(address as any).port}`);
  });
};
