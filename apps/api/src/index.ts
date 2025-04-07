import express from "express";
import cors from "cors";
import systemRoutes from "./routes/system.routes";
import appsRoutes from "./routes/apps.routes";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/apps", appsRoutes)

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
