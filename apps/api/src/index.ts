import express from "express";
import cors from "cors";
import systemRoutes from "./routes/system.routes";
import projectsRoutes from "./routes/projects.routes";
import servicesRoutes from "./routes/services.routes";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/projects", projectsRoutes)
app.use("/services", servicesRoutes)

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
