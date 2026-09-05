import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import PatientRoutes from "./routes/PatientRoutes.js";
import AppointmentRoutes from "./routes/AppointmentRoutes.js";
import MedicalRecordRoutes from "./routes/MedicalRecordRoutes.js"
import router from "./routes/PatientRoutes.js";

dotenv.config();

const app = express();

app.use(cors()); //allows the express server to use cors to communicate witht he front end
app.use(express.json()); //allows the express server to parse json requests

app.get("/", (req, res) => {
  res.send("CLINCI API IS RUNNING");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});

app.use("/api/patients", PatientRoutes);
app.use("/api/appointments", AppointmentRoutes);
app.use("/api/medical-records",MedicalRecordRoutes);
