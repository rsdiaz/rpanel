import express from "express";
import cors from "cors";
import systemRoutes from "./routes/system.routes";
import templateRoutes from "./routes/templates.routes";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/api/templates", templateRoutes);

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});