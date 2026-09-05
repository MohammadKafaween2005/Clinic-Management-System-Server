import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
  SELECT
    appointments.appointment_id,
    appointments.patient_id,
    patients.first_name,
    patients.last_name,
    appointments.doctor_id,
    appointments.appointment_date,
    appointments.appointment_time,
    appointments.duration_minutes,
    appointments.reason,
    appointments.status
  FROM appointments
  JOIN patients
    ON appointments.patient_id = patients.patient_id
  ORDER BY appointments.appointment_date, appointments.appointment_time
`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT
        appointments.appointment_id,
        appointments.patient_id,
        patients.first_name,
        patients.last_name,
        appointments.doctor_id,
        appointments.appointment_date,
        appointments.appointment_time,
        appointments.duration_minutes,
        appointments.reason,
        appointments.status
      FROM appointments
      JOIN patients
        ON appointments.patient_id = patients.patient_id
      WHERE appointments.appointment_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Appointment not found",
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

router.get("/patient/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT
        appointments.appointment_id,
        appointments.patient_id,
        patients.first_name,
        patients.last_name,
        appointments.doctor_id,
        appointments.appointment_date,
        appointments.appointment_time,
        appointments.duration_minutes,
        appointments.reason,
        appointments.status
      FROM appointments
      JOIN patients
        ON appointments.patient_id = patients.patient_id
      WHERE patients.patient_id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Appointment not found",
      });
    }
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
    const { patient_id, appointment_date, appointment_time, reason } = req.body;

    if (!patient_id || !appointment_date || !appointment_time || !reason) {
      return res.status(400).json({
        error: "Patient, date, time, and reason are required",
      });
    }

    const doctor_id = 1;
    const duration_minutes = 30;
    const status = "Scheduled";

    const existingAppointment = await pool.query(
      `SELECT * FROM appointments
       WHERE doctor_id = $1
       AND appointment_date = $2
       AND appointment_time = $3
       AND status != 'Cancelled'`,
      [doctor_id, appointment_date, appointment_time],
    );

    if (existingAppointment.rows.length > 0) {
      return res.status(409).json({
        error: "This time slot is already booked",
      });
    }

    const result = await pool.query(
      `INSERT INTO appointments
      (
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration_minutes,
        reason,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration_minutes,
        reason,
        status,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      duration_minutes,
      reason,
      status,
    } = req.body;
    const result = await pool.query(
      `UPDATE appointments
       SET patient_id = $1,
           doctor_id = $2,
           appointment_date = $3,
           appointment_time = $4,
           duration_minutes = $5,
           reason = $6,
           status = $7
       WHERE appointment_id = $8
       RETURNING *`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        duration_minutes,
        reason,
        status,
        id,
      ],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Appointment not found",
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

router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE appointments
       SET status = 'Cancelled'
       WHERE appointment_id = $1
       RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Appointment not found",
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

router.get("/date/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const result = await pool.query(
      `SELECT
        appointments.appointment_id,
        appointments.patient_id,
        patients.first_name,
        patients.last_name,
        appointments.doctor_id,
        appointments.appointment_date,
        appointments.appointment_time,
        appointments.duration_minutes,
        appointments.reason,
        appointments.status
      FROM appointments
      JOIN patients
        ON appointments.patient_id = patients.patient_id
      WHERE appointments.appointment_date = $1
      ORDER BY appointments.appointment_time`,
      [date],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});
export default router;
