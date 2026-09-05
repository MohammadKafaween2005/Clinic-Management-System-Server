import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        medical_records.record_id,
        medical_records.patient_id,
        patients.first_name,
        patients.last_name,
        medical_records.doctor_id,
        medical_records.record_date,
        medical_records.diagnosis,
        medical_records.notes,
        medical_records.treatment
      FROM medical_records
      JOIN patients
        ON medical_records.patient_id = patients.patient_id
      WHERE medical_records.patient_id = $1
      ORDER BY medical_records.record_date DESC`,
      [id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const { patient_id, diagnosis, notes, treatment } = req.body;

    if (!patient_id || !diagnosis) {
      return res.status(400).json({
        error: "Patient and diagnosis are required",
      });
    }

    const doctor_id = 1;

    const result = await pool.query(
      `INSERT INTO medical_records
      (
        patient_id,
        doctor_id,
        diagnosis,
        notes,
        treatment
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [patient_id, doctor_id, diagnosis, notes, treatment],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
        medical_records.record_id,
        medical_records.patient_id,
        patients.first_name,
        patients.last_name,
        medical_records.doctor_id,
        medical_records.record_date,
        medical_records.diagnosis,
        medical_records.notes,
        medical_records.treatment
      FROM medical_records
      JOIN patients
        ON medical_records.patient_id = patients.patient_id
      WHERE medical_records.record_id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Medical record not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});
export default router;
