import express from "express";
import pool from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const result = await pool.query(
      `SELECT user_id, email, password, role
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    let profileId = null;

    if (user.role === "patient") {
      const patientResult = await pool.query(
        `SELECT patient_id
         FROM patients
         WHERE user_id = $1`,
        [user.user_id],
      );

      profileId = patientResult.rows[0]?.patient_id;
    }

    if (user.role === "doctor") {
      const doctorResult = await pool.query(
        `SELECT doctor_id
         FROM doctors
         WHERE user_id = $1`,
        [user.user_id],
      );

      profileId = doctorResult.rows[0]?.doctor_id;
    }

    if (user.role === "receptionist") {
      const receptionistResult = await pool.query(
        `SELECT receptionist_id
         FROM receptionists
         WHERE user_id = $1`,
        [user.user_id],
      );

      profileId = receptionistResult.rows[0]?.receptionist_id;
    }

    res.json({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      profile_id: profileId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        error: "Full name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1, $2, 'patient')
       RETURNING user_id, email, role`,
      [email, hashedPassword],
    );

    const user = userResult.rows[0];

    const names = full_name.trim().split(" ");

    const first_name = names[0];
    const last_name = names.slice(1).join(" ");

    const patientResult = await pool.query(
      `INSERT INTO patients
       (user_id, first_name, last_name, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user.user_id, first_name, last_name, email],
    );

    res.status(201).json({
      user,
      patient: patientResult.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
});
export default router;
