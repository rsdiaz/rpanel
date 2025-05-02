import express from "express";
import cors from "cors";
import systemRoutes, { setupSocketIO } from "./routes/system.routes";
import projectsRoutes from "./routes/projects.routes";
import servicesRoutes from "./routes/services.routes";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/projects", projectsRoutes);
app.use("/services", servicesRoutes);

// Configurar Socket.IO
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Configurar eventos de Socket.IO
setupSocketIO(io);

httpServer.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});