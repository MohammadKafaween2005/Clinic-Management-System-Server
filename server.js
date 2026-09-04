import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "dotenv/config";
import pool from "./db.js";
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

app.get("/api/patients", async (req, res) => {
  const result = await pool.query("SELECT * FROM patients");
  res.json(result.rows);
});
